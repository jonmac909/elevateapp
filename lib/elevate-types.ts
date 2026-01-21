// ElevateOS App Builder Platform Types

export interface CustomerDNA {
  id: string;
  user_id: string;
  name: string;
  target_market: string | null;
  demographics: string | null;
  main_problem: string | null;
  before_emotional_state: string | null;
  before_core_fear: string | null;
  before_daily_experience: string | null;
  before_self_identity: string | null;
  after_emotional_state: string | null;
  after_core_fear: string | null;
  after_daily_experience: string | null;
  after_self_identity: string | null;
  keywords: string[] | null;
  hangout_places: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface AppDNA {
  id: string;
  user_id: string;
  name: string;
  tagline: string | null;
  problem_solved: string | null;
  unique_mechanism: string | null;
  unique_mechanism_description: string | null;
  features: AppFeature[] | null;
  tech_stack: string[] | null;
  template_used: string | null;
  deploy_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppFeature {
  name: string;
  description: string;
}

export interface BrandDNA {
  id: string;
  user_id: string;
  name: string;
  your_story: string | null;
  credentials: string | null;
  voice_tone: string | null;
  voice_style: string | null;
  proof_points: ProofPoint[] | null;
  banned_words: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProofPoint {
  type: 'testimonial' | 'case_study' | 'metric' | 'credential';
  content: string;
}

export type ProjectStatus = 'research' | 'building' | 'launching' | 'live' | 'archived';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  customer_dna_id: string | null;
  app_dna_id: string | null;
  brand_dna_id: string | null;
  status: ProjectStatus;
  progress: number;
  created_at: string;
  updated_at: string;
  // Joined data
  customer_dna?: CustomerDNA;
  app_dna?: AppDNA;
  brand_dna?: BrandDNA;
  copy_assets?: CopyAsset[];
}

export interface LandingPage {
  id: string;
  project_id: string;
  name: string;
  blocks: LandingPageBlock[];
  html_output: string | null;
  created_at: string;
  updated_at: string;
}

export interface LandingPageBlock {
  type: 'hero' | 'problem' | 'solution' | 'features' | 'how_it_works' | 'transformation' | 'social_proof' | 'pricing' | 'faq' | 'guarantee' | 'about' | 'cta' | 'footer';
  content: Record<string, unknown>;
  order: number;
}

export interface LaunchSequence {
  id: string;
  project_id: string;
  day: number;
  theme: string;
  stories: StoryContent[];
  email_version: string | null;
  hook_variations: string[] | null;
  cta_variations: string[] | null;
  visual_suggestions: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface StoryContent {
  number: number;
  text: string;
  visual_suggestion?: string;
}

export interface Offer {
  id: string;
  project_id: string;
  name: string;
  tagline: string | null;
  pricing_type: 'one-time' | 'subscription' | 'tiered';
  price_amount: number | null;
  price_interval: string | null;
  bonuses: OfferBonus[];
  guarantee: string | null;
  charter_content: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfferBonus {
  name: string;
  value: number;
  description: string;
}

export type CopyAssetType = 'vsl' | 'email_welcome' | 'email_launch' | 'ad_facebook' | 'ad_instagram' | 'headlines' | 'objections' | 'case_study';

export interface CopyAsset {
  id: string;
  project_id: string;
  type: CopyAssetType;
  name: string | null;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentRun {
  id: string;
  project_id: string;
  agent_type: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown> | null;
  status: AgentStatus;
  error_message: string | null;
  tokens_used: number | null;
  created_at: string;
  completed_at: string | null;
}

export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  features: string[];
  tech_stack: string[] | null;
  difficulty: TemplateDifficulty | null;
  estimated_hours: number | null;
  pm_method_guide: string | null;
  starter_code_url: string | null;
  preview_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

// Agent types for the AI system
export type AgentType = 
  | 'app_idea_validator'
  | 'niche_analyzer'
  | 'competitor_xray'
  | 'transformation_mapper'
  | 'landing_page_generator'
  | 'launch_sequence_generator'
  | 'offer_builder'
  | 'vsl_writer'
  | 'email_generator'
  | 'ad_copy_generator'
  | 'headline_generator'
  | 'objection_handler';

// 7-Day Launch themes
export const LAUNCH_DAY_THEMES = [
  { day: 1, theme: 'Survey', description: 'Ask about struggles, gather intel' },
  { day: 2, theme: 'Validation', description: 'Share responses, give free tip, tease solution' },
  { day: 3, theme: 'Behind the Scenes', description: 'Show the app, explain why you built it' },
  { day: 4, theme: 'Transformation', description: 'Before/after story, case study format' },
  { day: 5, theme: 'Objection Handling', description: 'Address top 3 concerns' },
  { day: 6, theme: 'Launch Day', description: 'Open cart, share offer details' },
  { day: 7, theme: 'Last Chance', description: 'Urgency, final testimonials, close' },
] as const;

// Landing page block types
export const LANDING_PAGE_BLOCKS = [
  { type: 'hero', name: 'Hero', description: 'Headline + subheadline + CTA' },
  { type: 'problem', name: 'Problem', description: 'Agitate the pain point' },
  { type: 'solution', name: 'Solution', description: 'Introduce your app' },
  { type: 'features', name: 'Features', description: '3-5 key features' },
  { type: 'how_it_works', name: 'How It Works', description: '3-step process' },
  { type: 'transformation', name: 'Transformation', description: 'Before/after states' },
  { type: 'social_proof', name: 'Social Proof', description: 'Testimonials, logos, numbers' },
  { type: 'pricing', name: 'Pricing', description: 'Plans and pricing' },
  { type: 'faq', name: 'FAQ', description: 'Common questions' },
  { type: 'guarantee', name: 'Guarantee', description: 'Risk reversal' },
  { type: 'about', name: 'About', description: 'Your story and credentials' },
  { type: 'cta', name: 'Final CTA', description: 'Last call to action' },
  { type: 'footer', name: 'Footer', description: 'Links and legal' },
] as const;
