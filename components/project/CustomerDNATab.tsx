'use client';

import { useState, useEffect } from 'react';
import { CustomerDNA } from '@/lib/elevate-types';
import { FieldRowCard } from '@/components/ui/FieldModal';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#11142D]">Customer DNA</h3>
        <div className="flex gap-2">
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('fill_customer_dna')}
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
          label="Target Market"
          icon="🎯"
          value={formData.target_market || ''}
          onChange={(value) => handleChange('target_market', value)}
          placeholder="e.g., First-time course creators with less than 100 students"
        />
        <FieldRowCard
          label="Demographics"
          icon="👥"
          value={formData.demographics || ''}
          onChange={(value) => handleChange('demographics', value)}
          placeholder="e.g., 25-45, US-based, $50k-150k income"
        />
        <FieldRowCard
          label="Main Problem"
          icon="💭"
          value={formData.main_problem || ''}
          onChange={(value) => handleChange('main_problem', value)}
          placeholder="Describe the core problem your app solves in visceral detail..."
        />
      </div>

      {/* Transformation Map */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-[#11142D]">🔄 Transformation Map</h4>
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('transformation_mapper')}
              className="px-3 py-1.5 bg-[#47A8DF] text-white rounded-lg text-xs font-medium hover:bg-[#3B96C9]"
            >
              Generate with AI
            </button>
          )}
        </div>

        <p className="text-sm text-[#808191] mb-4">BEFORE State</p>
        <div className="space-y-4">
          <FieldRowCard
            label="Emotional State"
            icon="💔"
            value={formData.before_emotional_state || ''}
            onChange={(value) => handleChange('before_emotional_state', value)}
            placeholder="Overwhelmed, drowning in..."
          />
          <FieldRowCard
            label="Core Fear"
            icon="😨"
            value={formData.before_core_fear || ''}
            onChange={(value) => handleChange('before_core_fear', value)}
            placeholder="Afraid that..."
          />
          <FieldRowCard
            label="Daily Experience"
            icon="📅"
            value={formData.before_daily_experience || ''}
            onChange={(value) => handleChange('before_daily_experience', value)}
            placeholder="Every day they..."
          />
          <FieldRowCard
            label="Self-Identity"
            icon="🪞"
            value={formData.before_self_identity || ''}
            onChange={(value) => handleChange('before_self_identity', value)}
            placeholder="They see themselves as..."
          />
        </div>

        <p className="text-sm text-[#808191] mb-4 mt-8">AFTER State</p>
        <div className="space-y-4">
          <FieldRowCard
            label="Emotional State"
            icon="💚"
            value={formData.after_emotional_state || ''}
            onChange={(value) => handleChange('after_emotional_state', value)}
            placeholder="Confident, in control..."
          />
          <FieldRowCard
            label="Core Fear (Resolved)"
            icon="🛡️"
            value={formData.after_core_fear || ''}
            onChange={(value) => handleChange('after_core_fear', value)}
            placeholder="Now they believe..."
          />
          <FieldRowCard
            label="Daily Experience"
            icon="🌟"
            value={formData.after_daily_experience || ''}
            onChange={(value) => handleChange('after_daily_experience', value)}
            placeholder="Now every day they..."
          />
          <FieldRowCard
            label="Self-Identity"
            icon="👑"
            value={formData.after_self_identity || ''}
            onChange={(value) => handleChange('after_self_identity', value)}
            placeholder="They see themselves as..."
          />
        </div>
      </div>
    </div>
  );
}
