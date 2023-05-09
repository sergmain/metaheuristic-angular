import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {SimpleEvaluationsResult} from './SimpleEvaluationsResult';
import {OperationStatusRest} from "@app/models/OperationStatusRest";
import {generateFormData} from "@app/helpers/generateFormData";
import {EvaluationUidsForCompany} from "./EvaluationUidsForCompany";


const url = (s: string): string => `${environment.baseUrl}dispatcher/evaluation/${s}`;

@Injectable({ providedIn: 'root' })
export class EvaluationService {
    constructor(
        private http: HttpClient
    ) { }

    getEvaluations(page: string): Observable<SimpleEvaluationsResult> {
        let newUrl = url('evaluations')
        console.log('Evaluation.newUrl: ' + newUrl);
        return this.http.get<SimpleEvaluationsResult>(newUrl, {params: {page}});
    }

    evaluationDeleteCommit(evaluationId: string): Observable<OperationStatusRest> {
        console.log("Delete evaluation #"+ evaluationId);
        return this.http.post<OperationStatusRest>(url(`evaluation-delete-commit`), generateFormData({ evaluationId: evaluationId }));
    }

    evaluationAdd(): Observable<EvaluationUidsForCompany> {
        return this.http.get<EvaluationUidsForCompany>(url(`evaluation-add`));
    }

    addFormCommit(code:string, apiId: string, chapterIds: string[]): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`evaluation-add-commit`),
            generateFormData({
                code, apiId, chapterIds: chapterIds
            })
        );
    }

    runEvaluation(evaluationId: string) {
        console.log("Run evaluation #"+ evaluationId);
        return this.http.post<OperationStatusRest>(url(`run-evaluation`), generateFormData({ id: evaluationId }));
    }

    runTestEvaluation(evaluationId: string) {
        console.log("Run evaluation #"+ evaluationId);
        return this.http.post<OperationStatusRest>(url(`run-test-evaluation`), generateFormData({ id: evaluationId }));
    }


}