import { ExperimentApiData } from '@services/experiments/ExperimentApiData';

export namespace ExperimentResultApiData {
    export interface ExperimentResultData {
        id: number;
        version: number;
        execContextId: number;
        code: string;
        name: string;
        description: string;
        createdOn: number;
        numberOfTask: number;
        hyperParams: ExperimentApiData.HyperParam[];
        state: number;
        execState: string;
    }
}