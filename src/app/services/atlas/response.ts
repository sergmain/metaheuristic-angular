import { ExperimentInfo } from '../experiments/ExperimentInfo';
import { Atlas } from './Atlas';
import { ConsoleResult } from './ConsoleResult';
import { Experiment } from './Experiment';
import { ExperimentFeature } from './ExperimentFeature';
import { HyperParamResult } from './HyperParamResult';
import { MetricsResult } from './MetricsResult';
import { Tasks } from './Tasks';
import { DefaultListOfItems } from '@src/app/models/DefaultListOfItems';
import { DefaultResponse } from '@src/app/models/DefaultResponse';


export interface ListOfItems extends DefaultListOfItems {
    content: ExperimentItem[];
}

export interface ExperimentItem extends DefaultResponse {
    experiment: Experiment;
}

export namespace response {
    export namespace experiments {
        export interface Get extends DefaultResponse {
            items: ListOfItems;
        }
    }


    export namespace experiment {
        export interface Info extends DefaultResponse {
            experiment: Experiment;
            experimentInfo: ExperimentInfo;
            atlas: Atlas;
        }

        export interface FeatureProgress extends DefaultResponse {
            consoleResult: ConsoleResult;
            experimentFeature: ExperimentFeature;
            hyperParamResult: HyperParamResult;
            metricsResult: MetricsResult;
            tasks: Tasks;
        }

        export interface FeatureProgressConsolePart extends DefaultResponse {
            console: string;
            exitCode: number;
            isOk: boolean;
            ok: boolean;
        }

        export interface FeatureProgressPart extends DefaultResponse {
            consoleResult: ConsoleResult;
            experimentFeature: ExperimentFeature;
            hyperParamResult: HyperParamResult;
            metricsResult: MetricsResult;
            tasks: Tasks;
        }

        export interface FeaturePlotDataPart {
            x?: (string)[] | null;
            y?: (string)[] | null;
            z?: ((number)[] | null)[] | null;
        }

        export interface UploadFromFile { }

        export interface DeleteCommit { }

    }
}