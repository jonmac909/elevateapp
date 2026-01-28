'use client';

import { useState, useEffect } from 'react';
import { BrandDNA } from '@/lib/elevate-types';
import { ModalFieldButton } from '@/components/ui/FieldModal';

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
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Brand DNA</h3>
        <div className="flex gap-3">
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('fill_brand_dna')}
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

      <ModalFieldButton
        label="Your Story"
        icon="📖"
        value={formData.your_story || ''}
        onChange={(value) => handleChange('your_story', value)}
        placeholder="Share your journey... Why are you the right person to build this?"
      />

      <ModalFieldButton
        label="Credentials"
        icon="🏆"
        value={formData.credentials || ''}
        onChange={(value) => handleChange('credentials', value)}
        placeholder="List your relevant credentials, experience, results you've achieved..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModalFieldButton
          label="Voice Tone"
          icon="🎭"
          value={formData.voice_tone || ''}
          onChange={(value) => handleChange('voice_tone', value)}
          placeholder="e.g., Casual & Friendly, Professional, Authoritative..."
        />
        <ModalFieldButton
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
