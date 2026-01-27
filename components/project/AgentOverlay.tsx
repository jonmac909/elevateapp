export function AgentOverlay({ 
  agentRunning, 
  agentProgress 
}: { 
  agentRunning: string | null;
  agentProgress: { step: string; percent: number } | null;
}) {
  if (!agentRunning) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 text-center max-w-md w-full mx-4">
        <div className="size-12 border-4 border-[#47A8DF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-[#11142D] mb-2">Running {agentRunning.replace(/_/g, ' ')}</h3>
        {agentProgress && (
          <>
            <p className="text-sm text-[#808191] mb-3">{agentProgress.step}</p>
            <div className="w-full bg-[#E4E4E4] rounded-full h-2 mb-2">
              <div 
                className="bg-[#47A8DF] h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentProgress.percent}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#808191]">{agentProgress.percent}% complete</p>
          </>
        )}
      </div>
    </div>
  );
}
