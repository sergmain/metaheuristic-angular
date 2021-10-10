import { PageableDefault } from '@app/models/PageableDefault';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { ExecContext } from './ExecContext';

export interface ExecContextsResult extends DefaultResponse {
    instances: {
        content: ExecContext[];
    } & PageableDefault;
    sourceCodeId: number;
    sourceCodeUid: string;
    sourceCodeValid: boolean;
    sourceCodeType: string;
}