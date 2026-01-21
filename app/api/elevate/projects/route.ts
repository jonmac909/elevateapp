import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('elevate_projects')
      .select(`
        *,
        customer_dna:elevate_customer_dnas(*),
        app_dna:elevate_app_dnas(*),
        brand_dna:elevate_brand_dnas(*)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ projects: [] });
    }

    return NextResponse.json({ projects: projects || [] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, template_id } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Create the project
    const { data: project, error: projectError } = await supabase
      .from('elevate_projects')
      .insert({
        name,
        user_id: 'default',
        status: 'research',
        progress: 0,
      })
      .select()
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    // Create empty DNAs for the project
    const [customerDnaResult, appDnaResult, brandDnaResult] = await Promise.all([
      supabase.from('elevate_customer_dnas').insert({
        user_id: 'default',
        name: `${name} - Customer`,
      }).select().single(),
      supabase.from('elevate_app_dnas').insert({
        user_id: 'default',
        name: name,
        template_used: template_id,
      }).select().single(),
      supabase.from('elevate_brand_dnas').insert({
        user_id: 'default',
        name: `${name} - Brand`,
      }).select().single(),
    ]);

    // Link DNAs to project
    if (customerDnaResult.data && appDnaResult.data && brandDnaResult.data) {
      await supabase
        .from('elevate_projects')
        .update({
          customer_dna_id: customerDnaResult.data.id,
          app_dna_id: appDnaResult.data.id,
          brand_dna_id: brandDnaResult.data.id,
        })
        .eq('id', project.id);
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
