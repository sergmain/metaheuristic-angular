import { DefaultResponse } from '@app/models/DefaultResponse';
import { SourceCodeType } from '@app/enums/SourceCodeType';

export interface VariableInfo {
    id: number;
    // name
    nm: string;
    // context EnumsApi.VariableContext
    ctx: string;
    // inited
    i: boolean;
    // defines: does this variable equal to null?
    // boolean nullified
    n: boolean;
    // ext
    e: string;
}

export interface StateCell {
    empty: boolean;
    taskId: number;
    state: string;
    context: string;
    fromCache: boolean;

    outs: VariableInfo[];
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
