import {DefaultResponse} from '@app/models/DefaultResponse';
import {ApiUid} from "./ApiUid";
import {InternalFunction} from '@services/scenario/InternalFunction';

export interface ScenarioUidsForAccount extends DefaultResponse {
    apis: ApiUid[];
    functions: InternalFunction[];
}