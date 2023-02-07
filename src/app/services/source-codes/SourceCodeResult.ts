import { SourceCodeLang } from '@app/enums/SourceCodeLang';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { ValidationResult } from './ValidationResult';

export interface SourceCodeResult extends DefaultResponse {
    id: number;
    version: number;
    uid: string;
    companyId: number;
    createdOn: number;
    locked: boolean;
    valid: boolean;
    source: string;
    lang: SourceCodeLang;
    // status
    validationResult: ValidationResult;
}
