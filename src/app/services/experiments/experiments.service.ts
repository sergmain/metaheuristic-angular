import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { response } from './response';

const url = (s: string): string => `${environment.baseUrl}dispatcher/experiment${s}`;



@Injectable({ providedIn: 'root' })
export class ExperimentsService {

    constructor(private http: HttpClient) { }

    experiments = {
        get: (page: string): any =>
            this.http.get(url(`/experiments`), { params: { page } })
    };

    experiment = {
        get: (id: string): Observable<any> =>
            this.http.get(url(`/experiment/${id}`)),

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

        edit: (id: string): Observable<any> =>
            this.http.get(url(`/experiment-edit/${id}`)),

        addCommit: (data: any): Observable<response.experiment.AddCommit> =>
            this.http.post<response.experiment.AddCommit>(url(`/experiment-add-commit`), data),

        editCommit: (data: any): Observable<any> =>
            this.http.post(url(`/experiment-edit-commit`), data),

        metadataAddCommit: (experimentId: string, data: any): Observable<any> =>
            this.http.post(url(`/experiment-metadata-add-commit/${experimentId}`), formData(data)),

        metadataEditCommit: (experimentId: string, data: any): Observable<any> =>
            this.http.post(url(`/experiment-metadata-edit-commit/${experimentId}`), formData(data)),

        snippetAddCommit: (id: string, data: any): Observable<any> =>
            this.http.post(url(`/experiment-snippet-add-commit/${id}`), formData(data)),

        metadataDeleteCommit: (experimentId: string | number, key: string | number): Observable<any> =>
            this.http.get(url(`/experiment-metadata-delete-commit/${experimentId}/${key}`)),

        metadataDefaultAddCommit: (experimentId: string | number): Observable<any> =>
            this.http.get(url(`/experiment-metadata-default-add-commit/${experimentId}`)),

        snippetDeleteByTypeCommit: (experimentId: string, snippetType: string): Observable<any> =>
            this.http.get(url(`/experiment-snippet-delete-by-type-commit/${experimentId}/${snippetType}`)),

        deleteCommit: (id: string): Observable<any> =>
            this.http.post(url(`/experiment-delete-commit`), formData({ id })),

        cloneCommit: (id: string | number): Observable<any> =>
            this.http.post(url(`/experiment-clone-commit`), formData({ id })),

        taskRerun: (taskId: string): Observable<any> =>
            this.http.post(url(`/task-rerun/${taskId}`), {}),

        uploadFromFile: (file: any): Observable<any> =>
            this.http.post(url(`/experiment-upload-from-file`), file),

        bindExperimentToPlanWithResource: (experimentCode: string, resourcePoolCode: string): Observable<any> =>
            this.http.post(url(`/bind-experiment-to-plan-with-resource`), { experimentCode, resourcePoolCode }),

        produceTasks: (experimentCode: string): Observable<any> =>
            this.http.post(url(`/produce-tasks`), { experimentCode }),

        startProcessingOfTasks: (experimentCode: string): Observable<any> =>
            this.http.post(url(`/start-processing-of-tasks`), { experimentCode }),

        processingStatus: (experimentCode: string): Observable<any> =>
            this.http.get(url(`/processing-status/${experimentCode}`)),

        toAtlas: (id: string): Observable<any> =>
            this.http.get(url(`/experiment-to-atlas/${id}`))
    };
}