export interface Task {
    id: number;
    version: number;
    params: string;
    processorId ? : number | null;
    assignedOn ? : number | null;
    completedOn ? : number | null;
    isCompleted: boolean;
    metrics ? : string | null;
    order: number;
    execContextId: number;
    execState: number;
    processType: number;
    resultReceived: boolean;
    resultResourceScheduledOn: number;
    completed: boolean;
}