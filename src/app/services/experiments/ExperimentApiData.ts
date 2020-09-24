import { ExperimentParamsYaml } from './ExperimentParamsYaml';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleSelectOption } from '@src/app/models/SimpleSelectOption';
import { ExecContextState } from '@src/app/enums/ExecContextState';
import { ExecContext } from '../source-codes/ExecContext';
import { SimpleExperiment } from './SimpleExperiment';
import { PageableDefault } from '@src/app/models/PageableDefault';

export namespace ExperimentApiData {

    export interface ExperimentsResult extends DefaultResponse {
        items: {
            content: ExperimentApiData.ExperimentResult[];
        } & PageableDefault;
    }

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
        sourceCodeId: string;
        sourceCodeUid: string;
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

    export interface ExperimentFeature {
        id: number;
        version: number;
        resourceCodes: string;
        checksumIdCodes: string;
        execStatus: number;
        experimentId: number;
        maxValue: number;
        execStatusAsString: string;
    }

    export interface ExperimentFunctionResult {
        id: number;
        version: number;
        functionCode: string;
        type: string;
        experimentId: number;
    }


    export interface ExperimentInfoResult {
        allDatasetOptions: SimpleSelectOption[];
        features: ExperimentFeatureData[];
        execContext: ExecContext;
        execContextState: ExecContextState;
    }



    export interface ExperimentResult {
        experiment: ExperimentData;
    }


    export interface ExperimentsEditResult extends DefaultResponse {
        hyperParams: HyperParamsResult;
        simpleExperiment: SimpleExperiment;
        functionResult: FunctionResult;
    }


    export interface FunctionResult {
        selectOptions: SimpleSelectOption[];
        functions: ExperimentFunctionResult[];
    }


    export interface HyperParamsResult {
        items: HyperParam[];
    }

    export interface HyperParam {
        key: string;
        values: string;
        variants: number;
    }


}





