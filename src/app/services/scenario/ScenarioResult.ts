import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleScenario } from './SimpleScenario';

export interface ScenarioResult extends DefaultResponse {
    scenario: SimpleScenario;
}