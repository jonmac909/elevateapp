'use client';

import { useState, useEffect } from 'react';
import { CustomerDNA } from '@/lib/elevate-types';

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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Target Market</label>
          <input
            type="text"
            value={formData.target_market || ''}
            onChange={(e) => handleChange('target_market', e.target.value)}
            placeholder="e.g., First-time course creators with less than 100 students"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Demographics</label>
          <input
            type="text"
            value={formData.demographics || ''}
            onChange={(e) => handleChange('demographics', e.target.value)}
            placeholder="e.g., 25-45, US-based, $50k-150k income"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Main Problem</label>
        <textarea
          value={formData.main_problem || ''}
          onChange={(e) => handleChange('main_problem', e.target.value)}
          placeholder="Describe the core problem your app solves in visceral detail..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#E4E4E4]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-[#11142D]">Transformation Map</h4>
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('transformation_mapper')}
              className="px-3 py-1.5 bg-[#47A8DF] text-white rounded-lg text-xs font-medium hover:bg-[#3B96C9]"
            >
              Generate with AI
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-red-700 mb-2">BEFORE State</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-red-600">Emotional State</label>
                <input
                  type="text"
                  value={formData.before_emotional_state || ''}
                  onChange={(e) => handleChange('before_emotional_state', e.target.value)}
                  placeholder="Overwhelmed, drowning in..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-red-600">Core Fear</label>
                <input
                  type="text"
                  value={formData.before_core_fear || ''}
                  onChange={(e) => handleChange('before_core_fear', e.target.value)}
                  placeholder="Afraid that..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-red-600">Daily Experience</label>
                <input
                  type="text"
                  value={formData.before_daily_experience || ''}
                  onChange={(e) => handleChange('before_daily_experience', e.target.value)}
                  placeholder="Every day they..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-red-600">Self-Identity</label>
                <input
                  type="text"
                  value={formData.before_self_identity || ''}
                  onChange={(e) => handleChange('before_self_identity', e.target.value)}
                  placeholder="They see themselves as..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800 mb-2">AFTER State</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-green-600">Emotional State</label>
                <input
                  type="text"
                  value={formData.after_emotional_state || ''}
                  onChange={(e) => handleChange('after_emotional_state', e.target.value)}
                  placeholder="Confident, in control..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-green-600">Core Fear (Resolved)</label>
                <input
                  type="text"
                  value={formData.after_core_fear || ''}
                  onChange={(e) => handleChange('after_core_fear', e.target.value)}
                  placeholder="Now they believe..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-green-600">Daily Experience</label>
                <input
                  type="text"
                  value={formData.after_daily_experience || ''}
                  onChange={(e) => handleChange('after_daily_experience', e.target.value)}
                  placeholder="Now every day they..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-green-600">Self-Identity</label>
                <input
                  type="text"
                  value={formData.after_self_identity || ''}
                  onChange={(e) => handleChange('after_self_identity', e.target.value)}
                  placeholder="They see themselves as..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
