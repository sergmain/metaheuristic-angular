export interface Batch {
    id: number;
    version: number;
    companyId: number;
    accountId: number;
    sourceCodeId: number;
    execContextId: number;
    createdOn: number;
    execState: number;
    params: string;
    deleted: boolean;
}



