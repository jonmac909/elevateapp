'use client';

import { useState, useEffect } from 'react';
import { CustomerDNA } from '@/lib/elevate-types';
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <ModalFieldButton
        label="Main Problem"
        icon="💭"
        value={formData.main_problem || ''}
        onChange={(value) => handleChange('main_problem', value)}
        placeholder="Describe the core problem your app solves in visceral detail..."
      />

      {/* Transformation Map */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
            <span>🔄</span> Transformation Map
          </h4>
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
          {/* BEFORE State */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-600 px-1">😰 BEFORE State</p>
            <ModalFieldButton
              label="Emotional State"
              icon="💔"
              value={formData.before_emotional_state || ''}
              onChange={(value) => handleChange('before_emotional_state', value)}
              placeholder="Overwhelmed, drowning in..."
            />
            <ModalFieldButton
              label="Core Fear"
              icon="😨"
              value={formData.before_core_fear || ''}
              onChange={(value) => handleChange('before_core_fear', value)}
              placeholder="Afraid that..."
            />
            <ModalFieldButton
              label="Daily Experience"
              icon="📅"
              value={formData.before_daily_experience || ''}
              onChange={(value) => handleChange('before_daily_experience', value)}
              placeholder="Every day they..."
            />
            <ModalFieldButton
              label="Self-Identity"
              icon="🪞"
              value={formData.before_self_identity || ''}
              onChange={(value) => handleChange('before_self_identity', value)}
              placeholder="They see themselves as..."
            />
          </div>

          {/* AFTER State */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-green-600 px-1">✨ AFTER State</p>
            <ModalFieldButton
              label="Emotional State"
              icon="💚"
              value={formData.after_emotional_state || ''}
              onChange={(value) => handleChange('after_emotional_state', value)}
              placeholder="Confident, in control..."
            />
            <ModalFieldButton
              label="Core Fear (Resolved)"
              icon="🛡️"
              value={formData.after_core_fear || ''}
              onChange={(value) => handleChange('after_core_fear', value)}
              placeholder="Now they believe..."
            />
            <ModalFieldButton
              label="Daily Experience"
              icon="🌟"
              value={formData.after_daily_experience || ''}
              onChange={(value) => handleChange('after_daily_experience', value)}
              placeholder="Now every day they..."
            />
            <ModalFieldButton
              label="Self-Identity"
              icon="👑"
              value={formData.after_self_identity || ''}
              onChange={(value) => handleChange('after_self_identity', value)}
              placeholder="They see themselves as..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
