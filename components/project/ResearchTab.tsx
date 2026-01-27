'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project } from '@/lib/elevate-types';

export function ResearchTab({ 
  project, 
  onRunAgent, 
  expanded, 
  setExpanded 
}: { 
  project: Project; 
  onRunAgent: (type: string) => void;
  expanded: Record<string, boolean>;
  setExpanded: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}) {
  
  const getResearchContent = (agentType: string) => {
    const assets = project.copy_assets?.filter(a => a.name === `Generated ${agentType}`) || [];
    const asset = assets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (!asset) return null;
    try {
      const parsed = JSON.parse(asset.content);
      return parsed.text || asset.content;
    } catch {
      return asset.content;
    }
  };

  const toggleExpand = (type: string) => {
    setExpanded(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const agents = [
    { type: 'app_idea_validator', icon: '🔍', name: 'App Idea Validator', desc: 'Analyze market size, competition, and demand score', btn: 'Run Validator' },
    { type: 'niche_analyzer', icon: '📊', name: 'Niche Analyzer', desc: 'Discover top pain points, solutions, and gaps', btn: 'Analyze Niche' },
    { type: 'competitor_xray', icon: '🎯', name: 'Competitor X-Ray', desc: 'Analyze competitor features, pricing, and weaknesses', btn: 'X-Ray Competitor' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Research Agents</h3>
      <p className="text-[#808191]">Use these AI agents to validate your app idea before building.</p>

      <div className="space-y-4">
        {agents.map((agent) => {
          const content = getResearchContent(agent.type);
          const isExpanded = expanded[agent.type] ?? false;
          return (
            <div key={agent.type} className="border border-[#E4E4E4] rounded-xl overflow-hidden">
              <div className="p-4 bg-[#F7F8FA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{agent.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[#11142D]">{agent.name}</h4>
                    <p className="text-sm text-[#808191]">{agent.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {content && (
                    <button
                      onClick={() => toggleExpand(agent.type)}
                      className="px-3 py-2 text-[#808191] hover:text-[#11142D] hover:bg-white rounded-lg text-sm font-medium flex items-center gap-1"
                    >
                      <svg 
                        className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {isExpanded ? 'Collapse' : 'View Results'}
                    </button>
                  )}
                  <button
                    onClick={() => onRunAgent(agent.type)}
                    className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
                  >
                    {content ? 'Re-run' : agent.btn}
                  </button>
                </div>
              </div>
              {content && isExpanded && (
                <div className="p-4 border-t border-[#E4E4E4] max-h-[600px] overflow-y-auto">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-xl font-bold mt-6 mb-4 text-[#11142D]">{children}</h1>,
                      h2: ({children}) => <h2 className="text-lg font-bold mt-5 mb-3 text-[#11142D]">{children}</h2>,
                      h3: ({children}) => <h3 className="text-base font-bold mt-4 mb-2 text-[#11142D]">{children}</h3>,
                      p: ({children}) => <p className="my-2 text-[#11142D]">{children}</p>,
                      ul: ({children}) => <ul className="list-disc ml-6 my-2">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal ml-6 my-2">{children}</ol>,
                      li: ({children}) => <li className="my-1">{children}</li>,
                      strong: ({children}) => <strong className="font-bold">{children}</strong>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-[#47A8DF] pl-4 my-3 italic text-[#808191]">{children}</blockquote>,
                      hr: () => <hr className="my-4 border-[#E4E4E4]" />,
                      table: ({children}) => <table className="w-full border-collapse my-4 text-sm">{children}</table>,
                      thead: ({children}) => <thead className="bg-[#F7F8FA]">{children}</thead>,
                      th: ({children}) => <th className="border border-[#E4E4E4] px-3 py-2 text-left font-semibold">{children}</th>,
                      td: ({children}) => <td className="border border-[#E4E4E4] px-3 py-2">{children}</td>,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
