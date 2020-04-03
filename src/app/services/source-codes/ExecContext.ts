export interface ExecContext {
    id: number;
    version: number;
    sourceCodeId: number;
    createdOn: number;
    completedOn: number;
    inputResourceParam: string;
    producingOrder: number;
    valid: boolean;
    state: number;
    __deleted:boolean;
}