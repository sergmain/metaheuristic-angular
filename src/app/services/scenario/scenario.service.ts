import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {SimpleScenarioGroupsResult} from './SimpleScenarioGroupsResult';
import {OperationStatusRest} from "@app/models/OperationStatusRest";
import {generateFormData} from "@app/helpers/generateFormData";
import {ScenariosResult} from "@services/scenario/ScenariosResult";
import {ScenarioUidsForAccount} from "@services/scenario/ScenarioUidsForAccount";
import {SimpleScenarioSteps} from "@services/scenario/SimpleScenarioSteps";
import {MhUtils} from '@services/mh-utils/mh-utils.service';


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

    addScenarioFormCommit(scenarioGroupId: string, name: string, description: string, apiId: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`scenario-add-commit`),
            generateFormData({
                scenarioGroupId, name, description, apiId
            })
        );
    }

    addOrSaveScenarioStepFormCommit(scenarioGroupId: string, scenarioId: string, parentUuidTemp: string,
                                    name: string, prompt: string, apiId: string, resultCode: string,
                                    functionCode: string) {
        const parentUuid = MhUtils.isNull(parentUuidTemp) ? undefined : parentUuidTemp;
        return this.http.post<OperationStatusRest>(
            url(`scenario-step-add-commit`),
            generateFormData({
                scenarioGroupId, scenarioId, parentUuid, name, prompt, apiId, resultCode, functionCode
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

    scenarioStepDeleteCommit(scenarioId: string, uuid: string): Observable<OperationStatusRest> {
        console.log("Delete ScenarioStep #"+ scenarioId+", uuid: " + uuid);
        return this.http.post<OperationStatusRest>(url(`scenario-step-delete-commit`), generateFormData({ scenarioId: scenarioId, uuid: uuid }));
    }

    scenarioStepRearrangeTable(scenarioId: string, prevUuid: string, currUuid: string): Observable<OperationStatusRest> {
        console.log("scenarioStepRearrangeTable #"+ scenarioId+", prev: " + prevUuid+", curr: " + currUuid);
        return this.http.post<OperationStatusRest>(url(`scenario-step-rearrange`),
            generateFormData({ scenarioId: scenarioId, prev: prevUuid, curr: currUuid }));
    }
}