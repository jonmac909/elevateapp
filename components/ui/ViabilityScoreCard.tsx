'use client';

import { ViabilityScore } from '@/lib/elevate-types';

interface ViabilityScoreCardProps {
  score: ViabilityScore;
  compact?: boolean;
}

export function ViabilityScoreCard({ score, compact = false }: ViabilityScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 71) return 'text-green-500';
    if (value >= 41) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 71) return 'bg-green-500';
    if (value >= 41) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'go':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'caution':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'no-go':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'go':
        return '🟢 STRONG OPPORTUNITY';
      case 'caution':
        return '🟡 PROCEED WITH CAUTION';
      case 'no-go':
        return '🔴 HIGH RISK';
      default:
        return verdict;
    }
  };

  const metrics = [
    { label: 'Market Size', value: score.market_size, icon: '📊' },
    { label: 'Competition', value: score.competition, icon: '⚔️', tooltip: 'Higher = Less competition' },
    { label: 'Demand', value: score.demand, icon: '🔥' },
    { label: 'Monetization', value: score.monetization, icon: '💰' },
    { label: 'Trend', value: score.trend, icon: '📈' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>
          {score.overall}
        </div>
        <div className="text-sm text-[#808191]">/100</div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getVerdictBadge(score.verdict)}`}>
          {score.verdict.toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-sm font-semibold text-[#808191] uppercase tracking-wider mb-3">
          Market Viability Score
        </h3>
        
        {/* Big Score Circle */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E4E4E4"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={score.overall >= 71 ? '#22C55E' : score.overall >= 41 ? '#EAB308' : '#EF4444'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score.overall / 100) * 352} 352`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
            </span>
            <span className="text-sm text-[#808191]">/100</span>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="mt-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getVerdictBadge(score.verdict)}`}>
            {getVerdictLabel(score.verdict)}
          </span>
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3">
            <span className="text-lg">{metric.icon}</span>
            <span className="text-sm text-[#808191] w-28">{metric.label}</span>
            <div className="flex-1 h-2 bg-[#E4E4E4] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getScoreBgColor(metric.value)}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
            <span className={`text-sm font-semibold w-10 text-right ${getScoreColor(metric.value)}`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Verdict Reasoning */}
      {score.verdict_reasoning && (
        <div className="mt-6 p-4 bg-[#F7F8FA] rounded-lg">
          <p className="text-sm text-[#11142D]">{score.verdict_reasoning}</p>
        </div>
      )}
    </div>
  );
}

// Mini version for idea cards
export function ViabilityScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const getColor = () => {
    if (score >= 71) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 41) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getEmoji = () => {
    if (score >= 71) return '🟢';
    if (score >= 41) return '🟡';
    return '🔴';
  };

  if (size === 'sm') {
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getColor()}`}>
        {score}/100
      </span>
    );
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getColor()} flex items-center gap-1`}>
      {getEmoji()} {score}/100
    </span>
  );
}
