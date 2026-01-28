import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { supabase } from '@/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';
import { getAgentPrompt, getAgentModel } from '@/lib/agent-prompts';

/**
 * Async agent execution via Supabase job queue.
 * 
 * Flow:
 * 1. Creates a job row in elevate_agent_runs with status 'pending'
 * 2. Returns the job_id immediately to the frontend
 * 3. Uses next/server `after()` (maps to Cloudflare waitUntil) to process in background
 * 4. Frontend polls /api/elevate/agents/status/[id] for results
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, agent_type, api_key } = body;

    if (!project_id || !agent_type) {
      return NextResponse.json({ error: 'Missing project_id or agent_type' }, { status: 400 });
    }

    const anthropicApiKey = api_key || process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return NextResponse.json({ error: 'Claude API key not configured. Add it in Settings.' }, { status: 400 });
    }

    // Fetch project with all DNAs
    const { data: project, error: projectError } = await supabase
      .from('elevate_projects')
      .select(`
        *,
        customer_dna:elevate_customer_dnas(*),
        app_dna:elevate_app_dnas(*),
        brand_dna:elevate_brand_dnas(*)
      `)
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Build context
    const context: Record<string, unknown> = {
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

    // Validate agent type
    const prompt = getAgentPrompt(agent_type, context);
    if (!prompt) {
      return NextResponse.json({ error: 'Unknown agent type' }, { status: 400 });
    }

    // Create job row
    const { data: job, error: jobError } = await supabase
      .from('elevate_agent_runs')
      .insert({
        project_id,
        agent_type,
        input_data: context,
        status: 'pending',
      })
      .select()
      .single();

    if (jobError || !job) {
      console.error('Error creating job:', jobError);
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }

    // Process in background using after() — maps to Cloudflare waitUntil
    after(async () => {
      try {
        // Mark as running
        await supabase
          .from('elevate_agent_runs')
          .update({ status: 'running' })
          .eq('id', job.id);

        const anthropic = new Anthropic({ apiKey: anthropicApiKey });
        const model = getAgentModel(agent_type);

        const message = await anthropic.messages.create({
          model,
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        });

        let responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        responseText = responseText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

        let outputData: Record<string, unknown>;
        try {
          outputData = JSON.parse(responseText);
        } catch {
          outputData = { text: responseText };
        }

        // Update job with results
        await supabase
          .from('elevate_agent_runs')
          .update({
            output_data: outputData,
            status: 'completed',
            tokens_used: (message.usage?.input_tokens || 0) + (message.usage?.output_tokens || 0),
            completed_at: new Date().toISOString(),
          })
          .eq('id', job.id);

        // Store results based on agent type
        await storeAgentResults(agent_type, project_id, project, outputData, job.id);

      } catch (error) {
        console.error('Background agent processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await supabase
          .from('elevate_agent_runs')
          .update({
            status: 'failed',
            output_data: { error: errorMessage },
            completed_at: new Date().toISOString(),
          })
          .eq('id', job.id);
      }
    });

    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      job_id: job.id,
      status: 'pending',
    });

  } catch (error) {
    console.error('Error starting agent:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to start agent';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/** Store agent results in the appropriate tables */
async function storeAgentResults(
  agentType: string,
  projectId: string,
  project: Record<string, unknown>,
  outputData: Record<string, unknown>,
  jobId: string
) {
  if (agentType === 'landing_page_generator') {
    await supabase.from('elevate_landing_pages').insert({
      project_id: projectId,
      name: 'Generated Landing Page',
      blocks: outputData,
    });
  } else if (agentType === 'launch_sequence_generator') {
    if (Array.isArray(outputData)) {
      for (const day of outputData) {
        await supabase.from('elevate_launch_sequences').insert({
          project_id: projectId,
          day: day.day || 1,
          theme: day.theme || 'Launch',
          stories: day.stories || [],
          email_version: day.email,
          hook_variations: day.hooks || [],
          cta_variations: day.ctas || [],
          visual_suggestions: day.visuals || [],
        });
      }
    }
  } else if (agentType === 'offer_builder') {
    await supabase.from('elevate_offers').insert({
      project_id: projectId,
      name: (outputData as Record<string, string>).recommended_name || 'Generated Offer',
      pricing_type: 'one-time',
      price_amount: (outputData as Record<string, number>).price || null,
      bonuses: outputData.bonuses || [],
      guarantee: outputData.guarantee || null,
      charter_content: outputData.charter || JSON.stringify(outputData),
    });
  } else if (agentType === 'transformation_mapper') {
    const customerDna = project.customer_dna as Record<string, string> | undefined;
    if (customerDna?.id) {
      const transformData = outputData as { before?: Record<string, string>; after?: Record<string, string> };
      const beforeData = transformData.before || {};
      const afterData = transformData.after || {};
      await supabase
        .from('elevate_customer_dnas')
        .update({
          before_emotional_state: beforeData.emotional_state,
          before_core_fear: beforeData.core_fear,
          before_daily_experience: beforeData.daily_experience,
          before_self_identity: beforeData.self_identity,
          after_emotional_state: afterData.emotional_state,
          after_core_fear: afterData.core_fear,
          after_daily_experience: afterData.daily_experience,
          after_self_identity: afterData.self_identity,
        })
        .eq('id', customerDna.id);
    }
  } else if (agentType === 'fill_app_dna') {
    const appDna = project.app_dna as Record<string, string> | undefined;
    if (appDna?.id) {
      await supabase
        .from('elevate_app_dnas')
        .update({
          tagline: outputData.tagline,
          problem_solved: outputData.problem_solved,
          unique_mechanism: outputData.unique_mechanism,
          unique_mechanism_description: outputData.unique_mechanism_description,
          features: outputData.features,
          tech_stack: outputData.tech_stack,
        })
        .eq('id', appDna.id);
    }
  } else if (agentType === 'fill_brand_dna') {
    const brandDna = project.brand_dna as Record<string, string> | undefined;
    if (brandDna?.id) {
      await supabase
        .from('elevate_brand_dnas')
        .update({
          your_story: outputData.your_story,
          credentials: outputData.credentials,
          voice_tone: outputData.voice_tone,
          banned_words: outputData.banned_words,
        })
        .eq('id', brandDna.id);
    }
  } else if (agentType === 'fill_customer_dna') {
    const customerDna = project.customer_dna as Record<string, string> | undefined;
    if (customerDna?.id) {
      await supabase
        .from('elevate_customer_dnas')
        .update({
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
        })
        .eq('id', customerDna.id);
    }
  } else {
    const typeMapping: Record<string, string> = {
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
    const contentToSave = typeof outputData === 'string' ? outputData : JSON.stringify(outputData, null, 2);
    await supabase.from('elevate_copy_assets').insert({
      project_id: projectId,
      type: copyType,
      name: `Generated ${agentType}`,
      content: contentToSave,
      metadata: { agent_run_id: jobId },
    });
  }
}
