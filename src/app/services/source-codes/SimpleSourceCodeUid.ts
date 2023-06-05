import { DefaultResponse } from '@app/models/DefaultResponse';
import { SourceCodeUid } from './SourceCodeUid';

export interface SimpleSourceCodeUid extends DefaultResponse {
    simpleSourceCode: SourceCodeUid;
}