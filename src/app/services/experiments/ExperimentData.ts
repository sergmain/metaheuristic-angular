import { ExperimentParamsYaml } from './ExperimentParamsYaml';

export interface ExperimentData {
    id: number;
    version: number;
    execContextId: number;
    code: string;
    name: string;
    description: string;
    createdOn: number;
    numberOfTask: number;
    state: number;


    // TODO: not exist?

    seed: number;
    isAllTaskProduced: boolean;
    isFeatureProduced: boolean;
    hyperParamsAsMap: {
        [name: string]: {
            [name: string]: number
        }
    };
    hyperParams: ExperimentParamsYaml.HyperParam[];
    featureProduced: boolean;
    allTaskProduced: boolean;
}