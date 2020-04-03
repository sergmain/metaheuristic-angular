import { DefaultResponse } from '@app/models/DefaultResponse';
import { DefaultListOfItems } from '@app/models/DefaultListOfItems';
import { GlobalVariable } from './GlobalVariables';

export namespace response {
    export namespace globalVariables {
        export interface Get extends DefaultResponse {
            items: Resources;
        }
    }
    export namespace globalVariable {

    }
}

export interface Resources extends DefaultListOfItems {
    content: GlobalVariable[];
}
