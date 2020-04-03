export interface ExecContext {
    id: number;
    version: number;
    sourceCodeId: number;
    createdOn: number;
    completedOn: number;
    valid: boolean;
    // new
    execState: number;
    params: string;
    // old
    inputResourceParam: string;
    producingOrder: number;
    state: number;
    __deleted: boolean;
}