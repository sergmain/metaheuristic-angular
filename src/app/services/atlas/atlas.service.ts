import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { response } from './response';

const url = (url: string) => `${environment.baseUrl}dispatcher/atlas${url}`;


@Injectable({ providedIn: 'root' })
export class AtlasService {

    constructor(private http: HttpClient) { }

    experiments = {
        get: (page: string): Observable<response.experiments.Get> =>
            this.http.get<response.experiments.Get>(url(`/atlas-experiments`), { params: { page } })
    };

    experiment = {
        info: (id: string): Observable<response.experiment.Info> =>
            this.http.get<response.experiment.Info>(url(`/atlas-experiment-info/${id}`)),

        deleteCommit: (id: string): Observable<response.experiment.DeleteCommit> =>
            this.http.post<response.experiment.DeleteCommit>(url(`/atlas-experiment-delete-commit`), formData({ id })),

        featureProgress: (atlasId: string, experimentId: string, featureId: string): Observable<response.experiment.FeatureProgress> =>
            this.http.get<response.experiment.FeatureProgress>(url(`/atlas-experiment-feature-progress/${atlasId}/${experimentId}/${featureId}`)),


        featureProgressPart: (atlasId: string, experimentId: string, featureId: string, params: any, page: string | number): Observable<response.experiment.FeatureProgressPart> =>
            this.http.post<response.experiment.FeatureProgressPart>(url(`/atlas-experiment-feature-progress-part/${atlasId}/${experimentId}/${featureId}/${params}/part`), formData({ page })),

        featureProgressConsolePart: (atlasId: string, taskId: string): Observable<response.experiment.FeatureProgressConsolePart> =>
            this.http.post<response.experiment.FeatureProgressConsolePart>(url(`/atlas-experiment-feature-progress-console-part/${atlasId}/${taskId}`), {}),

        featurePlotDataPart: (atlasId: string, experimentId: string, featureId: string, params: any, paramsAxis: any): Observable<response.experiment.FeaturePlotDataPart> =>
            this.http.post<response.experiment.FeaturePlotDataPart>(url(`/atlas-experiment-feature-plot-data-part/${atlasId}/${experimentId}/${featureId}/${params}/${paramsAxis}/part`), {}),

        uploadFromFile: (file: File): Observable<response.experiment.UploadFromFile> =>
            this.http.post<response.experiment.UploadFromFile>(url(`/atlas-experiment-upload-from-file`), formData({ file }))
    };

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