'use client';

import { Project, ViabilityScore } from '@/lib/elevate-types';
import { ViabilityScoreCard } from '@/components/ui/ViabilityScoreCard';

export function OverviewTab({ project }: { project: Project }) {
  // Try to extract viability score from research results
  const getViabilityScore = (): ViabilityScore | null => {
    const assets = project.copy_assets?.filter(a => a.name === 'Generated app_idea_validator') || [];
    const asset = assets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (!asset) return null;
    
    try {
      const parsed = JSON.parse(asset.content);
      const text = parsed.text || asset.content;
      const jsonMatch = text.match(/\{[\s\S]*"viability_score"[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return data.viability_score;
      }
    } catch {
      // If parsing fails, return null
    }
    return null;
  };

  const viabilityScore = getViabilityScore();

  const completionItems = [
    { name: 'App', done: !!project.app_dna?.problem_solved },
    { name: 'Brand', done: !!project.brand_dna?.your_story },
    { name: 'Customer', done: !!project.customer_dna?.main_problem },
    { name: 'Research', done: project.copy_assets?.some(a => a.name === 'Generated app_idea_validator') },
    { name: 'Build', done: !!project.app_dna?.deploy_url },
    { name: 'Launch', done: project.progress >= 75 },
    { name: 'Market', done: project.progress >= 100 },
  ];

  const completedCount = completionItems.filter(i => i.done).length;
  const progressPercent = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Viability Score - Prominent if available */}
      {viabilityScore && (
        <div className="mb-6">
          <ViabilityScoreCard score={viabilityScore} />
        </div>
      )}

      {/* Call to action if no viability score */}
      {!viabilityScore && (
        <div className="p-6 bg-gradient-to-br from-[#47A8DF]/10 to-[#3B96C9]/10 rounded-xl border border-[#47A8DF]/20">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🔍</div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#11142D]">Validate Your Idea</h4>
              <p className="text-sm text-[#808191]">Run the App Idea Validator to get a market viability score</p>
            </div>
            <span className="text-sm text-[#47A8DF]">Go to Research tab →</span>
          </div>
        </div>
      )}

      {/* Project Completion */}
      <div>
        <h3 className="text-lg font-semibold text-[#11142D] mb-4">Project Completion</h3>
        <div className="flex items-center gap-4 mb-4">
          {completionItems.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className={`size-5 rounded-full flex items-center justify-center ${
                item.done ? 'bg-green-500' : 'bg-[#E4E4E4]'
              }`}>
                {item.done && (
                  <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${item.done ? 'text-[#11142D]' : 'text-[#808191]'}`}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Status</p>
          <p className="text-lg font-semibold text-[#11142D] capitalize">{project.status}</p>
        </div>
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Progress</p>
          <p className="text-lg font-semibold text-[#11142D]">{progressPercent}%</p>
        </div>
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Created</p>
          <p className="text-lg font-semibold text-[#11142D]">
            {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-[#E4E4E4]">
        <h4 className="text-sm font-semibold text-[#808191] uppercase tracking-wider mb-3">Recommended Next Steps</h4>
        <div className="space-y-2">
          {!project.app_dna?.problem_solved && (
            <div className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-lg">
              <span className="text-lg">📱</span>
              <span className="text-sm text-[#11142D]">Define your app's core problem in the App tab</span>
            </div>
          )}
          {!viabilityScore && (
            <div className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-lg">
              <span className="text-lg">🔍</span>
              <span className="text-sm text-[#11142D]">Run the App Idea Validator in Research tab</span>
            </div>
          )}
          {!project.customer_dna?.main_problem && (
            <div className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-lg">
              <span className="text-lg">👥</span>
              <span className="text-sm text-[#11142D]">Define your target customer in Customer tab</span>
            </div>
          )}
          {viabilityScore && project.app_dna?.problem_solved && project.customer_dna?.main_problem && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-lg">🚀</span>
              <span className="text-sm text-green-700">Ready to build! Head to the Build tab</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
