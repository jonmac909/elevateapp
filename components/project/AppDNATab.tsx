'use client';

import { useState, useEffect } from 'react';
import { AppDNA } from '@/lib/elevate-types';
import { FieldRowCard } from '@/components/ui/FieldModal';

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

      <div className="space-y-4">
        <FieldRowCard
          label="App Name"
          icon="📱"
          value={formData.name || ''}
          onChange={(value) => handleChange('name', value)}
          placeholder="e.g., CourseBot Pro"
        />
        <FieldRowCard
          label="Tagline"
          icon="✏️"
          value={formData.tagline || ''}
          onChange={(value) => handleChange('tagline', value)}
          placeholder="e.g., Your 24/7 student support team"
        />
        <FieldRowCard
          label="Problem Solved"
          icon="🎯"
          value={formData.problem_solved || ''}
          onChange={(value) => handleChange('problem_solved', value)}
          placeholder="Describe the core problem your app solves..."
        />
        <FieldRowCard
          label="Mechanism Name"
          icon="⚡"
          value={formData.unique_mechanism || ''}
          onChange={(value) => handleChange('unique_mechanism', value)}
          placeholder='e.g., "The Knowledge Engine Protocol"'
        />
        <FieldRowCard
          label="Mechanism Description"
          icon="📝"
          value={formData.unique_mechanism_description || ''}
          onChange={(value) => handleChange('unique_mechanism_description', value)}
          placeholder="How it works in one sentence..."
        />
      </div>
    </div>
  );
}
