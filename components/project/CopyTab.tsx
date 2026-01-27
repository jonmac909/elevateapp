import { Project } from '@/lib/elevate-types';

export function CopyTab({ 
  project, 
  onRunAgent, 
  agentRunning 
}: { 
  project: Project; 
  onRunAgent: (type: string) => void; 
  agentRunning?: string | null;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Copy Generators</h3>
      <p className="text-[#808191]">Generate all your marketing copy with AI.</p>

      <div className="grid grid-cols-3 gap-4">
        {[
          { type: 'vsl_writer', icon: '🎬', name: 'VSL Script', desc: 'Full video sales letter script' },
          { type: 'email_generator', icon: '📧', name: 'Email Sequences', desc: 'Welcome + launch emails' },
          { type: 'ad_copy_generator', icon: '📱', name: 'Ad Copy', desc: 'Facebook & Instagram ads' },
          { type: 'headline_generator', icon: '📝', name: 'Headlines', desc: '20 headline variations' },
          { type: 'objection_handler', icon: '🛡️', name: 'Objection Handlers', desc: 'FAQ and rebuttals' },
          { type: 'case_study_generator', icon: '⭐', name: 'Case Studies', desc: 'Turn results into stories' },
        ].map((agent) => (
          <div key={agent.type} className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
            <div className="text-2xl mb-2">{agent.icon}</div>
            <h4 className="font-semibold text-[#11142D] mb-1">{agent.name}</h4>
            <p className="text-sm text-[#808191] mb-3">{agent.desc}</p>
            <button
              onClick={() => onRunAgent(agent.type)}
              className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
            >
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
