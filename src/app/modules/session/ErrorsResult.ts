import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleError } from './SimpleError';
import { PageableDefault } from '@app/models/PageableDefault';

export interface ErrorsResult extends DefaultResponse {
    errors: {
        content: SimpleError[];
    } & PageableDefault;
}