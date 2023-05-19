import {NodeMode} from '@app/modules/scenario/scenario-details/scenario-details.component';

export class SimpleScenarioStep {
    nodeId: string;
    scenarioId: number;
    uuid: string;
    parentUuid: string;
    apiId: number;
    apiCode: string;
    name: string;
    prompt: string;
    r: string;
    resultCode: string;
    isNew: boolean;
    functionCode: string;
    mode: NodeMode;

    steps: SimpleScenarioStep[];
}