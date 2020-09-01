export interface ExecContext {
    id: number;
    createdOn: number;
    valid: boolean;
    completedOn: number;
    state: number;
    execState: number;
    // old
    // version: number;
    // sourceCodeId: number;
    // params: string;
    // inputResourceParam: string;
    // producingOrder: number;
    // __deleted: boolean;
}
