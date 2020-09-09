import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SourceCodeUid } from './SourceCodeUid';

export interface SourceCodeUidsForCompany extends DefaultResponse {
    items: SourceCodeUid[];
}