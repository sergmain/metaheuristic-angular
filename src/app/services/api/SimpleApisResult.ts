import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { SimpleApi } from "./SimpleApi";

export interface SimpleApisResult extends DefaultResponse {
    apis: {
        content: SimpleApi[];
    } & PageableDefault;
}
