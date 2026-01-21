import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

// Agent prompts for different tasks
const AGENT_PROMPTS: Record<string, (context: Record<string, unknown>) => string> = {
  app_idea_validator: (ctx) => `You are an app idea validator. Analyze this app idea and provide:
1. Market Size (estimate)
2. Competition Level (1-10)
3. Demand Score (1-10)
4. Key Risks
5. Opportunities
6. Recommendation (Build/Pivot/Pass)

App Idea:
- Name: ${ctx.app_name || 'Not specified'}
- Problem: ${ctx.problem || 'Not specified'}
- Target Market: ${ctx.target_market || 'Not specified'}

Provide your analysis in a structured format.`,

  niche_analyzer: (ctx) => `You are a niche market analyst. Analyze this niche and provide:
1. Top 5 Pain Points (with frequency estimates)
2. Existing Solutions (and their weaknesses)
3. Market Gaps (opportunities)
4. Recommended Positioning
5. Price Sensitivity Analysis

Niche: ${ctx.target_market || 'Not specified'}
Problem Area: ${ctx.problem || 'Not specified'}

Provide actionable insights.`,

  competitor_xray: (ctx) => `You are a competitive intelligence analyst. Based on the provided context, analyze competitors in this space:

Target Market: ${ctx.target_market || 'Not specified'}
Problem Being Solved: ${ctx.problem || 'Not specified'}

Provide:
1. Top 3-5 Competitors (real or likely)
2. Their Features
3. Their Pricing
4. Their Weaknesses
5. Differentiation Opportunities`,

  landing_page_generator: (ctx) => `You are a landing page copywriter. Generate copy for a landing page with these 13 sections:

App: ${ctx.app_name || 'Not specified'}
Tagline: ${ctx.tagline || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target Customer: ${ctx.target_market || 'Not specified'}
Before State: ${ctx.before_emotional_state || 'Not specified'}
After State: ${ctx.after_emotional_state || 'Not specified'}
Unique Mechanism: ${ctx.unique_mechanism || 'Not specified'}
Credentials: ${ctx.credentials || 'Not specified'}

Generate copy for each section:
1. Hero (headline, subheadline, CTA button text)
2. Problem Agitation
3. Solution Introduction
4. Features (3-5 with headlines and descriptions)
5. How It Works (3 steps)
6. Transformation (before/after)
7. Social Proof (placeholder for testimonials)
8. Pricing
9. FAQ (5 questions)
10. Guarantee
11. About/Story
12. Final CTA
13. Footer

Output as JSON with each section as a key.`,

  launch_sequence_generator: (ctx) => `You are a launch sequence copywriter. Generate a 7-day Instagram story launch sequence:

App: ${ctx.app_name || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target Customer: ${ctx.target_market || 'Not specified'}
Before State: ${ctx.before_emotional_state || 'Not specified'}
After State: ${ctx.after_emotional_state || 'Not specified'}

For each day, generate:
- Day theme
- 7-10 story slides (text for each)
- Email version (short paragraph)
- 3 hook variations
- 3 CTA variations
- Visual suggestions

Day themes:
Day 1: Survey - Ask about struggles
Day 2: Validation - Share responses, give tip
Day 3: Behind the Scenes - Show the app
Day 4: Transformation - Before/after story
Day 5: Objection Handling - Address concerns
Day 6: Launch Day - Open cart
Day 7: Last Chance - Urgency, close

Output as JSON array with one object per day.`,

  offer_builder: (ctx) => `You are an offer strategist. Create an irresistible offer:

App: ${ctx.app_name || 'Not specified'}
Problem Solved: ${ctx.problem || 'Not specified'}
Target Market: ${ctx.target_market || 'Not specified'}
Transformation: From "${ctx.before_emotional_state || 'struggling'}" to "${ctx.after_emotional_state || 'thriving'}"

Generate:
1. 5 Offer Name Options (creative, benefit-driven)
2. Recommended Pricing (with justification)
3. 5 Bonus Ideas (with perceived values)
4. Guarantee Options (3 different angles)
5. Offer Charter (complete document)

Output as JSON.`,

  vsl_writer: (ctx) => `You are a VSL (Video Sales Letter) copywriter. Write a complete VSL script:

App: ${ctx.app_name || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target: ${ctx.target_market || 'Not specified'}
Before: ${ctx.before_emotional_state || 'Not specified'}
After: ${ctx.after_emotional_state || 'Not specified'}
Unique Mechanism: ${ctx.unique_mechanism || 'Not specified'}
Credentials: ${ctx.credentials || 'Not specified'}

Structure:
1. Hook (pattern interrupt, 30 seconds)
2. Problem (agitate pain, 2 minutes)
3. Solution Introduction (your approach, 2 minutes)
4. Unique Mechanism (why this works, 3 minutes)
5. Proof/Credentials (why trust you, 2 minutes)
6. The Offer (what they get, 3 minutes)
7. Bonuses (stack value, 2 minutes)
8. Price Reveal (anchor and reveal, 2 minutes)
9. Guarantee (risk reversal, 1 minute)
10. CTA (urgency and action, 1 minute)

Write conversational, spoken-word copy.`,

  email_generator: (ctx) => `You are an email copywriter. Generate two email sequences:

App: ${ctx.app_name || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target: ${ctx.target_market || 'Not specified'}

SEQUENCE 1: Welcome Sequence (5 emails)
- Email 1: Welcome + quick win
- Email 2: Your story
- Email 3: Common mistake
- Email 4: Case study/proof
- Email 5: Soft pitch

SEQUENCE 2: Launch Sequence (7 emails)
- Email 1: Launch announcement
- Email 2: Problem deep dive
- Email 3: Solution reveal
- Email 4: Testimonial/proof
- Email 5: FAQ/objections
- Email 6: 24-hour warning
- Email 7: Last call

For each email: Subject line + body copy.`,

  headline_generator: (ctx) => `Generate 20 headline variations for this app:

App: ${ctx.app_name || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target: ${ctx.target_market || 'Not specified'}
Transformation: From "${ctx.before_emotional_state || 'struggling'}" to "${ctx.after_emotional_state || 'thriving'}"

Generate headlines in these categories:
- 5 Curiosity headlines
- 5 Benefit headlines
- 5 Fear/pain headlines
- 5 Social proof headlines

Output as JSON array with headline and category for each.`,

  objection_handler: (ctx) => `Generate objection handlers for this app:

App: ${ctx.app_name || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target: ${ctx.target_market || 'Not specified'}

Generate responses to these 10 common objections:
1. "It's too expensive"
2. "I don't have time"
3. "I'm not technical"
4. "Will this work for me?"
5. "I've tried other solutions"
6. "I need to think about it"
7. "I need to ask my spouse/partner"
8. "Can I get a refund?"
9. "How is this different?"
10. "What if I fail?"

For each: The objection + empathetic response + reframe.`,

  ad_copy_generator: (ctx) => `You are an expert ad copywriter. Generate high-converting ad copy for Facebook and Instagram:

App: ${ctx.app_name || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target: ${ctx.target_market || 'Not specified'}
Before State: ${ctx.before_emotional_state || 'Not specified'}
After State: ${ctx.after_emotional_state || 'Not specified'}
Unique Mechanism: ${ctx.unique_mechanism || 'Not specified'}

Generate:

FACEBOOK ADS (3 variations):
For each:
- Primary text (125 chars for mobile)
- Headline (25 chars)
- Description (30 chars)
- Long-form primary text (500 chars)

INSTAGRAM ADS (3 variations):
For each:
- Caption (2200 chars max, optimized for engagement)
- First line hook (must stop scroll)
- CTA text
- Hashtags (10-15 relevant ones)

STORY ADS (3 variations):
For each:
- Hook text (short, punchy)
- Body text
- CTA button text

Output as JSON with facebook_ads, instagram_ads, and story_ads arrays.`,

  case_study_generator: (ctx) => `You are a case study writer. Generate compelling case studies/success stories:

App: ${ctx.app_name || 'Not specified'}
Problem: ${ctx.problem || 'Not specified'}
Target: ${ctx.target_market || 'Not specified'}
Before State: ${ctx.before_emotional_state || 'Not specified'}
After State: ${ctx.after_emotional_state || 'Not specified'}

Generate 3 fictional but realistic case studies using this structure for each:

1. HEADLINE - Attention-grabbing result
2. THE SITUATION (Before)
   - Who they are (demographics)
   - What they were struggling with
   - What they had tried before
   - How they felt (use visceral language)
3. THE TURNING POINT
   - How they found the solution
   - Initial skepticism
   - What made them try it
4. THE TRANSFORMATION (After)
   - Specific results (use numbers where possible)
   - How their daily life changed
   - How they feel now
   - Quote from them (realistic voice)
5. THE TAKEAWAY
   - Key lesson
   - Why this approach worked

Output as JSON array with 3 case study objects.`,

  transformation_mapper: (ctx) => `You are a transformation mapping expert. Based on the problem and target market, generate a detailed visceral transformation map:

Problem: ${ctx.problem || 'Not specified'}
Target: ${ctx.target_market || 'Not specified'}

Create a complete transformation map with BEFORE and AFTER states across 4 dimensions:

1. EMOTIONAL STATE
   - Before: How they feel daily (use visceral, sensory language)
   - After: How they'll feel after transformation

2. CORE FEAR
   - Before: Their deepest fear about this problem
   - After: The new belief that replaces the fear

3. DAILY EXPERIENCE  
   - Before: What their typical day looks like dealing with this
   - After: What their new normal looks like

4. SELF-IDENTITY
   - Before: How they see themselves (often negative)
   - After: Their new identity/self-image

For each dimension, provide:
- Vivid, emotional language
- Specific details (not generic)
- Language they would actually use

Output as JSON with before and after objects, each containing emotional_state, core_fear, daily_experience, and self_identity fields.`,

  fill_app_dna: (ctx) => `You are an app strategist. Based on this app name, generate a complete App DNA profile.

App Name: ${ctx.app_name || 'Not specified'}

Generate a complete app profile with:
1. tagline - A catchy one-liner (max 10 words)
2. problem_solved - The core problem this app solves (2-3 sentences)
3. unique_mechanism - What makes this approach unique (1-2 sentences)
4. unique_mechanism_description - Detailed explanation of the mechanism (2-3 sentences)
5. features - Array of 3-5 key features, each with "name" and "description"
6. tech_stack - Array of recommended technologies (e.g., ["Next.js", "Supabase", "Tailwind CSS"])

Output as JSON with these exact field names.`,

  fill_brand_dna: (ctx) => `You are a brand strategist. Based on this app, generate a complete Brand DNA profile.

App Name: ${ctx.app_name || 'Not specified'}
App Description: ${ctx.problem || ctx.tagline || 'Not specified'}

Generate a brand profile with:
1. your_story - A compelling founder story for someone building this app (2-3 paragraphs, first person)
2. credentials - Relevant experience/credentials that would make someone credible (bullet points as a string)
3. voice_tone - One of: "casual", "professional", "authoritative", "friendly", "inspirational"
4. banned_words - Array of 5-10 words/phrases to avoid (cliches, overused terms)

Output as JSON with these exact field names.`,

  fill_customer_dna: (ctx) => `You are a customer research expert. Based on this app, generate a complete Customer DNA profile.

App Name: ${ctx.app_name || 'Not specified'}
App Description: ${ctx.problem || ctx.tagline || 'Not specified'}

Generate a detailed customer profile with:
1. target_market - Specific description of ideal customer (1-2 sentences)
2. demographics - Age, location, income level, occupation (comma-separated)
3. main_problem - The visceral, emotional problem they face (2-3 sentences, use their language)
4. before_emotional_state - How they feel daily dealing with this problem
5. before_core_fear - Their deepest fear about this problem
6. before_daily_experience - What their typical day looks like
7. before_self_identity - How they see themselves (often negative)
8. after_emotional_state - How they'll feel after using the app
9. after_core_fear - The new belief that replaces their fear  
10. after_daily_experience - What their new normal looks like
11. after_self_identity - Their new identity/self-image

Output as JSON with these exact field names. Use vivid, emotional language.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, agent_type, api_key } = body;

    if (!project_id || !agent_type) {
      return NextResponse.json({ error: 'Missing project_id or agent_type' }, { status: 400 });
    }

    // Get API key from request or environment
    const anthropicApiKey = api_key || process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return NextResponse.json({ error: 'Claude API key not configured. Add it in Settings.' }, { status: 400 });
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

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

    // Build context from DNAs
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

    // Get the prompt generator
    const promptGenerator = AGENT_PROMPTS[agent_type];
    if (!promptGenerator) {
      return NextResponse.json({ error: 'Unknown agent type' }, { status: 400 });
    }

    // Create agent run record
    const { data: agentRun, error: runError } = await supabase
      .from('elevate_agent_runs')
      .insert({
        project_id,
        agent_type,
        input_data: context,
        status: 'running',
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating agent run:', runError);
    }

    // Call Claude API
    const prompt = promptGenerator(context);
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Try to parse as JSON, otherwise store as text
    let outputData: Record<string, unknown>;
    try {
      outputData = JSON.parse(responseText);
    } catch {
      outputData = { text: responseText };
    }

    // Update agent run with results
    if (agentRun) {
      await supabase
        .from('elevate_agent_runs')
        .update({
          output_data: outputData,
          status: 'completed',
          tokens_used: message.usage?.input_tokens + message.usage?.output_tokens,
          completed_at: new Date().toISOString(),
        })
        .eq('id', agentRun.id);
    }

    // Store result based on agent type
    if (agent_type === 'landing_page_generator') {
      await supabase.from('elevate_landing_pages').insert({
        project_id,
        name: 'Generated Landing Page',
        blocks: outputData,
      });
    } else if (agent_type === 'launch_sequence_generator') {
      // Store each day separately
      if (Array.isArray(outputData)) {
        for (const day of outputData) {
          await supabase.from('elevate_launch_sequences').insert({
            project_id,
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
    } else if (agent_type === 'offer_builder') {
      await supabase.from('elevate_offers').insert({
        project_id,
        name: outputData.recommended_name || 'Generated Offer',
        pricing_type: 'one-time',
        price_amount: outputData.price || null,
        bonuses: outputData.bonuses || [],
        guarantee: outputData.guarantee || null,
        charter_content: outputData.charter || JSON.stringify(outputData),
      });
    } else if (agent_type === 'transformation_mapper') {
      // Update customer DNA with transformation map data
      if (project.customer_dna?.id) {
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
          .eq('id', project.customer_dna.id);
      }
    } else if (agent_type === 'fill_app_dna') {
      // Update app DNA with generated data
      if (project.app_dna?.id) {
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
          .eq('id', project.app_dna.id);
      }
    } else if (agent_type === 'fill_brand_dna') {
      // Update brand DNA with generated data
      if (project.brand_dna?.id) {
        await supabase
          .from('elevate_brand_dnas')
          .update({
            your_story: outputData.your_story,
            credentials: outputData.credentials,
            voice_tone: outputData.voice_tone,
            banned_words: outputData.banned_words,
          })
          .eq('id', project.brand_dna.id);
      }
    } else if (agent_type === 'fill_customer_dna') {
      // Update customer DNA with generated data
      if (project.customer_dna?.id) {
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
          .eq('id', project.customer_dna.id);
      }
    } else {
      // Store as copy asset
      const typeMapping: Record<string, string> = {
        vsl_writer: 'vsl',
        email_generator: 'email_welcome',
        headline_generator: 'headlines',
        objection_handler: 'objections',
        ad_copy_generator: 'ad_facebook',
        case_study_generator: 'case_study',
        app_idea_validator: 'research',
        niche_analyzer: 'research',
        competitor_xray: 'research',
      };
      
      const copyType = typeMapping[agent_type] || 'research';
      await supabase.from('elevate_copy_assets').insert({
        project_id,
        type: copyType,
        name: `Generated ${agent_type}`,
        content: typeof outputData === 'string' ? outputData : JSON.stringify(outputData, null, 2),
        metadata: { agent_run_id: agentRun?.id },
      });
    }

    return NextResponse.json({ 
      success: true, 
      output: outputData,
      agent_run_id: agentRun?.id,
    });
  } catch (error) {
    console.error('Error running agent:', error);
    const errorMessage = error instanceof Error ? error.message : 'Agent execution failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
