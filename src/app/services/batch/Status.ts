import { DefaultResponse } from '@app/models/DefaultResponse';

export interface Status extends DefaultResponse {
    batchId: number;
    console: string;
    ok: boolean;
}