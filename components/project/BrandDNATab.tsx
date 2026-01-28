'use client';

import { useState, useEffect } from 'react';
import { BrandDNA } from '@/lib/elevate-types';
import { ContentField } from '@/components/ui/ContentField';
import { cn } from '@/lib/utils';

const voiceTones = [
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'empathetic', label: 'Empathetic & Warm' },
  { value: 'energetic', label: 'Energetic & Bold' },
];

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
  const [showToneOptions, setShowToneOptions] = useState(false);

  useEffect(() => {
    if (dna) setFormData(dna);
  }, [JSON.stringify(dna)]);

  const handleChange = (field: keyof BrandDNA, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  const selectedTone = voiceTones.find(t => t.value === formData.voice_tone);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header with Actions */}
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

      {/* Your Story - Hero Field */}
      <div className="pt-4">
        <ContentField
          label="Your Story"
          icon="📖"
          value={formData.your_story || ''}
          onChange={(value) => handleChange('your_story', value)}
          placeholder="Share your journey... Why are you the right person to build this? What experience do you bring?"
          multiline
          large
        />
      </div>

      {/* Credentials */}
      <ContentField
        label="Credentials"
        icon="🏆"
        value={formData.credentials || ''}
        onChange={(value) => handleChange('credentials', value)}
        placeholder="List your relevant credentials, experience, results you've achieved..."
        multiline
      />

      {/* Voice Tone & Banned Words */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Custom Voice Tone Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] px-4">
            <span className="text-base">🎭</span>
            Voice Tone
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowToneOptions(!showToneOptions)}
              className={cn(
                'w-full px-4 py-3 rounded-lg text-left',
                'border border-transparent',
                'transition-all duration-200',
                'text-[var(--foreground)] bg-transparent',
                'hover:bg-[var(--hover-bg)]',
                'focus:outline-none focus:bg-[var(--hover-bg)] focus:border-b-2 focus:border-b-[var(--primary)]',
                !formData.voice_tone && 'italic text-gray-400 dark:text-gray-600'
              )}
            >
              {selectedTone?.label || 'Select tone...'}
            </button>
            
            {showToneOptions && (
              <div className="absolute z-10 w-full mt-1 py-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg">
                {voiceTones.map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => {
                      handleChange('voice_tone', tone.value);
                      setShowToneOptions(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2 text-left transition-colors duration-150',
                      'hover:bg-[var(--hover-bg)]',
                      formData.voice_tone === tone.value && 'bg-[var(--hover-bg)] text-[var(--primary)]'
                    )}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Banned Words */}
        <ContentField
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
