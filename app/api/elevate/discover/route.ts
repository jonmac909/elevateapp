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
    const { category, api_key } = body;

    if (!api_key) {
      return NextResponse.json(
        { success: false, error: 'API key required' },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({ apiKey: api_key });

    const categoryInfo = CATEGORIES.find(c => c.id === category);
    const categoryName = categoryInfo?.name || category;

    const prompt = `You are an expert product strategist and app idea generator. Generate 8 high-potential app ideas in the **${categoryName}** niche.

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

**IMPORTANT CRITERIA:**
- Focus on HIGH-DEMAND, LOW-COMPETITION niches
- Each idea should solve a SPECIFIC pain point (not generic)
- Target a clearly defined customer segment
- Prioritize ideas that can be built with Next.js + Supabase + AI
- Mix of difficulty levels (2-3 beginner, 3-4 intermediate, 1-2 advanced)
- Favor recurring revenue models
- Each idea should be meaningfully different from the others

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
      "emoji": "string"
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    const result = JSON.parse(content.text);

    return NextResponse.json({
      success: true,
      ideas: result.ideas,
      category: categoryName,
    });

  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
