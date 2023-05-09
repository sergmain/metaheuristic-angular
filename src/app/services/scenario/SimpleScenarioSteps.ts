import {DefaultResponse} from '@app/models/DefaultResponse';
import {SimpleScenarioStep} from "@services/scenario/SimpleScenarioStep";

export interface SimpleScenarioSteps extends DefaultResponse {
    steps: SimpleScenarioStep[];
}
