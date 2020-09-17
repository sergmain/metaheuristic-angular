import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SourceCode } from './SourceCode';

export interface SourceCodesForCompany extends DefaultResponse {
    items: SourceCode[];
}