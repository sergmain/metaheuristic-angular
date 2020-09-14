import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';

const url = (s: string) => `${environment.baseUrl}dispatcher/experiment-result/${s}`;


@Injectable({ providedIn: 'root' })
export class ExperimentResultService {

    constructor(private http: HttpClient) { }

    uploadFromFile(file: File): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`experiment-result-upload-from-file`),
            formData({ file })
        );
    }

    getTasksConsolePart(experimentResultId: string, taskId: string): Observable<ExperimentResultData.ConsoleResult> {
        return this.http.post<ExperimentResultData.ConsoleResult>(
            url(`experiment-result-feature-progress-console-part/${experimentResultId}/${taskId}`),
            {}
        );
    }

    getPlotData(
        experimentResultId: string,
        experimentId: string,
        featureId: string,
        params: string,
        paramsAxis: string
    ): Observable<ExperimentResultData.PlotData> {
        return this.http.post<ExperimentResultData.PlotData>(
            url(`experiment-result-feature-plot-data-part/${experimentResultId}/${experimentId}/${featureId}/${params}/${paramsAxis}/part`),
            {});
    }

    getFeatureProgressPart(
        experimentResultId: string,
        experimentId: string,
        featureId: string,
        params: string,
        page: string
    ): Observable<ExperimentResultData.ExperimentFeatureExtendedResult> {
        return this.http.post<ExperimentResultData.ExperimentFeatureExtendedResult>(
            url(`experiment-result-feature-progress-part/${experimentResultId}/${experimentId}/${featureId}/${params}/part`),
            formData({ page })
        );
    }

    getFeatures(experimentResultId: string, experimentId: string, featureId: string): Observable<ExperimentResultData.ExperimentFeatureExtendedResult> {
        return this.http.get<ExperimentResultData.ExperimentFeatureExtendedResult>(
            url(`atlas-experiment-feature-progress/${experimentResultId}/${experimentId}/${featureId}`));
    }

    deleteCommit(id: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`experiment-result-delete-commit`),
            formData({ id })
        );
    }

    info(id: string): Observable<ExperimentResultData.ExperimentInfoExtended> {
        return this.http.get<ExperimentResultData.ExperimentInfoExtended>(
            url(`experiment-result-info/${id}`));
    }


    init(page: string): Observable<ExperimentResultData.ExperimentResultSimpleList> {
        return this.http.get<ExperimentResultData.ExperimentResultSimpleList>(
            url(`experiment-results`),
            { params: { page } }
        );
    }
    //
    //
    //

    downloadFile(): Observable<HttpResponse<Blob>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');
        return this.http.get(url(`/atlas-experiment-export/none.zip`), {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }
}