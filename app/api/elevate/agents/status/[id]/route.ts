import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Poll agent job status.
 * Returns: { status: 'pending' | 'running' | 'completed' | 'failed', output?, error? }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: job, error } = await supabase
    .from('elevate_agent_runs')
    .select('id, status, output_data, agent_type, tokens_used, completed_at, created_at')
    .eq('id', id)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const response: Record<string, unknown> = {
    job_id: job.id,
    status: job.status,
    agent_type: job.agent_type,
  };

  if (job.status === 'completed') {
    response.output = job.output_data;
    response.tokens_used = job.tokens_used;
    response.completed_at = job.completed_at;
  } else if (job.status === 'failed') {
    response.error = (job.output_data as Record<string, string>)?.error || 'Unknown error';
  }

  // Include elapsed time for running jobs
  if (job.status === 'running' || job.status === 'pending') {
    const elapsed = Date.now() - new Date(job.created_at).getTime();
    response.elapsed_ms = elapsed;
  }

  return NextResponse.json(response);
}
