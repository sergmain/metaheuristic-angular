export interface Batch {
    batch: {
        id: number;
        version: number;
        sourceCodeId: number;
        createdOn: number;
        execState: number;
        params: string;
    };
    planCode: string;
    execStateStr: string;
    execState: number;
    ok: boolean;
    uploadedFileName: string;
}
