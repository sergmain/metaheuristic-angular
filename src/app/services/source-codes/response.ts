
import { SourceCode } from './SourceCode';
import { ExecContext } from './ExecContext';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { Pageable } from '@src/app/models/Pageable';
import { Sort } from '@src/app/models/Sort';


export namespace response {

    export namespace sourceCodes {
        export interface Get extends DefaultResponse {
            items: {
                content: SourceCode[];
                pageable: Pageable;
                size: number;
                number: number;
                sort: Sort;
                numberOfElements: number;
                first: boolean;
                last: boolean;
                empty: boolean;
            };
        }
        export interface GetArchivedOnly extends sourceCodes.Get { }
    }

    export namespace sourceCode {
        export interface Get extends DefaultResponse {
            sourceCode: SourceCode;
        }
        export interface Update extends DefaultResponse { }
        export interface Validate extends DefaultResponse { }
        export interface Delete extends DefaultResponse { }
        export interface Archive extends DefaultResponse { }
        export interface Add extends DefaultResponse { }
        export interface Edit extends DefaultResponse { }
        export interface Upload extends DefaultResponse { }
    }

    export namespace execContexts {
        export interface Get extends DefaultResponse {
            instances: {
                content: ExecContext[];
                pageable: Pageable;
                size: number;
                number: number;
                sort: Sort;
                numberOfElements: number;
                first: boolean;
                last: boolean;
                empty: boolean;
            };
            currentSourceCodeId: number;
            sourceCodes: SourceCode[];
        }
    }

    export namespace execContext {
        export interface UidExecContextAddCommit extends DefaultResponse {
            execContextId: number;
        }
        export interface AddCommit extends DefaultResponse { }
        export interface Create extends DefaultResponse { }
        export interface Get extends DefaultResponse { }
        export interface DeleteCommit extends DefaultResponse { }
        export interface TargetExecState extends DefaultResponse { }
    }
}