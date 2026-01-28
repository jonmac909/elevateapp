'use client';

import { useState, useEffect } from 'react';
import { AppDNA } from '@/lib/elevate-types';

export function AppDNATab({ 
  dna, 
  onUpdate, 
  onRunAgent 
}: { 
  dna?: AppDNA; 
  onUpdate: (updates: Partial<AppDNA>) => void; 
  onRunAgent?: (type: string) => void;
}) {
  const [formData, setFormData] = useState<Partial<AppDNA>>(dna || {});

  useEffect(() => {
    if (dna) setFormData(dna);
  }, [JSON.stringify(dna)]);

  const handleChange = (field: keyof AppDNA, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#11142D]">App DNA</h3>
        <div className="flex gap-2">
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('fill_app_dna')}
              className="px-4 py-2 border border-[#47A8DF] text-[#47A8DF] rounded-xl font-medium hover:bg-[#47A8DF] hover:text-white transition-colors"
            >
              ✨ Fill with AI
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#47A8DF] text-white rounded-xl font-medium hover:bg-[#3B96C9]"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">App Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., CourseBot Pro"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Tagline</label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="e.g., Your 24/7 student support team"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Problem Solved</label>
        <textarea
          value={formData.problem_solved || ''}
          onChange={(e) => handleChange('problem_solved', e.target.value)}
          placeholder="Describe the core problem your app solves..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Mechanism Name</label>
          <input
            type="text"
            value={formData.unique_mechanism || ''}
            onChange={(e) => handleChange('unique_mechanism', e.target.value)}
            placeholder='e.g., "The Knowledge Engine Protocol"'
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Mechanism Description</label>
          <input
            type="text"
            value={formData.unique_mechanism_description || ''}
            onChange={(e) => handleChange('unique_mechanism_description', e.target.value)}
            placeholder="How it works in one sentence..."
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </div>
  );
}
