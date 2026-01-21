'use client';

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({ 
  title = 'Loading...', 
  subtitle,
  size = 'md' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative mb-4">
        {/* DNA-style animated icon */}
        <div className={`${sizeClasses[size]} relative`}>
          <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            {/* Outer ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="70 30"
              className="origin-center animate-spin"
              style={{ animationDuration: '3s' }}
            />
            {/* Middle ring */}
            <circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="50 50"
              className="origin-center animate-spin"
              style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            />
            {/* Inner ring */}
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="30 70"
              className="origin-center animate-spin"
              style={{ animationDuration: '1.5s' }}
            />
            {/* Center dot */}
            <circle cx="50" cy="50" r="6" fill="url(#gradient1)" className="animate-pulse" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-[#11142D] mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-[#808191] text-center max-w-sm">{subtitle}</p>
      )}
    </div>
  );
}

export function LoadingSpinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
