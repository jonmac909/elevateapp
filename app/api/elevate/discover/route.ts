import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Categories for app ideas
const CATEGORIES = [
  { id: 'ai', name: 'AI & Automation', emoji: '🤖' },
  { id: 'health', name: 'Health & Fitness', emoji: '💪' },
  { id: 'finance', name: 'Finance & Money', emoji: '💰' },
  { id: 'education', name: 'Education & Learning', emoji: '📚' },
  { id: 'productivity', name: 'Productivity', emoji: '⚡' },
  { id: 'social', name: 'Social & Community', emoji: '👥' },
  { id: 'business', name: 'Business Tools', emoji: '📊' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '🎨' },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: CATEGORIES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, freeform, api_key } = body;

    if (!api_key) {
      return NextResponse.json(
        { success: false, error: 'API key required' },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({ apiKey: api_key });

    // Determine the niche from freeform or category
    let nicheDescription: string;
    if (freeform && freeform.trim()) {
      nicheDescription = freeform.trim();
    } else {
      const categoryInfo = CATEGORIES.find(c => c.id === category);
      nicheDescription = categoryInfo?.name || category || 'general';
    }

    const prompt = `You are an expert product strategist and market analyst. Generate 8 high-potential app ideas based on this input:

**NICHE/IDEA:** ${nicheDescription}

For EACH app idea, provide:
1. **App Name** - Catchy, memorable name
2. **One-line Description** - Clear value proposition
3. **Target Market** - Specific customer segment (e.g., "First-time freelancers with 0-5 clients")
4. **Main Problem Solved** - The core pain point in visceral detail
5. **Revenue Model** - How it makes money (subscription, one-time, freemium, etc.)
6. **Difficulty** - beginner | intermediate | advanced
7. **Build Time** - Estimated time to MVP (e.g., "2 weeks", "1 month")
8. **Unique Mechanism** - The proprietary method/approach that makes it different
9. **Emoji** - A single emoji that represents the app
10. **Viability Score** - Analyze market viability with scores 0-100 for each dimension:
    - market_size: Size of addressable market
    - competition: INVERTED score (100 = low competition = good, 0 = saturated = bad)
    - demand: Evidence of active demand
    - monetization: Ease of monetization
    - trend: Growth trajectory
    - overall: Weighted average (market 25%, competition 20%, demand 25%, monetization 15%, trend 15%)
    - verdict: "go" (71-100), "caution" (41-70), or "no-go" (0-40)

**IMPORTANT CRITERIA:**
- Focus on HIGH-DEMAND, LOW-COMPETITION niches
- Each idea should solve a SPECIFIC pain point (not generic)
- Target a clearly defined customer segment
- Prioritize ideas that can be built with Next.js + Supabase + AI
- Mix of difficulty levels (2-3 beginner, 3-4 intermediate, 1-2 advanced)
- Favor recurring revenue models
- Each idea should be meaningfully different from the others
- Be REALISTIC with viability scores - don't inflate them

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "ideas": [
    {
      "name": "string",
      "description": "string",
      "target_market": "string",
      "problem_solved": "string",
      "revenue_model": "string",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "build_time": "string",
      "unique_mechanism": "string",
      "emoji": "string",
      "viability_score": {
        "overall": number,
        "market_size": number,
        "competition": number,
        "demand": number,
        "monetization": number,
        "trend": number,
        "verdict": "go" | "caution" | "no-go"
      }
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response - handle potential markdown wrapping
    let responseText = content.text.trim();
    
    // Remove markdown code blocks if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.slice(7);
    } else if (responseText.startsWith('```')) {
      responseText = responseText.slice(3);
    }
    if (responseText.endsWith('```')) {
      responseText = responseText.slice(0, -3);
    }
    responseText = responseText.trim();

    const result = JSON.parse(responseText);

    // Sort ideas by viability score (highest first)
    const sortedIdeas = result.ideas.sort((a: { viability_score?: { overall: number } }, b: { viability_score?: { overall: number } }) => 
      (b.viability_score?.overall || 0) - (a.viability_score?.overall || 0)
    );

    return NextResponse.json({
      success: true,
      ideas: sortedIdeas,
      niche: nicheDescription,
    });

  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
