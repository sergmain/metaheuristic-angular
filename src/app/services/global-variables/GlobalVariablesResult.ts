import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { GlobalVariable } from './GlobalVariables';

export interface Items extends PageableDefault {
    content: GlobalVariable[];
}

export interface GlobalVariablesResult extends DefaultResponse {
    items: Items;

}

