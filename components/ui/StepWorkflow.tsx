'use client';

import { useState } from 'react';
import StatusBadge from './StatusBadge';

export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'in_progress' | 'generating' | 'not_started';
  content?: React.ReactNode;
}

interface StepWorkflowProps {
  steps: WorkflowStep[];
  onStepClick?: (step: WorkflowStep) => void;
  onContinue?: () => void;
  onSkip?: () => void;
}

export default function StepWorkflow({ steps, onStepClick, onContinue, onSkip }: StepWorkflowProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set([steps[0]?.id]));

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const currentStepIndex = steps.findIndex(
    (s) => s.status === 'in_progress' || s.status === 'generating' || s.status === 'not_started'
  );

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isExpanded = expandedSteps.has(step.id);
        const stepNumber = index + 1;

        return (
          <div
            key={step.id}
            className="bg-white rounded-xl border border-[#E4E4E4] overflow-hidden"
          >
            <button
              onClick={() => {
                toggleStep(step.id);
                onStepClick?.(step);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : step.status === 'in_progress' || step.status === 'generating'
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#11142D]">Step {stepNumber}</span>
                    <span className="text-[#808191]">•</span>
                    <StatusBadge status={step.status} size="sm" />
                  </div>
                  <p className="text-sm text-[#808191] mt-0.5">{step.title}</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-[#808191] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-0 border-t border-[#E4E4E4]">
                {step.description && (
                  <p className="text-sm text-[#808191] mt-4 mb-4">{step.description}</p>
                )}
                {step.content && <div className="mt-4">{step.content}</div>}
                
                {step.status === 'not_started' && (
                  <button
                    onClick={() => onStepClick?.(step)}
                    className="mt-4 px-4 py-2 bg-[#7C3AED] text-white rounded-xl font-medium hover:bg-[#6D28D9] transition-colors"
                  >
                    Get Started
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-6 py-2.5 border border-[#E4E4E4] rounded-xl font-medium text-[#808191] hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
        )}
        {onContinue && (
          <button
            onClick={onContinue}
            disabled={currentStepIndex === -1}
            className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-xl font-medium hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
