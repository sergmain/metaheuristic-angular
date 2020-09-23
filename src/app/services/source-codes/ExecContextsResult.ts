import { PageableDefault } from '@src/app/models/PageableDefault';
import { DefaultResponse } from '../../models/DefaultResponse';
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