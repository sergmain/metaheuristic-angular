import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { SimpleKb } from "./SimpleKb";

export interface SimpleKbsResult extends DefaultResponse {
    kbs: {
        content: SimpleKb[];
    } & PageableDefault;
}
