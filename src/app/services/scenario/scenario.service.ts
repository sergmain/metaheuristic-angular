import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {SimpleScenarioGroupsResult} from './SimpleScenarioGroupsResult';
import {OperationStatusRest} from '@app/models/OperationStatusRest';
import {generateFormData} from '@app/helpers/generateFormData';
import {ScenariosResult} from '@services/scenario/ScenariosResult';
import {ScenarioUidsForAccount} from '@services/scenario/ScenarioUidsForAccount';
import {SimpleScenarioSteps} from '@services/scenario/SimpleScenarioSteps';
import {SimpleSourceCodeUid} from '@services/source-codes/SimpleSourceCodeUid';
import {StepEvaluationPrepareResult} from '@services/scenario/StepEvaluationPrepareResult';
import {StepEvaluation} from '@services/scenario/StepEvaluation';
import {StepVariableResult} from '@services/scenario/StepEvaluationResult';

const url = (s: string): string => `${environment.baseUrl}dispatcher/scenario/${s}`;

@Injectable({ providedIn: 'root' })
export class ScenarioService {
    constructor(
        private http: HttpClient
    ) { }

    getScenarioGroups(page: string): Observable<SimpleScenarioGroupsResult> {
        let newUrl = url('scenario-groups')
        console.log('ScenarioService.newUrl: ' + newUrl);
        return this.http.get<SimpleScenarioGroupsResult>(newUrl, {params: {page}});
    }

    scenarioSteps(scenarioGroupId: string, scenarioId: string): Observable<SimpleScenarioSteps> {
        return this.http.get<SimpleScenarioSteps>(url(`scenarios/${scenarioGroupId}/scenario/${scenarioId}/steps`));
    }

    querySourceCodeId(scenarioGroupId: string, scenarioId: string): Observable<SimpleSourceCodeUid> {
        return this.http.get<SimpleSourceCodeUid>(url(`scenarios/${scenarioGroupId}/scenario/${scenarioId}/sourceCodeId`));
    }

    scenarioGroupDeleteCommit(scenarioGroupId: string): Observable<OperationStatusRest> {
        console.log("Delete Scenario Group #"+ scenarioGroupId);
        return this.http.post<OperationStatusRest>(url(`scenario-group-delete-commit`), generateFormData({ scenarioGroupId: scenarioGroupId }));
    }

    scenarios = (page: string, scenarioGroupId: string): Observable<ScenariosResult> =>
        this.http.get<ScenariosResult>(url(`scenarios/${scenarioGroupId}`), { params: { page } })

    addScenarioGroupFormCommit(name: string, description: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`scenario-group-add-commit`),
            generateFormData({
                name, description
            })
        );
    }

    addScenarioFormCommit(scenarioGroupId: string, name: string, description: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`scenario-add-commit`),
            generateFormData({
                scenarioGroupId, name, description
            })
        );
    }

    addOrSaveScenarioStepFormCommit(scenarioGroupId: string, scenarioId: string, uuid:string, parentUuidTemp: string,
                                    name: string, prompt: string, apiId: string, resultCode: string,
                                    functionCode: string, aggregateType:string, cachable:string,
                                    expected: string) {
        // const parentUuid = MhUtils.isNull(parentUuidTemp) ? undefined : parentUuidTemp;
        const parentUuid = parentUuidTemp;
        return this.http.post<OperationStatusRest>(
            url(`scenario-step-add-change-commit`),
            generateFormData({
                scenarioGroupId, scenarioId, uuid, parentUuid, name, prompt, apiId, resultCode, functionCode, expected, aggregateType, cachable
            })
        );
    }

    scenarioDeleteCommit(scenarioId: string): Observable<OperationStatusRest> {
        console.log("Delete Scenario #"+ scenarioId);
        return this.http.post<OperationStatusRest>(url(`scenario-delete-commit`), generateFormData({ scenarioId: scenarioId }));
    }

    runScenario(scenarioGroupId: string, scenarioId: string): Observable<OperationStatusRest> {
        console.log("Run Scenario #"+ scenarioId);
        return this.http.post<OperationStatusRest>(url(`scenario-run`),
            generateFormData({ scenarioGroupId: scenarioGroupId, scenarioId: scenarioId }));
    }

    scenarioAdd(): Observable<ScenarioUidsForAccount> {
        return this.http.get<ScenarioUidsForAccount>(url(`scenario-add`));
    }

    scenarioStepAdd(): Observable<ScenarioUidsForAccount> {
        return this.http.get<ScenarioUidsForAccount>(url(`scenario-step-add`));
    }

    prepareStepForEvaluation(scenarioId: string, uuid: string): Observable<StepEvaluationPrepareResult> {
        return this.http.get<StepEvaluationPrepareResult>(url(`scenario-step-evaluation-prepare/${scenarioId}/${uuid}`));
    }

    scenarioStepDeleteCommit(scenarioId: string, uuid: string): Observable<OperationStatusRest> {
        console.log("Delete ScenarioStep #"+ scenarioId+", uuid: " + uuid);
        return this.http.post<OperationStatusRest>(url(`scenario-step-delete-commit`), generateFormData({ scenarioId: scenarioId, uuid: uuid }));
    }

    scenarioStepRearrangeTable(scenarioId: string, prevUuid: string, currUuid: string): Observable<OperationStatusRest> {
        console.log("scenarioStepRearrangeTable #"+ scenarioId+", prev: " + prevUuid+", curr: " + currUuid);
        return this.http.post<OperationStatusRest>(url(`scenario-step-rearrange`),
            generateFormData({ scenarioId: scenarioId, prev: prevUuid, curr: currUuid }));
    }

    copyScenario(scenarioGroupId: string, scenarioId: string): Observable<OperationStatusRest> {
        console.log("Run Scenario #"+ scenarioId);
        return this.http.post<OperationStatusRest>(url(`scenario-copy`),
            generateFormData({ scenarioGroupId: scenarioGroupId, scenarioId: scenarioId }));

    }

    updateScenarioInfoFormCommit(scenarioGroupId: string, scenarioId: string, name: string, description: string) {
        return this.http.post<OperationStatusRest>(
            url(`scenario-update-info-commit`),
            generateFormData({
                scenarioGroupId, scenarioId, name, description
            })
        );
    }

    runStepEvaluation(scenarioId: string, se: StepEvaluation) {
        console.log("runStepEvaluation Scenario #"+ scenarioId+", uuid: " + se.uuid);
        let stepEvaluation = JSON.stringify(se);
        return this.http.post<StepVariableResult>(url(`scenario-step-evaluation-run/${scenarioId}/${se.uuid}`), generateFormData({ stepEvaluation: stepEvaluation }));
    }
}