'use client';

import { useState, useEffect } from 'react';
import { BrandDNA } from '@/lib/elevate-types';
import { FieldRowCard } from '@/components/ui/FieldModal';

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

      <div className="space-y-4">
        <FieldRowCard
          label="Your Story"
          icon="📖"
          value={formData.your_story || ''}
          onChange={(value) => handleChange('your_story', value)}
          placeholder="Share your journey... Why are you the right person to build this?"
        />
        <FieldRowCard
          label="Credentials"
          icon="🏆"
          value={formData.credentials || ''}
          onChange={(value) => handleChange('credentials', value)}
          placeholder="List your relevant credentials, experience, results you've achieved..."
        />
        <FieldRowCard
          label="Voice Tone"
          icon="🎭"
          value={formData.voice_tone || ''}
          onChange={(value) => handleChange('voice_tone', value)}
          placeholder="e.g., Casual & Friendly, Professional, Authoritative..."
        />
        <FieldRowCard
          label="Banned Words"
          icon="🚫"
          value={(formData.banned_words || []).join(', ')}
          onChange={(value) => handleChange('banned_words', value.split(',').map(w => w.trim()))}
          placeholder="e.g., synergy, guru, hack, ninja"
        />
      </div>
    </div>
  );
}
