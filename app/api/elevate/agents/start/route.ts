import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidAgentType } from '@/lib/agent-prompts';

/**
 * Async agent execution via Supabase job queue.
 * 
 * This route ONLY creates the job row. A background worker on the VPS
 * picks up pending jobs and processes them via the local Clawdbot gateway.
 * No Cloudflare timeout issues — the AI call never touches CF.
 * 
 * Flow:
 * 1. Frontend calls POST /api/elevate/agents/start → creates job, returns job_id
 * 2. VPS worker (agent-worker.js) polls Supabase, picks up the job, calls AI locally
 * 3. Frontend polls GET /api/elevate/agents/status/[id] for results
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, agent_type } = body;

    if (!project_id || !agent_type) {
      return NextResponse.json({ error: 'Missing project_id or agent_type' }, { status: 400 });
    }

    if (!isValidAgentType(agent_type)) {
      return NextResponse.json({ error: 'Unknown agent type' }, { status: 400 });
    }

    // Fetch project to verify it exists and build context for the worker
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

    // Build context for the worker to use
    const context = {
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

    // Create job row — the VPS worker will pick it up
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
