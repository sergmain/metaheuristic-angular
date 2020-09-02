import { DefaultResponse } from '../../models/DefaultResponse';
import { Pageable } from '../../models/Pageable';
import { Sort } from '../../models/Sort';
import { ExecContext } from './ExecContext';

export interface ExecContextsResult extends DefaultResponse {
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
    sourceCodeId: number;
    sourceCodeUid: string;
    sourceCodeValid: boolean;
    sourceCodeType: string;
}