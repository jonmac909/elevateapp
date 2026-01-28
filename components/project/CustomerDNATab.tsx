'use client';

import { useState, useEffect } from 'react';
import { CustomerDNA } from '@/lib/elevate-types';
import { ContentField } from '@/components/ui/ContentField';
import { SectionCard } from '@/components/ui/SectionCard';
import { ModalFieldButton } from '@/components/ui/FieldModal';

export function CustomerDNATab({ 
  dna, 
  onUpdate, 
  onRunAgent 
}: { 
  dna?: CustomerDNA; 
  onUpdate: (updates: Partial<CustomerDNA>) => void; 
  onRunAgent?: (type: string) => void;
}) {
  const [formData, setFormData] = useState<Partial<CustomerDNA>>(dna || {});

  useEffect(() => {
    if (dna) setFormData(dna);
  }, [JSON.stringify(dna)]);

  const handleChange = (field: keyof CustomerDNA, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Customer DNA</h3>
        <div className="flex gap-3">
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('fill_customer_dna')}
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

      {/* Target Market & Demographics - Modal buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <ModalFieldButton
          label="Target Market"
          icon="🎯"
          value={formData.target_market || ''}
          onChange={(value) => handleChange('target_market', value)}
          placeholder="e.g., First-time course creators with less than 100 students"
        />
        <ModalFieldButton
          label="Demographics"
          icon="👥"
          value={formData.demographics || ''}
          onChange={(value) => handleChange('demographics', value)}
          placeholder="e.g., 25-45, US-based, $50k-150k income"
        />
      </div>

      {/* Main Problem - NOT bold */}
      <div className="pt-4">
        <ContentField
          label="Main Problem"
          icon="💭"
          value={formData.main_problem || ''}
          onChange={(value) => handleChange('main_problem', value)}
          placeholder="Describe the core problem your app solves in visceral detail..."
          multiline
        />
      </div>

      {/* Transformation Map */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <h4 className="font-semibold text-[var(--foreground)]">Transformation Map</h4>
          </div>
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('transformation_mapper')}
              className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
            >
              Generate with AI
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BEFORE State - Red Accent */}
          <SectionCard
            title="BEFORE State"
            accentColor="#EF4444"
            icon="😰"
            className="bg-red-50/50 dark:bg-red-950/20"
          >
            <ContentField
              label="Emotional State"
              value={formData.before_emotional_state || ''}
              onChange={(value) => handleChange('before_emotional_state', value)}
              placeholder="Overwhelmed, drowning in..."
            />
            <ContentField
              label="Core Fear"
              value={formData.before_core_fear || ''}
              onChange={(value) => handleChange('before_core_fear', value)}
              placeholder="Afraid that..."
            />
            <ContentField
              label="Daily Experience"
              value={formData.before_daily_experience || ''}
              onChange={(value) => handleChange('before_daily_experience', value)}
              placeholder="Every day they..."
            />
            <ContentField
              label="Self-Identity"
              value={formData.before_self_identity || ''}
              onChange={(value) => handleChange('before_self_identity', value)}
              placeholder="They see themselves as..."
            />
          </SectionCard>

          {/* AFTER State - Green Accent */}
          <SectionCard
            title="AFTER State"
            accentColor="#22C55E"
            icon="✨"
            className="bg-green-50/50 dark:bg-green-950/20"
          >
            <ContentField
              label="Emotional State"
              value={formData.after_emotional_state || ''}
              onChange={(value) => handleChange('after_emotional_state', value)}
              placeholder="Confident, in control..."
            />
            <ContentField
              label="Core Fear (Resolved)"
              value={formData.after_core_fear || ''}
              onChange={(value) => handleChange('after_core_fear', value)}
              placeholder="Now they believe..."
            />
            <ContentField
              label="Daily Experience"
              value={formData.after_daily_experience || ''}
              onChange={(value) => handleChange('after_daily_experience', value)}
              placeholder="Now every day they..."
            />
            <ContentField
              label="Self-Identity"
              value={formData.after_self_identity || ''}
              onChange={(value) => handleChange('after_self_identity', value)}
              placeholder="They see themselves as..."
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
