import {DefaultResponse} from '@app/models/DefaultResponse';
import {ApiUid} from "./ApiUid";

export interface ScenarioUidsForAccount extends DefaultResponse {
    apis: ApiUid[];
}