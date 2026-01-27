import { Project, LAUNCH_DAY_THEMES } from '@/lib/elevate-types';

export function LaunchTab({ 
  project, 
  onRunAgent 
}: { 
  project: Project; 
  onRunAgent: (type: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Launch Command Center</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">📄</div>
          <h4 className="font-semibold text-[#11142D] mb-1">Landing Page Generator</h4>
          <p className="text-sm text-[#808191] mb-3">Generate a complete landing page with 13 blocks</p>
          <button
            onClick={() => onRunAgent('landing_page_generator')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Generate Page
          </button>
        </div>

        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">📅</div>
          <h4 className="font-semibold text-[#11142D] mb-1">7-Day Launch Sequence</h4>
          <p className="text-sm text-[#808191] mb-3">Generate daily content for your launch</p>
          <button
            onClick={() => onRunAgent('launch_sequence_generator')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Generate Sequence
          </button>
        </div>

        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">💰</div>
          <h4 className="font-semibold text-[#11142D] mb-1">Offer Builder</h4>
          <p className="text-sm text-[#808191] mb-3">Create your pricing and bonus stack</p>
          <button
            onClick={() => onRunAgent('offer_builder')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Build Offer
          </button>
        </div>
      </div>

      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
        <h4 className="font-semibold text-orange-900 mb-3">7-Day Launch Calendar</h4>
        <div className="grid grid-cols-7 gap-2">
          {LAUNCH_DAY_THEMES.map(({ day, theme, description }) => (
            <div key={day} className="p-2 bg-white rounded-lg text-center">
              <div className="text-xs text-orange-600 font-medium">Day {day}</div>
              <div className="text-sm font-semibold text-[#11142D]">{theme}</div>
              <div className="text-[10px] text-[#808191] mt-1">{description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
