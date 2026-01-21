'use client';

import { useState, ReactNode } from 'react';

interface WizardStep {
  title: string;
  content: ReactNode;
}

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  steps: WizardStep[];
  onComplete: (data: Record<string, unknown>) => void;
  badge?: string;
}

export default function WizardModal({
  isOpen,
  onClose,
  title,
  subtitle,
  steps,
  onComplete,
  badge,
}: WizardModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});

  if (!isOpen) return null;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete(data);
      onClose();
      setCurrentStep(0);
      setData({});
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      onClose();
      setCurrentStep(0);
      setData({});
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E4E4E4]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#11142D]">{title}</h2>
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
            >
              <svg className="size-5 text-[#808191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {subtitle && <p className="text-sm text-[#808191] mt-1">{subtitle}</p>}
        </div>

        {/* Step Title */}
        <div className="px-6 pt-4">
          <p className="text-sm font-medium text-[#7C3AED]">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{steps[currentStep].content}</div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E4E4E4] flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-[#7C3AED]'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-[#E4E4E4] rounded-xl font-medium text-[#808191] hover:bg-gray-50 transition-colors"
            >
              {isFirstStep ? 'Cancel' : 'Return'}
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl font-medium hover:bg-[#6D28D9] transition-colors"
            >
              {isLastStep ? 'Create' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ModeToggleProps {
  mode: 'manual' | 'auto';
  onChange: (mode: 'manual' | 'auto') => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-xl border border-[#E4E4E4] p-1">
      <button
        onClick={() => onChange('manual')}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'manual'
            ? 'bg-[#7C3AED] text-white'
            : 'text-[#808191] hover:text-[#11142D]'
        }`}
      >
        Manual
      </button>
      <button
        onClick={() => onChange('auto')}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'auto'
            ? 'bg-[#7C3AED] text-white'
            : 'text-[#808191] hover:text-[#11142D]'
        }`}
      >
        Auto
      </button>
    </div>
  );
}
