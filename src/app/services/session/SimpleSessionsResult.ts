import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { SimpleSession } from "./SimpleSession";

export interface SimpleSessionsResult extends DefaultResponse {
    sessions: {
        content: SimpleSession[];
    } & PageableDefault;
}
