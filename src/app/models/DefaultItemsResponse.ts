import { PageableDefault } from './PageableDefault';
import { DefaultResponse } from './DefaultResponse';

export namespace DefaultItemsResponse123 {
    export interface Response extends DefaultResponse {
        items: PageableDefault;
    }
}