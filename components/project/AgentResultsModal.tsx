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
            
            // Landing page generator — render full HTML in iframe, or fall back to structured preview
            if (agentResult.type === 'landing_page_generator') {
              // Check if output is full HTML
              const htmlContent = typeof output === 'string' ? output : (output?.text as string);
              if (htmlContent && htmlContent.includes('<!DOCTYPE') || htmlContent?.includes('<html')) {
                return (
                  <div className="bg-white">
                    <iframe
                      srcDoc={htmlContent}
                      className="w-full border-0 rounded-xl"
                      style={{ height: '70vh' }}
                      title="Landing Page Preview"
                      sandbox="allow-scripts"
                    />
                    <p className="text-xs text-[#808191] text-center mt-4">
                      Full HTML landing page saved to your project.
                    </p>
                  </div>
                );
              }

              // Fallback: structured JSON preview (legacy format)
              if (!output?.hero) {
                return (
                  <pre className="text-sm bg-[#F7F8FA] p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                );
              }
              const lp = output as {
                hero?: { headline?: string; subheadline?: string; cta_button_text?: string };
                problem_agitation?: { section_headline?: string; body?: string[] };
                solution_introduction?: { section_headline?: string; body?: string[] };
                features?: { section_headline?: string; features_list?: { headline?: string; description?: string }[] };
                social_proof?: { section_headline?: string; testimonials?: { name?: string; quote?: string; result?: string }[] };
                pricing?: { plans?: { name?: string; price?: string; features?: string[]; highlighted?: boolean }[] };
                faq?: { questions?: { question?: string; answer?: string }[] };
                final_cta?: { headline?: string; subheadline?: string; cta_button_text?: string };
              };
              return (
                <div className="bg-white">
                  {/* Hero Section */}
                  {lp.hero && (
                    <div className="relative overflow-hidden rounded-xl mb-8">
                      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] text-white px-10 py-16 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight tracking-tight">
                          {lp.hero.headline}
                        </h1>
                        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                          {lp.hero.subheadline}
                        </p>
                        <button className="bg-[#47A8DF] hover:bg-[#3B96C9] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg shadow-[#47A8DF]/30 transition-all">
                          {lp.hero.cta_button_text || 'Get Started'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Problem Section */}
                  {lp.problem_agitation && (
                    <div className="mb-8 px-6">
                      <h2 className="text-2xl font-bold text-[#11142D] mb-4">
                        {lp.problem_agitation.section_headline}
                      </h2>
                      <div className="space-y-3">
                        {lp.problem_agitation.body?.map((p, i) => (
                          <p key={i} className="text-[#4B5563] leading-relaxed text-base">{p}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solution Section */}
                  {lp.solution_introduction && (
                    <div className="mb-8 bg-[#F0F9FF] rounded-xl p-8">
                      <h2 className="text-2xl font-bold text-[#11142D] mb-4">
                        {lp.solution_introduction.section_headline}
                      </h2>
                      <div className="space-y-3">
                        {lp.solution_introduction.body?.map((p, i) => (
                          <p key={i} className="text-[#4B5563] leading-relaxed text-base">{p}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features Section */}
                  {lp.features && (
                    <div className="mb-8 px-6">
                      <h2 className="text-2xl font-bold text-[#11142D] mb-6 text-center">
                        {lp.features.section_headline}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {lp.features.features_list?.map((f, i) => (
                          <div key={i} className="flex gap-4 p-5 bg-[#F9FAFB] rounded-xl">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#47A8DF]/10 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-[#47A8DF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#11142D] mb-1">{f.headline}</h3>
                              <p className="text-sm text-[#6B7280] leading-relaxed">{f.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Proof */}
                  {lp.social_proof?.testimonials && lp.social_proof.testimonials.length > 0 && (
                    <div className="mb-8 px-6">
                      <h2 className="text-2xl font-bold text-[#11142D] mb-6 text-center">
                        {lp.social_proof.section_headline || 'What People Are Saying'}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {lp.social_proof.testimonials.map((t, i) => (
                          <div key={i} className="p-5 border border-[#E5E7EB] rounded-xl">
                            <p className="text-[#4B5563] italic mb-3">&ldquo;{t.quote}&rdquo;</p>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#47A8DF]/20 rounded-full flex items-center justify-center text-sm font-bold text-[#47A8DF]">
                                {t.name?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-[#11142D]">{t.name}</p>
                                {t.result && <p className="text-xs text-[#47A8DF]">{t.result}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Section */}
                  {lp.pricing?.plans && (
                    <div className="mb-8 px-6">
                      <h2 className="text-2xl font-bold text-[#11142D] mb-6 text-center">Pricing</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {lp.pricing.plans.map((plan, i) => {
                          const isHighlighted = plan.highlighted || i === 1;
                          return (
                            <div 
                              key={i} 
                              className={`p-6 rounded-xl text-center ${
                                isHighlighted 
                                  ? 'bg-[#0f172a] text-white ring-2 ring-[#47A8DF] scale-105' 
                                  : 'border border-[#E5E7EB]'
                              }`}
                            >
                              <h3 className={`font-semibold text-lg mb-2 ${isHighlighted ? 'text-white' : 'text-[#11142D]'}`}>
                                {plan.name}
                              </h3>
                              <p className={`text-3xl font-extrabold mb-4 ${isHighlighted ? 'text-[#47A8DF]' : 'text-[#11142D]'}`}>
                                {plan.price}
                              </p>
                              <ul className={`text-sm space-y-2 mb-6 ${isHighlighted ? 'text-white/80' : 'text-[#6B7280]'}`}>
                                {plan.features?.map((f, j) => (
                                  <li key={j} className="flex items-center gap-2">
                                    <svg className={`w-4 h-4 flex-shrink-0 ${isHighlighted ? 'text-[#47A8DF]' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {f}
                                  </li>
                                ))}
                              </ul>
                              <button className={`w-full py-2.5 rounded-lg font-semibold text-sm ${
                                isHighlighted 
                                  ? 'bg-[#47A8DF] text-white' 
                                  : 'border border-[#47A8DF] text-[#47A8DF]'
                              }`}>
                                Get Started
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* FAQ */}
                  {lp.faq?.questions && lp.faq.questions.length > 0 && (
                    <div className="mb-8 px-6">
                      <h2 className="text-2xl font-bold text-[#11142D] mb-6 text-center">FAQ</h2>
                      <div className="space-y-3 max-w-2xl mx-auto">
                        {lp.faq.questions.map((q, i) => (
                          <div key={i} className="p-4 bg-[#F9FAFB] rounded-xl">
                            <h3 className="font-semibold text-[#11142D] mb-1">{q.question}</h3>
                            <p className="text-sm text-[#6B7280]">{q.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Final CTA */}
                  {lp.final_cta && (
                    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] text-white px-10 py-12 rounded-xl text-center">
                      <h2 className="text-2xl font-bold mb-3">{lp.final_cta.headline}</h2>
                      <p className="text-white/80 mb-6 max-w-xl mx-auto">{lp.final_cta.subheadline}</p>
                      <button className="bg-[#47A8DF] hover:bg-[#3B96C9] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg shadow-[#47A8DF]/30">
                        {lp.final_cta.cta_button_text || 'Get Started Now'}
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-[#808191] text-center mt-6">
                    This is a preview. Full landing page saved to your project.
                  </p>
                </div>
              );
            }
            
            // Fallback for other JSON
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
