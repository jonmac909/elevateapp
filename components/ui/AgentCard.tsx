'use client';

interface AgentCardProps {
  icon: string;
  title: string;
  description: string;
  version?: string;
  badge?: 'popular' | 'beta' | 'updated' | 'new';
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  onUse?: () => void;
}

const badgeStyles = {
  popular: 'bg-purple-100 text-purple-700',
  beta: 'bg-blue-100 text-blue-700',
  updated: 'bg-green-100 text-green-700',
  new: 'bg-orange-100 text-orange-700',
};

export default function AgentCard({
  icon,
  title,
  description,
  version,
  badge,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  onUse,
}: AgentCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-[#E4E4E4] p-5 hover:border-[#7C3AED] hover:shadow-lg transition-all group cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          {version && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">
              {version}
            </span>
          )}
          {badge && (
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${badgeStyles[badge]}`}>
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.();
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-[#11142D] mb-1 group-hover:text-[#7C3AED] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[#808191] line-clamp-2 mb-4">{description}</p>

      {/* Action */}
      {onUse && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUse();
          }}
          className="w-full px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-sm font-medium hover:bg-[#6D28D9] transition-colors"
        >
          Use Agent
        </button>
      )}
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E4E4] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded" />
          <div className="w-12 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded" />
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="h-9 bg-gray-200 rounded-xl" />
    </div>
  );
}
