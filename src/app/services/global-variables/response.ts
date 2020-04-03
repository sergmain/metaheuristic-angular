import { DefaultResponse } from '@app/models/DefaultResponse';
import { DefaultListOfItems } from '@app/models/DefaultListOfItems';
import { GlobalVariable } from './GlobalVariables';

export namespace response {
    export namespace globalVariables {
        export interface Get extends DefaultResponse {
            items: GlobalVariables;
        }
    }
    export namespace globalVariable {
        export interface globalVariableDeleteCommit extends DefaultResponse { }
        export interface resourceUploadFromFile extends DefaultResponse { }
        export interface resourceInExternalStorage extends DefaultResponse { }
    }
}

export interface GlobalVariables extends DefaultListOfItems {
    content: GlobalVariable[];
}
