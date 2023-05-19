import {DefaultResponse} from '@app/models/DefaultResponse';
import {SimpleScenarioStep} from "@services/scenario/SimpleScenarioStep";
import {SimpleScenarioInfo} from '@services/scenario/SimpleScenarioInfo';

export interface SimpleScenarioSteps extends DefaultResponse {
    scenarioInfo: SimpleScenarioInfo;
    steps: SimpleScenarioStep[];
}
