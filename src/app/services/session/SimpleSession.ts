export interface SimpleSession {
    sessionId: number;
    startedOn: number;
    finishedOn?: number;
    sessionStatus: string;
    safe?: string;
    normal: number;
    fail: number;
    error: number;
    providerCode: string;
    apiInfo: string;
    evaluationId: number;
    chapters: string;
}