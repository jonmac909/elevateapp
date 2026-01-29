/**
 * Shared agent prompt definitions and model routing.
 * Used by both the sync /api/elevate/agents/run and async /api/elevate/agents/start routes.
 */
export declare function getAgentPrompt(agentType: string, context: Record<string, unknown>): string | null;
export declare function getAgentModel(agentType: string): string;
/** Get model name for Clawdbot gateway (alias format) */
export declare function getAgentModelGateway(agentType: string): string;
export declare function isValidAgentType(agentType: string): boolean;
