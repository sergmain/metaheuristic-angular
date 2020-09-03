import { Atlas } from './Atlas';
import { ConsoleResult } from './ConsoleResult';
import { ExperimentFeature } from './ExperimentFeature';
import { HyperParamResult } from './HyperParamResult';
import { MetricsResult } from './MetricsResult';
import { Tasks } from './Tasks';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { ExperimentApiData } from '../experiments/ExperimentApiData';


export interface ListOfItems extends PageableDefault {
    content: ExperimentItem[];
}

export interface ExperimentItem extends DefaultResponse {
    experiment: ExperimentApiData.ExperimentData;
}

export namespace response {
    export namespace experiments {
        export interface Get extends DefaultResponse {
            items: ListOfItems;
        }
    }


    export namespace experiment {
        export interface Info extends DefaultResponse {
            experiment: ExperimentApiData.ExperimentData;
            experimentInfo: ExperimentApiData.ExperimentInfoResult;
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