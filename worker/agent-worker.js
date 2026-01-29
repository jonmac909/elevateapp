#!/usr/bin/env node
/**
 * Elevate AI Agent Worker
 * 
 * Runs on the VPS, polls Supabase for pending agent jobs, processes them
 * via Clawdbot gateway (localhost), and writes results back to Supabase.
 * 
 * No Cloudflare in the AI call path = no timeout issues.
 * 
 * Usage: node worker/agent-worker.js
 * Or with PM2: pm2 start worker/agent-worker.js --name elevate-worker
 */

const SUPABASE_URL = 'https://vrpoistmzewykpkemmer.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycG9pc3RtemV3eWtwa2VtbWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTUyNjEsImV4cCI6MjA4MjY5MTI2MX0.Mj7B6BQsZU0RVt_rfgBBjKD7Tsqt1RlzDib3Rie1_ho';

// Clawdbot gateway — localhost, no Cloudflare proxy
const GATEWAY_URL = 'http://127.0.0.1:18789/v1/chat/completions';
const GATEWAY_TOKEN = 'ana-voice-agent-2026';
const MODEL = 'anthropic/claude-opus-4-5';

const POLL_INTERVAL_MS = 3000; // Check every 3 seconds

// Import compiled agent prompts
const { getAgentPrompt: _getAgentPrompt, getAgentModelGateway: _getAgentModelGateway } = require('./compiled/agent-prompts');
const getAgentPrompt = _getAgentPrompt;
const getAgentModelGateway = _getAgentModelGateway;

// ---- Supabase helpers ----

async function supabaseFetch(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status}: ${text}`);
  }
  return res.json();
}

async function getPendingJobs() {
  return supabaseFetch('elevate_agent_runs?status=eq.pending&order=created_at.asc&limit=1');
}

async function updateJob(id, data) {
  return supabaseFetch(`elevate_agent_runs?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

async function getProject(projectId) {
  const projects = await supabaseFetch(`elevate_projects?id=eq.${projectId}&select=*,customer_dna:elevate_customer_dnas(*),app_dna:elevate_app_dnas(*),brand_dna:elevate_brand_dnas(*)`);
  return projects[0];
}

// ---- AI Processing ----

function buildContext(project) {
  return {
    app_name: project.app_dna?.name,
    tagline: project.app_dna?.tagline,
    problem: project.customer_dna?.main_problem || project.app_dna?.problem_solved,
    target_market: project.customer_dna?.target_market,
    before_emotional_state: project.customer_dna?.before_emotional_state,
    after_emotional_state: project.customer_dna?.after_emotional_state,
    unique_mechanism: project.app_dna?.unique_mechanism,
    credentials: project.brand_dna?.credentials,
    your_story: project.brand_dna?.your_story,
  };
}

// Inline prompt lookup (matching lib/agent-prompts.ts)
const PROMPT_GENERATORS = {
  landing_page_generator: (ctx) => `You are a landing page copywriter. Generate copy for a landing page with these sections:

App: ${ctx.app_name || 'Not specified'}
Tagline: ${ctx.tagline || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target Customer: ${ctx.target_market || 'Not specified'}
Before State: ${ctx.before_emotional_state || 'Not specified'}
After State: ${ctx.after_emotional_state || 'Not specified'}
Unique Mechanism: ${ctx.unique_mechanism || 'Not specified'}
Credentials: ${ctx.credentials || 'Not specified'}

Generate compelling copy for each section:
1. Hero (headline, subheadline, CTA button text)
2. Problem Agitation (section_headline, body as array of paragraphs)
3. Solution Introduction (section_headline, body as array of paragraphs)
4. Features (section_headline, features_list as array of {headline, description})
5. Social Proof (section_headline, testimonials as array of {name, quote, result})
6. Pricing (plans as array of {name, price, features array, highlighted boolean})
7. FAQ (questions as array of {question, answer})
8. Final CTA (headline, subheadline, cta_button_text)

Output as JSON with keys: hero, problem_agitation, solution_introduction, features, social_proof, pricing, faq, final_cta.`,
  // For non-landing-page agents, we'll use the stored input_data prompt
};

function getPrompt(agentType, context) {
  return getAgentPrompt(agentType, context);
}

async function callAI(prompt, model) {
  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gateway ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  const tokens = (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0);
  return { content, tokens };
}

// ---- Store Results ----

async function storeResults(agentType, projectId, project, outputData, jobId) {
  try {
    if (agentType === 'landing_page_generator') {
      await supabaseFetch('elevate_landing_pages', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          name: 'Generated Landing Page',
          blocks: outputData,
        }),
      });
    } else if (agentType === 'fill_app_dna' && project.app_dna?.id) {
      await supabaseFetch(`elevate_app_dnas?id=eq.${project.app_dna.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          tagline: outputData.tagline,
          problem_solved: outputData.problem_solved,
          unique_mechanism: outputData.unique_mechanism,
          unique_mechanism_description: outputData.unique_mechanism_description,
          features: outputData.features,
          tech_stack: outputData.tech_stack,
        }),
      });
    } else if (agentType === 'fill_brand_dna' && project.brand_dna?.id) {
      await supabaseFetch(`elevate_brand_dnas?id=eq.${project.brand_dna.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          your_story: outputData.your_story,
          credentials: outputData.credentials,
          voice_tone: outputData.voice_tone,
          banned_words: outputData.banned_words,
        }),
      });
    } else if (agentType === 'fill_customer_dna' && project.customer_dna?.id) {
      await supabaseFetch(`elevate_customer_dnas?id=eq.${project.customer_dna.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          target_market: outputData.target_market,
          demographics: outputData.demographics,
          main_problem: outputData.main_problem,
          before_emotional_state: outputData.before_emotional_state,
          before_core_fear: outputData.before_core_fear,
          before_daily_experience: outputData.before_daily_experience,
          before_self_identity: outputData.before_self_identity,
          after_emotional_state: outputData.after_emotional_state,
          after_core_fear: outputData.after_core_fear,
          after_daily_experience: outputData.after_daily_experience,
          after_self_identity: outputData.after_self_identity,
        }),
      });
    } else if (agentType === 'transformation_mapper' && project.customer_dna?.id) {
      const before = outputData.before || {};
      const after = outputData.after || {};
      await supabaseFetch(`elevate_customer_dnas?id=eq.${project.customer_dna.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          before_emotional_state: before.emotional_state,
          before_core_fear: before.core_fear,
          before_daily_experience: before.daily_experience,
          before_self_identity: before.self_identity,
          after_emotional_state: after.emotional_state,
          after_core_fear: after.core_fear,
          after_daily_experience: after.daily_experience,
          after_self_identity: after.self_identity,
        }),
      });
    } else if (agentType === 'launch_sequence_generator' && Array.isArray(outputData)) {
      for (const day of outputData) {
        await supabaseFetch('elevate_launch_sequences', {
          method: 'POST',
          body: JSON.stringify({
            project_id: projectId,
            day: day.day || 1,
            theme: day.theme || 'Launch',
            stories: day.stories || [],
            email_version: day.email,
            hook_variations: day.hooks || [],
            cta_variations: day.ctas || [],
            visual_suggestions: day.visuals || [],
          }),
        });
      }
    } else if (agentType === 'offer_builder') {
      await supabaseFetch('elevate_offers', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          name: outputData.recommended_name || 'Generated Offer',
          pricing_type: 'one-time',
          price_amount: outputData.price || null,
          bonuses: outputData.bonuses || [],
          guarantee: outputData.guarantee || null,
          charter_content: outputData.charter || JSON.stringify(outputData),
        }),
      });
    } else {
      // Generic copy asset
      const typeMapping = {
        vsl_writer: 'vsl',
        email_generator: 'email_welcome',
        headline_generator: 'headlines',
        objection_handler: 'objections',
        ad_copy_generator: 'ad_facebook',
        case_study_generator: 'case_study',
        app_idea_validator: 'case_study',
        niche_analyzer: 'case_study',
        competitor_xray: 'case_study',
      };
      const copyType = typeMapping[agentType] || 'vsl';
      await supabaseFetch('elevate_copy_assets', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          type: copyType,
          name: `Generated ${agentType}`,
          content: typeof outputData === 'string' ? outputData : JSON.stringify(outputData, null, 2),
          metadata: { agent_run_id: jobId },
        }),
      });
    }
  } catch (err) {
    console.error(`[Worker] Error storing results for ${agentType}:`, err.message);
  }
}

// ---- Main Loop ----

async function processJob(job) {
  console.log(`[Worker] Processing job ${job.id} (${job.agent_type})`);
  
  try {
    // Mark as running
    await updateJob(job.id, { status: 'running' });

    // Get project data
    const project = await getProject(job.project_id);
    if (!project) throw new Error('Project not found');

    // Build context and prompt
    const context = buildContext(project);
    const prompt = getPrompt(job.agent_type, context);
    if (!prompt) throw new Error(`Unknown agent type: ${job.agent_type}`);

    // Call AI via local gateway (no Cloudflare, no timeout)
    console.log(`[Worker] Calling AI for ${job.agent_type}...`);
    const startTime = Date.now();
    const { content, tokens } = await callAI(prompt);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Worker] AI responded in ${elapsed}s (${tokens} tokens)`);

    // Parse response
    let responseText = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    let outputData;
    try {
      outputData = JSON.parse(responseText);
    } catch {
      outputData = { text: responseText };
    }

    // Update job as completed
    await updateJob(job.id, {
      output_data: outputData,
      status: 'completed',
      tokens_used: tokens,
      completed_at: new Date().toISOString(),
    });

    // Store results in appropriate tables
    await storeResults(job.agent_type, job.project_id, project, outputData, job.id);
    console.log(`[Worker] ✅ Job ${job.id} completed`);

  } catch (err) {
    console.error(`[Worker] ❌ Job ${job.id} failed:`, err.message);
    await updateJob(job.id, {
      status: 'failed',
      output_data: { error: err.message },
      completed_at: new Date().toISOString(),
    });
  }
}

async function pollLoop() {
  console.log('[Worker] Elevate AI Agent Worker started');
  console.log(`[Worker] Polling Supabase every ${POLL_INTERVAL_MS / 1000}s for pending jobs`);
  console.log(`[Worker] Gateway: ${GATEWAY_URL}`);
  
  while (true) {
    try {
      const jobs = await getPendingJobs();
      if (jobs.length > 0) {
        await processJob(jobs[0]);
      }
    } catch (err) {
      console.error('[Worker] Poll error:', err.message);
    }
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
  }
}

// Also claim any "running" jobs that might be stuck from crashed workers
async function claimStuckJobs() {
  try {
    const stuck = await supabaseFetch(
      'elevate_agent_runs?status=eq.running&created_at=lt.' + 
      new Date(Date.now() - 5 * 60 * 1000).toISOString() + 
      '&limit=5'
    );
    for (const job of stuck) {
      console.log(`[Worker] Reclaiming stuck job ${job.id}`);
      await updateJob(job.id, { status: 'pending' });
    }
  } catch (err) {
    console.error('[Worker] Stuck job check error:', err.message);
  }
}

// Start
claimStuckJobs().then(pollLoop);
