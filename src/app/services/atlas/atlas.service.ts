import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';

export * from './response';

@Injectable({ providedIn: 'root' })
export class AtlasService {
    POST: any;
    GET: any;
    formData: any;

    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/atlas${url}`;
        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string, options: any = {}): Observable < any > => this.http.get(base(url), options);
        this.formData = generateFormData;
    }

    experiments = {
        // @GetMapping("/atlas-experiments")
        // public AtlasData.AtlasSimpleExperiments init(@PageableDefault(size = 5) Pageable pageable) {
        //     return atlasService.getAtlasExperiments(pageable);
        // }
        get: (page: number | string): Observable < any > =>
            this.GET(`/atlas-experiments?page=${page}`)
    };

    experiment = {
        // @GetMapping(value = "/atlas-experiment-info/{id}")
        // public AtlasData.ExperimentInfoExtended info(@PathVariable Long id) {
        //     return atlasTopLevelService.getExperimentInfoExtended(id);
        // }
        info: (id: string): Observable < any > =>
            this.GET(`/atlas-experiment-info/${id}`),

        // @PostMapping("/atlas-experiment-delete-commit")
        // public OperationStatusRest deleteCommit(Long id) {
        //     return atlasTopLevelService.atlasDeleteCommit(id);
        // }
        deleteCommit: (id: string): Observable < any > =>
            this.POST(`/atlas-experiment-delete-commit`, this.formData({ id })),

        // @GetMapping(value = "/atlas-experiment-feature-progress/{atlasId}/{experimentId}/{featureId}")
        // public AtlasData.ExperimentFeatureExtendedResult getFeatures(
        //         @PathVariable Long atlasId,@PathVariable Long experimentId, @PathVariable Long featureId) {
        //     return atlasTopLevelService.getExperimentFeatureExtended(atlasId, experimentId, featureId);
        // }
        featureProgress: (atlasId: string, experimentId: string, featureId: string): Observable < any > =>
            this.GET(`/atlas-experiment-feature-progress/${atlasId}/${experimentId}/${featureId}`),


        // @PostMapping("/atlas-experiment-feature-progress-part/{atlasId}/{experimentId}/{featureId}/{params}/part")
        // public AtlasData.ExperimentFeatureExtendedResult getFeatureProgressPart(@PathVariable Long atlasId, @PathVariable Long experimentId, @PathVariable Long featureId, @PathVariable String[] params, @SuppressWarnings("DefaultAnnotationParam") @PageableDefault(size = 10) Pageable pageable) {
        //     return atlasTopLevelService.getFeatureProgressPart(atlasId, featureId, params, pageable);
        // }
        featureProgressPart: (atlasId: string, experimentId: string, featureId: string, params: any, page: string | number): Observable < any > =>
            this.POST(`/atlas-experiment-feature-progress-part/${atlasId}/${experimentId}/${featureId}/${params}/part`, this.formData({ page })),

        // @PostMapping("/atlas-experiment-feature-progress-console-part/{atlasId}/{taskId}")
        // public AtlasData.ConsoleResult getTasksConsolePart(@PathVariable(name = "atlasId") Long atlasId, @PathVariable(name = "taskId") Long taskId ) {
        //     return atlasTopLevelService.getTasksConsolePart(atlasId, taskId);
        // }
        featureProgressConsolePart: (atlasId: string, taskId: string): Observable < any > =>
            this.POST(`/atlas-experiment-feature-progress-console-part/${atlasId}/${taskId}`),

        // @PostMapping("/atlas-experiment-feature-plot-data-part/{atlasId}/{experimentId}/{featureId}/{params}/{paramsAxis}/part")
        // @ResponseBody
        // public AtlasData.PlotData getPlotData(
        //         @PathVariable Long atlasId,
        //         @PathVariable Long experimentId, @PathVariable Long featureId,
        //         @PathVariable String[] params, @PathVariable String[] paramsAxis) {
        //     return atlasTopLevelService.getPlotData(atlasId, experimentId, featureId, params, paramsAxis);
        // }
        featurePlotDataPart: (atlasId: string, experimentId: string, featureId: string, params: any, paramsAxis: any): Observable < any > =>
            this.POST(`/atlas-experiment-feature-plot-data-part/${atlasId}/${experimentId}/${featureId}/${params}/${paramsAxis}/part`),


        // @PostMapping(value = "/atlas-experiment-upload-from-file")
        // public OperationStatusRest uploadAtlas(final MultipartFile file) {
        //     return atlasTopLevelService.uploadExperiment(file);
        // }
        uploadFromFile: (file: File): Observable < any > =>
            this.POST(`/atlas-experiment-upload-from-file`, this.formData({ file }))
    }

    downloadFile(): Observable < HttpResponse < Blob >> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');
        return this.GET(`/atlas-experiment-export/none.zip`, {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }
}