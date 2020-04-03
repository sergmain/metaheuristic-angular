import { ExperimentParamsYaml } from "./ExperimentParamsYaml";
import { DefaultResponse } from "@src/app/models/DefaultResponse";
import { SimpleSelectOption } from "@src/app/models/SimpleSelectOption";
import { ExecContextState } from "@src/app/enums/ExecContextState";
import { ExecContext } from "../source-codes/ExecContext";

export namespace ExperimentApiData {
    export interface ExperimentData {
        id: number;
        version: number;
        execContextId: number;
        code: string;
        name: string;
        description: string;
        seed: number;
        isAllTaskProduced: boolean;
        isFeatureProduced: boolean;
        createdOn: number;
        numberOfTask: number;
        hyperParamsAsMap: {
            [name: string]: {
                [name: string]: number
            }
        }
        hyperParams: ExperimentParamsYaml.HyperParam[]
        // TODO: not exist?
        featureProduced: boolean;
        allTaskProduced: boolean;
    }

    export interface NewExperimentData {
        code: string;
        name: string;
        description: string;
        seed: number;
    }

    export interface ExperimentInfoResult {
        allDatasetOptions: SimpleSelectOption[];
        features: ExperimentFeatureData[];
        execContext: ExecContext;
        execContextState: ExecContextState;

    }
    export interface ExperimentFeatureData {
        id: number;
        version: number;
        variables: string;
        checksumIdCodes: string;
        execStatus: number;
        execStatusAsString: string;
        experimentId: number;
        maxValue: number;
    }

    export interface ExperimentsEditResult extends DefaultResponse {
        hyperParams: HyperParamsResult;
        simpleExperiment: SimpleExperiment;
        functionResult: FunctionResult;
    }

    export interface SimpleExperiment {
        name: string;
        description: string;
        code: string;
        seed: number;
        id: number;
    }

    export interface FunctionResult {
        selectOptions: SimpleSelectOption[];
        functions: ExperimentFunctionResult[];
    }

    export interface ExperimentFunctionResult {
        id: number;
        version: number;
        functionCode: string;
        type: string;
        experimentId: number;
    }

    export interface HyperParamsResult {
        items: HyperParamData[]
    }

    export interface HyperParamData {
        key: string;
        values: string;
        variants: string;
    }
}