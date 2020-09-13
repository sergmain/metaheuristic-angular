export interface Batch {
    batch: {
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
    };
    planCode: string;
    execStateStr: string;
    execState: number;
    ok: boolean;
    uploadedFileName: string;
}



