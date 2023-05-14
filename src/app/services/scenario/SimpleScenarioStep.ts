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

    steps: SimpleScenarioStep[];
}