import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { ExperimentApiData } from './ExperimentApiData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { SimpleExperiment } from './SimpleExperiment';
import { SourceCodeUidsForCompany } from '@services/source-codes/SourceCodeUidsForCompany';

const url = (s: string): string => `${environment.baseUrl}dispatcher/experiment${s}`;



@Injectable({ providedIn: 'root' })
export class ExperimentsService {

    constructor(private http: HttpClient) { }

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