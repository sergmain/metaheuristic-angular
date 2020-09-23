import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { ConsoleResult } from '../experiment-result/ConsoleResult';
import { ExperimentApiData } from './ExperimentApiData';
import { FeatureProgressConsolePartEntity } from './FeatureProgressConsolePartEntity';
import { HyperParamResult } from './HyperParamResult';
import { MetricsResult } from './MetricsResult';
import { TasksResult } from './TasksResult';



export interface ListOfItems extends PageableDefault {
    content: ExperimentItem[];
}

export interface ExperimentItem extends DefaultResponse {
    experiment: ExperimentApiData.ExperimentData;
}



export namespace response {

    export namespace experiment {

        export interface Info extends DefaultResponse {
            experiment: ExperimentApiData.ExperimentData;
            experimentInfo: ExperimentApiData.ExperimentInfoResult;

        }

        export interface AddCommit extends DefaultResponse { }


        export interface DeleteByTypeCommit extends DefaultResponse { }


        export interface FeaturePlotDataPart {
            x?: (string)[] | null;
            y?: (string)[] | null;
            z?: ((number)[] | null)[] | null;
        }

        export interface FeatureProgress extends DefaultResponse {
            metricsResult: MetricsResult;
            hyperParamResult: HyperParamResult;
            tasksResult: TasksResult;
            experiment: ExperimentApiData.ExperimentData;
            experimentFeature: ExperimentApiData.ExperimentFeature;
            consoleResult: ConsoleResult;
        }

        export interface FeatureProgressConsolePart {
            items: FeatureProgressConsolePartEntity[];

        }

    }
}