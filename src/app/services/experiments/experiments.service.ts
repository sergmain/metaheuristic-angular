import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { response } from './response';
import { ExperimentApiData } from './ExperimentApiData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { SimpleExperiment } from './SimpleExperiment';
import { ExecContextState } from '@src/app/enums/ExecContextState';
import { SourceCodeUidsForCompany } from '../source-codes/SourceCodeUidsForCompany';

const url = (s: string): string => `${environment.baseUrl}dispatcher/experiment${s}`;



@Injectable({ providedIn: 'root' })
export class ExperimentsService {

    constructor(private http: HttpClient) { }

    experiment = {
        featurePlotDataPart: (experimentId: string, featureId: string, params: string, paramsAxis: string): Observable<any> =>
            this.http.post(url(`/experiment-feature-plot-data-part/${experimentId}/${featureId}/${params}/${paramsAxis}/part`), {}),

        featureProgressConsolePart: (taskId: string): Observable<response.experiment.FeatureProgressConsolePart> =>
            this.http.post<response.experiment.FeatureProgressConsolePart>(url(`/experiment-feature-progress-console-part/${taskId}`), {}),

        featureProgressPart: (experimentId: string, featureId: string, params: string): Observable<any> =>
            this.http.post(url(`/experiment-feature-progress-part/${experimentId}/${featureId}/${params}/part`), {}),

        featureProgress: (experimentId: string, featureId: string): Observable<any> =>
            this.http.get(url(`/experiment-feature-progress/${experimentId}/${featureId}`)),

        info: (id: string): Observable<response.experiment.Info> =>
            this.http.get<response.experiment.Info>(url(`/experiment-info/${id}`)),

        metadataAddCommit: (experimentId: string, data: any): Observable<any> =>
            this.http.post(url(`/experiment-metadata-add-commit/${experimentId}`), generateFormData(data)),

        metadataEditCommit: (experimentId: string, data: any): Observable<any> =>
            this.http.post(url(`/experiment-metadata-edit-commit/${experimentId}`), generateFormData(data)),

        functionAddCommit: (id: string, code: string): Observable<response.experiment.AddCommit> =>
            this.http.post<response.experiment.AddCommit>(url(`/experiment-function-add-commit/${id}`), generateFormData({ code })),

        metadataDeleteCommit: (experimentId: string | number, key: string | number): Observable<any> =>
            this.http.get(url(`/experiment-metadata-delete-commit/${experimentId}/${key}`)),

        metadataDefaultAddCommit: (experimentId: string | number): Observable<any> =>
            this.http.get(url(`/experiment-metadata-default-add-commit/${experimentId}`)),

        functionDeleteByTypeCommit: (experimentId: string, functionType: string): Observable<response.experiment.DeleteByTypeCommit> =>
            this.http.get<response.experiment.DeleteByTypeCommit>(url(`/experiment-function-delete-by-type-commit/${experimentId}/${functionType}`)),

        uploadFromFile: (file: any): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`/experiment-upload-from-file`), file),

        bindExperimentToPlanWithResource: (experimentCode: string, resourcePoolCode: string): Observable<any> =>
            this.http.post(url(`/bind-experiment-to-plan-with-resource`), { experimentCode, resourcePoolCode }),

        toAtlas: (id: string): Observable<any> =>
            this.http.get(url(`/experiment-to-atlas/${id}`)),
    };


    // @GetMapping("/experiments")
    // public ExperimentApiData.ExperimentsResult getExperiments(@PageableDefault(size = 5) Pageable pageable) {
    //     return experimentTopLevelService.getExperiments(pageable);
    // }
    getExperiments(page: string): Observable<ExperimentApiData.ExperimentsResult> {
        return this.http.get<ExperimentApiData.ExperimentsResult>(url(`/experiments`), { params: { page } });
    }


    // @GetMapping(value = "/experiment/{id}")
    // public ExperimentApiData.ExperimentResult getExperiment(@PathVariable Long id) {
    //     return experimentTopLevelService.getExperimentWithoutProcessing(id);
    // }
    getExperiment(id: string): Observable<ExperimentApiData.ExperimentResult> {
        return this.http.get<ExperimentApiData.ExperimentResult>(url(`/experiment/${id}`));
    }


    // @GetMapping(value = "/experiment-add")
    // public SourceCodeData.SourceCodeUidsForCompany experimentAdd(Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     SourceCodeData.SourceCodeUidsForCompany codes = new SourceCodeData.SourceCodeUidsForCompany();
    //     List<String> uids = dispatcherParamsService.getExperiments();
    //     codes.items = sourceCodeSelectorService.filterSourceCodes(context, uids);
    //     return codes;
    // }
    experimentAdd(): Observable<SourceCodeUidsForCompany> {
        return this.http.get<SourceCodeUidsForCompany>(url(`/experiment-add`));
    }


    // @GetMapping(value = "/experiment-edit/{id}")
    // public ExperimentApiData.ExperimentsEditResult edit(@PathVariable Long id) {
    //     return experimentTopLevelService.editExperiment(id);
    // }
    edit(id: string): Observable<ExperimentApiData.ExperimentsEditResult> {
        return this.http.get<ExperimentApiData.ExperimentsEditResult>(url(`/experiment-edit/${id}`));
    }


    // @PostMapping("/experiment-add-commit")
    // public OperationStatusRest addFormCommit(String sourceCodeUid, String name, String code, String description, Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     return experimentTopLevelService.addExperimentCommit(sourceCodeUid, name, code, description, context);
    // }
    addFormCommit(sourceCodeUid: string, name: string, code: string, description: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`/experiment-add-commit`),
            generateFormData({
                sourceCodeUid, name, code, description
            })
        );
    }


    // @PostMapping("/experiment-edit-commit")
    // public OperationStatusRest editFormCommit(@RequestBody ExperimentApiData.SimpleExperiment simpleExperiment) {
    //     return experimentTopLevelService.editExperimentCommit(simpleExperiment);
    // }
    editFormCommit(simpleExperiment: SimpleExperiment): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/experiment-edit-commit`), simpleExperiment);
    }


    // @PostMapping("/experiment-delete-commit")
    // public OperationStatusRest deleteCommit(Long id) {
    //     return experimentTopLevelService.experimentDeleteCommit(id);
    // }
    deleteCommit(id: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/experiment-delete-commit`), generateFormData({ id }));
    }


    // @PostMapping("/experiment-clone-commit")
    // public OperationStatusRest experimentCloneCommit(Long id, Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     return experimentTopLevelService.experimentCloneCommit(id, context);
    // }
    experimentCloneCommit(id: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/experiment-clone-commit`), generateFormData({ id }));
    }


    // @PostMapping("/experiment-target-state/{state}/{experimentId}")
    // public OperationStatusRest execContextTargetExecState(
    //         @PathVariable Long experimentId, @PathVariable String state, Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     OperationStatusRest operationStatusRest = experimentTopLevelService.changeExecContextState(state, experimentId, context);
    //     return operationStatusRest;
    // }
    execContextTargetExecState(experimentId: string, state: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/experiment-target-state/${state}/${experimentId}`), {});
    }

}