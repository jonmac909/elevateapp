export function AgentOverlay({ 
  agentRunning, 
  agentProgress 
}: { 
  agentRunning: string | null;
  agentProgress: { step: string; percent: number } | null;
}) {
  if (!agentRunning) return null;

  const isComplete = agentProgress?.percent === 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 text-center max-w-md w-full mx-4">
        {isComplete ? (
          <div className="size-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="size-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="size-12 border-4 border-[#47A8DF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        )}
        <h3 className="text-lg font-semibold text-[#11142D] mb-2">
          {isComplete ? 'Done!' : `Running ${agentRunning.replace(/_/g, ' ')}`}
        </h3>
        {agentProgress && !isComplete && (
          <p className="text-sm text-[#808191]">{agentProgress.step}</p>
        )}
        {!isComplete && (
          <div className="w-full bg-[#E4E4E4] rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-[#47A8DF] h-full rounded-full animate-pulse" style={{ width: '100%', opacity: 0.6 }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
