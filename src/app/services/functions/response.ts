import { DefaultResponse } from '@app/models/DefaultResponse';
import { FunctionEntity } from './FunctionEntity';


export namespace response {
    export namespace functions {
        export interface Get extends DefaultResponse {
            functions: FunctionEntity[];
        }
    }
}