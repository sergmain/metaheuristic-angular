import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { SimpleAuth } from "./SimpleAuth";

export interface SimpleAuthsResult extends DefaultResponse {
    auths: {
        content: SimpleAuth[];
    } & PageableDefault;
}
