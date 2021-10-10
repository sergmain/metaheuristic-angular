import { DefaultResponse } from '@app/models/DefaultResponse';
import { SourceCodeType } from '@app/enums/SourceCodeType';

export interface StateCell {
    empty: boolean;
    taskId: number;
    state: string;
    context: string;
}

export interface ColumnHeader {
    process: string;
    functionCode: string;
}

export interface LineWithState {
    context: string;
    cells: StateCell[];
}

export interface ExecContextStateResult extends DefaultResponse {
    sourceCodeId: number;
    sourceCodeUid: string;
    sourceCodeValid: boolean;
    sourceCodeType: SourceCodeType;
    header: ColumnHeader[];
    lines: LineWithState[];
}
