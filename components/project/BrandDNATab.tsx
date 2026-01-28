'use client';

import { useState, useEffect } from 'react';
import { BrandDNA } from '@/lib/elevate-types';

export function BrandDNATab({ 
  dna, 
  onUpdate, 
  onRunAgent 
}: { 
  dna?: BrandDNA; 
  onUpdate: (updates: Partial<BrandDNA>) => void; 
  onRunAgent?: (type: string) => void;
}) {
  const [formData, setFormData] = useState<Partial<BrandDNA>>(dna || {});

  useEffect(() => {
    if (dna) setFormData(dna);
  }, [JSON.stringify(dna)]);

  const handleChange = (field: keyof BrandDNA, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#11142D]">Brand DNA</h3>
        <div className="flex gap-2">
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('fill_brand_dna')}
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

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Your Story</label>
        <textarea
          value={formData.your_story || ''}
          onChange={(e) => handleChange('your_story', e.target.value)}
          placeholder="Share your journey... Why are you the right person to build this? What experience do you bring?"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Credentials</label>
        <textarea
          value={formData.credentials || ''}
          onChange={(e) => handleChange('credentials', e.target.value)}
          placeholder="List your relevant credentials, experience, results you've achieved..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Voice Tone</label>
          <select
            value={formData.voice_tone || ''}
            onChange={(e) => handleChange('voice_tone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          >
            <option value="">Select tone...</option>
            <option value="casual">Casual & Friendly</option>
            <option value="professional">Professional</option>
            <option value="authoritative">Authoritative</option>
            <option value="empathetic">Empathetic & Warm</option>
            <option value="energetic">Energetic & Bold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Banned Words</label>
          <input
            type="text"
            value={(formData.banned_words || []).join(', ')}
            onChange={(e) => handleChange('banned_words', e.target.value.split(',').map(w => w.trim()))}
            placeholder="e.g., synergy, guru, hack, ninja"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </div>
  );
}
