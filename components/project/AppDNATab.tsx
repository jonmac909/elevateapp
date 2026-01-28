'use client';

import { useState, useEffect } from 'react';
import { AppDNA } from '@/lib/elevate-types';
import { ContentField } from '@/components/ui/ContentField';
import { ModalFieldButton } from '@/components/ui/FieldModal';

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
    <div className="space-y-8 max-w-5xl">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">App DNA</h3>
        <div className="flex gap-3">
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('fill_app_dna')}
              className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] rounded-xl font-medium hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
            >
              ✨ Fill with AI
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* App Name & Tagline - Modal buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <ModalFieldButton
          label="App Name"
          icon="📱"
          value={formData.name || ''}
          onChange={(value) => handleChange('name', value)}
          placeholder="e.g., CourseBot Pro"
          multiline={false}
        />
        <ModalFieldButton
          label="Tagline"
          icon="✏️"
          value={formData.tagline || ''}
          onChange={(value) => handleChange('tagline', value)}
          placeholder="e.g., Your 24/7 student support team"
          multiline={false}
        />
      </div>

      {/* Problem Solved */}
      <div className="pt-4">
        <ContentField
          label="Problem Solved"
          icon="🎯"
          value={formData.problem_solved || ''}
          onChange={(value) => handleChange('problem_solved', value)}
          placeholder="Describe the core problem your app solves..."
          multiline
        />
      </div>

      {/* Mechanism Name & Description - Modal buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <ModalFieldButton
          label="Mechanism Name"
          icon="⚡"
          value={formData.unique_mechanism || ''}
          onChange={(value) => handleChange('unique_mechanism', value)}
          placeholder='e.g., "The Knowledge Engine Protocol"'
          multiline={false}
        />
        <ModalFieldButton
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
