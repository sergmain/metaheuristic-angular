import { DefaultListOfItems } from "./DefaultListOfItems";
import { DefaultResponse } from "./DefaultResponse";

export namespace DefaultItemsResponse {
    export interface Response extends DefaultResponse {
        items: DefaultListOfItems;
    }
}