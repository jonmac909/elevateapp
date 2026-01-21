'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/elevate-types';
import { LoadingState, PageHeader, useToast } from '@/components/ui';

const LAUNCH_STEPS = [
  { step: 1, title: 'Customer DNA', desc: 'Define your ideal customer', icon: '👤', tab: 'customer' },
  { step: 2, title: 'App DNA', desc: 'Define your app identity', icon: '📱', tab: 'app' },
  { step: 3, title: 'Brand DNA', desc: 'Define your brand voice', icon: '🎨', tab: 'brand' },
  { step: 4, title: 'Research', desc: 'Validate your idea', icon: '🔍', tab: 'research' },
  { step: 5, title: 'Landing Page', desc: 'Generate your page', icon: '📄', tab: 'launch' },
  { step: 6, title: 'Copy', desc: 'Create marketing copy', icon: '✍️', tab: 'copy' },
];

export default function LaunchPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/elevate/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectProgress = (project: Project) => {
    let completed = 0;
    if (project.customer_dna?.target_market && project.customer_dna?.main_problem) completed++;
    if (project.app_dna?.name && project.app_dna?.tagline) completed++;
    if (project.brand_dna?.your_story || project.brand_dna?.voice_tone) completed++;
    return Math.round((completed / 3) * 100);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Launch Center"
        subtitle="Follow the launch checklist to go live"
        backHref="/"
        backLabel="Back to Dashboard"
      />

      {loading ? (
        <LoadingState title="Loading projects..." subtitle="Fetching your projects" />
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E4E4E4] p-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-[#11142D] mb-2">No projects yet</h3>
          <p className="text-[#808191] mb-4">Create a project to start your launch journey</p>
          <Link href="/" className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9] transition-colors inline-block">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-[#E4E4E4] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#47A8DF] rounded-xl flex items-center justify-center">
                    <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#11142D]">{project.name}</h3>
                    <p className="text-sm text-[#808191]">{getProjectProgress(project)}% complete</p>
                  </div>
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9] transition-colors"
                >
                  Open Project
                </Link>
              </div>

              <div className="h-2 bg-[#E4E4E4] rounded-full mb-6">
                <div 
                  className="h-full bg-[#47A8DF] rounded-full transition-all"
                  style={{ width: `${getProjectProgress(project)}%` }}
                />
              </div>

              <div className="grid grid-cols-6 gap-4">
                {LAUNCH_STEPS.map((item) => (
                  <Link
                    key={item.step}
                    href={`/projects/${project.id}?tab=${item.tab}`}
                    className="p-3 bg-[#F7F8FA] rounded-lg hover:bg-[#E4E4E4] transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-medium text-[#11142D]">{item.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
