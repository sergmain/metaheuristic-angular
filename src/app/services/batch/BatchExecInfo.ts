import { Batch } from '@src/app/models/beans/Batch';

export interface BatchExecInfo {
    batch: Batch;
    sourceCodeUid: string;
    execStateStr: string;
    execState: number;
    ok: boolean;
    uploadedFileName: string;
    username: string;
}