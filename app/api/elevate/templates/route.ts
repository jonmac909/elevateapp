import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fallback templates in case Supabase is not available
const FALLBACK_TEMPLATES = [
  {
    id: '1',
    name: 'RAG Knowledge Base Bot',
    description: 'AI chatbot trained on your content that answers customer questions 24/7',
    category: 'AI',
    icon: '🤖',
    features: ['Document upload', 'Chat interface', 'Source citations', 'Analytics dashboard'],
    tech_stack: ['Next.js', 'Supabase', 'OpenAI', 'Langchain'],
    difficulty: 'intermediate',
    estimated_hours: 8,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Voice AI Receptionist',
    description: 'Phone agent that handles calls, books appointments, and qualifies leads',
    category: 'AI',
    icon: '📞',
    features: ['Inbound/outbound calls', 'Calendar integration', 'Lead qualification', 'Call transcripts'],
    tech_stack: ['Next.js', 'Twilio', 'OpenAI', 'Cal.com'],
    difficulty: 'advanced',
    estimated_hours: 12,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Course Creator Support Bot',
    description: 'Support bot for online courses that reduces support tickets by 80%',
    category: 'AI',
    icon: '🎓',
    features: ['FAQ automation', 'Course content search', 'Ticket escalation', 'Student analytics'],
    tech_stack: ['Next.js', 'Supabase', 'OpenAI', 'Intercom'],
    difficulty: 'intermediate',
    estimated_hours: 6,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Lead Capture + CRM',
    description: 'Landing page with smart forms that capture and nurture leads automatically',
    category: 'Marketing',
    icon: '📧',
    features: ['Multi-step forms', 'Email sequences', 'Lead scoring', 'Pipeline view'],
    tech_stack: ['Next.js', 'Supabase', 'Resend', 'Stripe'],
    difficulty: 'beginner',
    estimated_hours: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Booking & Scheduling App',
    description: 'Calendly alternative with custom branding and payment integration',
    category: 'Productivity',
    icon: '📅',
    features: ['Calendar sync', 'Payment collection', 'Reminder emails', 'Timezone handling'],
    tech_stack: ['Next.js', 'Supabase', 'Stripe', 'Google Calendar'],
    difficulty: 'beginner',
    estimated_hours: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Dashboard & Analytics App',
    description: 'Custom metrics dashboard that pulls from multiple data sources',
    category: 'Analytics',
    icon: '📊',
    features: ['Multi-source data', 'Custom charts', 'Export reports', 'Scheduled emails'],
    tech_stack: ['Next.js', 'Supabase', 'Chart.js', 'API integrations'],
    difficulty: 'intermediate',
    estimated_hours: 6,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Content Repurposer',
    description: 'Turn one piece of content into 10 formats with AI',
    category: 'AI',
    icon: '✨',
    features: ['Video to blog', 'Blog to social', 'Transcript extraction', 'Brand voice'],
    tech_stack: ['Next.js', 'OpenAI', 'Cloudflare', 'Twitter API'],
    difficulty: 'intermediate',
    estimated_hours: 7,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Client Portal',
    description: 'White-label client dashboard for agencies and freelancers',
    category: 'Business',
    icon: '🏢',
    features: ['Multi-tenant', 'File sharing', 'Progress tracking', 'Invoicing'],
    tech_stack: ['Next.js', 'Supabase', 'Stripe', 'AWS S3'],
    difficulty: 'intermediate',
    estimated_hours: 8,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Membership Site',
    description: 'Gated content platform with subscriptions and community',
    category: 'Monetization',
    icon: '🔐',
    features: ['Subscription billing', 'Drip content', 'Community forums', 'Member directory'],
    tech_stack: ['Next.js', 'Supabase', 'Stripe', 'Discord'],
    difficulty: 'intermediate',
    estimated_hours: 10,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Micro-SaaS Tool',
    description: 'Single-purpose SaaS app solving one specific problem',
    category: 'SaaS',
    icon: '⚡',
    features: ['User auth', 'Subscription billing', 'Usage limits', 'Admin dashboard'],
    tech_stack: ['Next.js', 'Supabase', 'Stripe', 'Vercel'],
    difficulty: 'beginner',
    estimated_hours: 6,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const { data: templates, error } = await supabase
      .from('elevate_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching templates:', error);
      // Return fallback templates if Supabase fails
      return NextResponse.json({ templates: FALLBACK_TEMPLATES });
    }

    // If no templates in DB, return fallback
    if (!templates || templates.length === 0) {
      return NextResponse.json({ templates: FALLBACK_TEMPLATES });
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ templates: FALLBACK_TEMPLATES });
  }
}
