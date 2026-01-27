'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AgentResultsModal({ 
  agentResult, 
  onClose 
}: { 
  agentResult: { type: string; output: unknown } | null;
  onClose: () => void;
}) {
  if (!agentResult) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E4E4E4] flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#11142D]">
            {agentResult.type.replace(/_/g, ' ')} Results
          </h3>
          <button
            onClick={onClose}
            aria-label="Close results"
            className="p-2 hover:bg-[#F7F8FA] rounded-lg focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          >
            <svg className="size-5 text-[#808191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1">
          {(() => {
            const output = agentResult.output as Record<string, unknown>;
            const text = typeof output === 'string' ? output : (output?.text as string);
            
            // If it's markdown/text content, use ReactMarkdown
            if (text) {
              return (
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
                  {text}
                </ReactMarkdown>
              );
            }
            
            // For landing page generator - render as visual preview
            if (agentResult.type === 'landing_page_generator' && output?.hero) {
              const lp = output as {
                hero?: { headline?: string; subheadline?: string; cta_button_text?: string };
                problem_agitation?: { section_headline?: string; body?: string[] };
                solution_introduction?: { section_headline?: string; body?: string[] };
                features?: { section_headline?: string; features_list?: { headline?: string; description?: string }[] };
                pricing?: { plans?: { name?: string; price?: string; features?: string[] }[] };
              };
              return (
                <div className="space-y-8">
                  {/* Hero */}
                  {lp.hero && (
                    <div className="bg-gradient-to-br from-[#47A8DF] to-[#3B96C9] text-white p-8 rounded-xl text-center">
                      <h1 className="text-2xl font-bold mb-3">{lp.hero.headline}</h1>
                      <p className="text-white/90 mb-4">{lp.hero.subheadline}</p>
                      <button className="bg-white text-[#47A8DF] px-6 py-2 rounded-lg font-semibold">{lp.hero.cta_button_text}</button>
                    </div>
                  )}
                  {/* Problem */}
                  {lp.problem_agitation && (
                    <div className="bg-[#F7F8FA] p-6 rounded-xl">
                      <h2 className="text-lg font-bold text-[#11142D] mb-3">{lp.problem_agitation.section_headline}</h2>
                      {lp.problem_agitation.body?.map((p, i) => <p key={i} className="text-[#808191] mb-2">{p}</p>)}
                    </div>
                  )}
                  {/* Solution */}
                  {lp.solution_introduction && (
                    <div className="p-6 border border-[#E4E4E4] rounded-xl">
                      <h2 className="text-lg font-bold text-[#11142D] mb-3">{lp.solution_introduction.section_headline}</h2>
                      {lp.solution_introduction.body?.map((p, i) => <p key={i} className="text-[#808191] mb-2">{p}</p>)}
                    </div>
                  )}
                  {/* Features */}
                  {lp.features && (
                    <div>
                      <h2 className="text-lg font-bold text-[#11142D] mb-4">{lp.features.section_headline}</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {lp.features.features_list?.map((f, i) => (
                          <div key={i} className="p-4 bg-white border border-[#E4E4E4] rounded-xl">
                            <h3 className="font-semibold text-[#11142D] mb-1">{f.headline}</h3>
                            <p className="text-sm text-[#808191]">{f.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Pricing */}
                  {lp.pricing?.plans && (
                    <div>
                      <h2 className="text-lg font-bold text-[#11142D] mb-4 text-center">Pricing</h2>
                      <div className="grid grid-cols-3 gap-4">
                        {lp.pricing.plans.map((plan, i) => (
                          <div key={i} className="p-4 border border-[#E4E4E4] rounded-xl text-center">
                            <h3 className="font-semibold text-[#11142D]">{plan.name}</h3>
                            <p className="text-2xl font-bold text-[#47A8DF] my-2">{plan.price}</p>
                            <ul className="text-sm text-[#808191] space-y-1">
                              {plan.features?.slice(0, 4).map((f, j) => <li key={j}>✓ {f}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-[#808191] text-center">This is a preview. Full landing page saved to your project.</p>
                </div>
              );
            }
            
            // Fallback for other JSON - show formatted
            return (
              <pre className="text-sm bg-[#F7F8FA] p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                {JSON.stringify(output, null, 2)}
              </pre>
            );
          })()}
        </div>
        <div className="p-4 border-t border-[#E4E4E4]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
