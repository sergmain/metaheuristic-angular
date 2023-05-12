export interface SimpleScenarioStep {
    scenarioId: number;
    uuid: string;
    parentUuid: string;
    apiId: number;
    apiCode: string;
    name: string;
    prompt: string;
    r: string;
    resultCode: string;

    SimpleScenarioStep: SimpleScenarioStep[];
}