import { DefaultResponse } from '../../models/DefaultResponse';
import { ExecContext } from './ExecContext';
import { SourceCode } from './SourceCode';

export interface ExecContextResult extends DefaultResponse {
    execContext: ExecContext;
    sourceCode: SourceCode;
}