'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/elevate-types';
import { LoadingState, PageHeader } from '@/components/ui';

export default function BrandDNAPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-8">
      <PageHeader
        title="Brand DNA"
        subtitle="Define your brand voice and story"
        backHref="/"
        backLabel="Back to Dashboard"
      />

      {loading ? (
        <LoadingState title="Loading projects..." subtitle="Fetching your projects" />
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E4E4E4] p-8 text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-[#11142D] mb-2">No projects yet</h3>
          <p className="text-[#808191] mb-4">Create a project to define your brand DNA</p>
          <Link href="/" className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9] transition-colors inline-block">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}?tab=brand`}
              className="bg-white rounded-xl border border-[#E4E4E4] p-6 hover:border-[#47A8DF] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 bg-[#47A8DF] rounded-xl flex items-center justify-center">
                  <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#11142D]">{project.name}</h3>
                  <p className="text-sm text-[#808191]">Brand DNA</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#808191]">Your Story</span>
                  <span className="text-[#11142D]">{project.brand_dna?.your_story ? '✓ Defined' : '○ Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#808191]">Voice & Tone</span>
                  <span className="text-[#11142D]">{project.brand_dna?.voice_tone ? '✓ Defined' : '○ Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#808191]">Credentials</span>
                  <span className="text-[#11142D]">{project.brand_dna?.credentials ? '✓ Defined' : '○ Not set'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
