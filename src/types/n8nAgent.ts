export type N8nAgentRequest = {
    userId?: string;
    prompt: string;
    context?: Record<string, any>;
  };
  
  export type N8nAgentResponse = {
    success: boolean;
    data?: any;
    error?: string;
  };
  