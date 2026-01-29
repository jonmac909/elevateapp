'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project, ViabilityScore, TruthReport } from '@/lib/elevate-types';
import { ViabilityScoreCard } from '@/components/ui/ViabilityScoreCard';

interface AgentRunTiming {
  startTime?: number;
  endTime?: number;
}

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
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [agentTimings, setAgentTimings] = useState<Record<string, AgentRunTiming>>({});
  const [generatingReport, setGeneratingReport] = useState(false);
  
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

  const getViabilityScore = (): ViabilityScore | null => {
    const content = getResearchContent('app_idea_validator');
    if (!content) return null;
    
    try {
      // Try to parse structured JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*"viability_score"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.viability_score;
      }
    } catch {
      // If parsing fails, return null
    }
    return null;
  };

  const getTruthReport = (): TruthReport | null => {
    const content = getResearchContent('truth_report_generator');
    if (!content) return null;
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*"viability"[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If parsing fails, return null
    }
    return null;
  };

  const toggleExpand = (type: string) => {
    setExpanded(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleRunAgent = async (type: string) => {
    setRunningAgent(type);
    setAgentTimings(prev => ({
      ...prev,
      [type]: { startTime: Date.now() }
    }));
    
    try {
      await onRunAgent(type);
    } finally {
      setRunningAgent(null);
      setAgentTimings(prev => ({
        ...prev,
        [type]: { ...prev[type], endTime: Date.now() }
      }));
    }
  };

  const handleGenerateTruthReport = async () => {
    setGeneratingReport(true);
    try {
      await onRunAgent('truth_report_generator');
    } finally {
      setGeneratingReport(false);
    }
  };

  const getElapsedTime = (type: string) => {
    const timing = agentTimings[type];
    if (!timing?.startTime || !timing?.endTime) return null;
    const elapsed = Math.round((timing.endTime - timing.startTime) / 1000);
    return `${elapsed}s`;
  };

  const agents = [
    { 
      type: 'app_idea_validator', 
      icon: '🔍', 
      name: 'App Idea Validator', 
      desc: 'Market viability score with demand, competition, and monetization analysis', 
      btn: 'Run Validator',
      estimatedTime: '~45 seconds'
    },
    { 
      type: 'niche_analyzer', 
      icon: '📊', 
      name: 'Niche Analyzer', 
      desc: 'Discover top pain points, solutions, and market gaps', 
      btn: 'Analyze Niche',
      estimatedTime: '~30 seconds'
    },
    { 
      type: 'competitor_xray', 
      icon: '🎯', 
      name: 'Competitor X-Ray', 
      desc: 'Analyze competitor features, pricing, and exploitable weaknesses', 
      btn: 'X-Ray Competitors',
      estimatedTime: '~45 seconds'
    },
  ];

  const viabilityScore = getViabilityScore();
  const truthReport = getTruthReport();
  const hasAllResearch = agents.every(a => getResearchContent(a.type));

  return (
    <div className="space-y-6">
      {/* Viability Score Card - Prominent Display */}
      {viabilityScore && (
        <div className="mb-8">
          <ViabilityScoreCard score={viabilityScore} />
        </div>
      )}

      {/* Truth Report Section */}
      {truthReport && (
        <div className="mb-8 bg-gradient-to-br from-[#47A8DF]/10 to-[#3B96C9]/10 rounded-xl border border-[#47A8DF]/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#11142D] flex items-center gap-2">
              📋 Truth Report
              <span className="text-xs font-normal text-[#808191]">
                Generated {new Date(truthReport.generated_at || Date.now()).toLocaleDateString()}
              </span>
            </h3>
            <button
              onClick={handleGenerateTruthReport}
              disabled={generatingReport}
              className="text-sm text-[#47A8DF] hover:underline"
            >
              Regenerate
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Market Snapshot */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-[#11142D] mb-2">📊 Market Snapshot</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-[#808191]">Size:</span> {truthReport.market_snapshot?.size}</p>
                <p><span className="text-[#808191]">Growth:</span> {truthReport.market_snapshot?.growth}</p>
                <p><span className="text-[#808191]">Key Players:</span> {truthReport.market_snapshot?.key_players?.join(', ')}</p>
              </div>
            </div>

            {/* Positioning */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-[#11142D] mb-2">🎯 Recommended Positioning</h4>
              <p className="text-sm text-[#11142D]">{truthReport.recommended_positioning}</p>
            </div>

            {/* Pain Points */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-[#11142D] mb-2">🔥 Top Pain Points</h4>
              <ul className="text-sm space-y-1">
                {truthReport.top_pain_points?.slice(0, 5).map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#47A8DF]">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Competitor Weaknesses */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-[#11142D] mb-2">⚔️ Competitor Weaknesses</h4>
              <ul className="text-sm space-y-1">
                {truthReport.competitor_weaknesses?.slice(0, 5).map((weakness, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Generate Truth Report Button */}
      {hasAllResearch && !truthReport && (
        <div className="mb-6 p-4 bg-gradient-to-r from-[#47A8DF]/10 to-[#3B96C9]/10 rounded-xl border border-[#47A8DF]/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#11142D]">📋 Generate Truth Report</h4>
              <p className="text-sm text-[#808191]">Combine all research into a unified executive summary</p>
            </div>
            <button
              onClick={handleGenerateTruthReport}
              disabled={generatingReport}
              className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-semibold hover:bg-[#3B96C9] disabled:opacity-50 flex items-center gap-2"
            >
              {generatingReport ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Truth Report
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Research Agents Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#11142D]">Research Agents</h3>
          <p className="text-[#808191]">Validate your app idea with AI-powered market research</p>
        </div>
        {!hasAllResearch && (
          <div className="text-sm text-[#808191] flex items-center gap-2">
            <span>⚡</span>
            <span>Run all agents to unlock Truth Report</span>
          </div>
        )}
      </div>

      {/* Agent Cards */}
      <div className="space-y-4">
        {agents.map((agent) => {
          const content = getResearchContent(agent.type);
          const isExpanded = expanded[agent.type] ?? false;
          const isRunning = runningAgent === agent.type;
          const elapsed = getElapsedTime(agent.type);
          
          return (
            <div key={agent.type} className="border border-[#E4E4E4] rounded-xl overflow-hidden">
              <div className="p-4 bg-[#F7F8FA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{agent.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[#11142D]">{agent.name}</h4>
                      {content && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          ✓ Complete
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#808191]">{agent.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Timing indicator */}
                  <span className="text-xs text-[#808191]">
                    {isRunning ? (
                      <span className="flex items-center gap-1">
                        <span className="animate-pulse">⏱️</span> Running...
                      </span>
                    ) : elapsed ? (
                      <span>✓ {elapsed}</span>
                    ) : (
                      <span>⚡ {agent.estimatedTime}</span>
                    )}
                  </span>
                  
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
                    onClick={() => handleRunAgent(agent.type)}
                    disabled={isRunning}
                    className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9] disabled:opacity-50 flex items-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Running...
                      </>
                    ) : (
                      content ? 'Re-run' : agent.btn
                    )}
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
