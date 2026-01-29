"use strict";
/**
 * Shared agent prompt definitions and model routing.
 * Used by both the sync /api/elevate/agents/run and async /api/elevate/agents/start routes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentPrompt = getAgentPrompt;
exports.getAgentModel = getAgentModel;
exports.getAgentModelGateway = getAgentModelGateway;
exports.isValidAgentType = isValidAgentType;
const AGENT_PROMPTS = {
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
/** Model routing — landing pages use Opus for quality, everything else uses Opus too */
const MODEL_OVERRIDES = {
// All agents use Opus 4.5 by default
// Landing page was previously switched to Sonnet for speed, 
// but with async processing there's no timeout constraint
};
// When used via Clawdbot gateway proxy, use the alias format
// When used directly via Anthropic SDK, use the full model ID
const DEFAULT_MODEL = 'claude-opus-4-5-20251101';
const DEFAULT_MODEL_GATEWAY = 'claude-opus-4-5';
function getAgentPrompt(agentType, context) {
    const generator = AGENT_PROMPTS[agentType];
    if (!generator)
        return null;
    return generator(context);
}
function getAgentModel(agentType) {
    return MODEL_OVERRIDES[agentType] || DEFAULT_MODEL;
}
/** Get model name for Clawdbot gateway (alias format) */
function getAgentModelGateway(agentType) {
    return MODEL_OVERRIDES[agentType] || DEFAULT_MODEL_GATEWAY;
}
function isValidAgentType(agentType) {
    return agentType in AGENT_PROMPTS;
}
