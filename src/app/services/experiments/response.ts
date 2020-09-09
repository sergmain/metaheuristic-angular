import { ConsoleResult, ExperimentFeature, FeatureProgressConsolePartEntity, HyperParamResult, MetricsResult, TasksResult } from './index';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { ExperimentApiData } from './ExperimentApiData';
import { ExperimentData } from './ExperimentData';


export interface ListOfItems extends PageableDefault {
    content: ExperimentItem[];
}

export interface ExperimentItem extends DefaultResponse {
    experiment: ExperimentData;
}



export namespace response {

    export namespace experiment {
        export interface Get extends DefaultResponse {
            Experiment: ExperimentData;
        }
        export interface Info extends DefaultResponse {
            experiment: ExperimentData;
            experimentInfo: ExperimentApiData.ExperimentInfoResult;

        }

        export interface AddCommit extends DefaultResponse { }


        export interface DeleteByTypeCommit extends DefaultResponse { }

        // export namespace cloneCommit {
        //     export interface Response {

        //     }
        // }
        export interface FeaturePlotDataPart {
            x?: (string)[] | null;
            y?: (string)[] | null;
            z?: ((number)[] | null)[] | null;
        }
        // export namespace featureProgressPart {
        //     export interface Response {

        //     }
        // }
        export interface FeatureProgress extends DefaultResponse {
            metricsResult: MetricsResult;
            hyperParamResult: HyperParamResult;
            tasksResult: TasksResult;
            experiment: ExperimentData;
            experimentFeature: ExperimentFeature;
            consoleResult: ConsoleResult;
        }
        // export namespace featureProgressConsole {
        //     export interface Response {

        //     }
        // }
        export interface FeatureProgressConsolePart {
            items: FeatureProgressConsolePartEntity[];

        }
        // export namespace taskRerun {
        //     export interface Response {

        //     }
        // }
        // export namespace metadataAddCommit {
        //     export interface Response {

        //     }
        // }
        // export namespace metadataEditCommit {
        //     export interface Response {

        //     }
        // }
        // export namespace metadataDeleteCommit {
        //     export interface Response {

        //     }
        // }
        // export namespace metadataDefaultAddCommit {
        //     export interface Response {

        //     }
        // }
    }
}