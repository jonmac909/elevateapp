'use client';

import { useState } from 'react';
import { Project, AppDNA } from '@/lib/elevate-types';

export function BuildTab({ 
  project, 
  onUpdate 
}: { 
  project: Project; 
  onUpdate: (updates: Partial<AppDNA>) => Promise<void>;
}) {
  const [deployUrl, setDeployUrl] = useState(project.app_dna?.deploy_url || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ deploy_url: deployUrl });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Build Your App</h3>
      
      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-[#11142D] mb-2">PM Method Steps</h4>
        <p className="text-sm text-[#808191] mb-4">Follow these steps with Claude Code to build your app:</p>
        
        <div className="space-y-3">
          {[
            { step: 1, title: 'Project Setup', desc: 'Initialize project with Next.js + Supabase' },
            { step: 2, title: 'Core Data Model', desc: 'Define database schema and types' },
            { step: 3, title: 'Auth Flow', desc: 'Set up authentication (if needed)' },
            { step: 4, title: 'Main Feature', desc: 'Build the core functionality' },
            { step: 5, title: 'UI Polish', desc: 'Style and make responsive' },
            { step: 6, title: 'Deploy', desc: 'Deploy to Vercel or Cloudflare' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <div className="size-8 bg-[#47A8DF] text-white rounded-full flex items-center justify-center text-sm font-bold">
                {item.step}
              </div>
              <div>
                <p className="font-medium text-[#11142D]">{item.title}</p>
                <p className="text-xs text-[#808191]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border border-[#E4E4E4]">
        <label className="block text-sm font-medium text-[#11142D] mb-2">Deploy URL</label>
        <p className="text-sm text-[#808191] mb-3">Once deployed, paste your app URL here:</p>
        <div className="flex gap-3">
          <input
            type="url"
            value={deployUrl}
            onChange={(e) => setDeployUrl(e.target.value)}
            placeholder="https://your-app.vercel.app"
            className="flex-1 px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-3 bg-[#47A8DF] text-white rounded-xl font-medium hover:bg-[#3B96C9] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        {project.app_dna?.deploy_url && (
          <p className="mt-3 text-sm">
            <a 
              href={project.app_dna.deploy_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#47A8DF] hover:underline"
            >
              Visit your deployed app →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
