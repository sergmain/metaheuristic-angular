import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { generateFormData } from '@src/app/helpers/generateFormData';

@Injectable({ providedIn: 'root' })
export class ExperimentsService {
    POST: any;
    GET: any;
    formData: any;

    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/experiment${url}`;
        const POST: any = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        const GET: any = (url: string): Observable < any > => this.http.get(base(url));

        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string): Observable < any > => this.http.get(base(url));
        this.formData = generateFormData;
    }

    experiments = {
        // @GetMapping("/experiments")
        // public ExperimentApiData.ExperimentsResult getExperiments(@PageableDefault(size = 5) Pageable pageable) {
        //     return experimentTopLevelService.getExperiments(pageable);
        // }
        get: (page: string): any =>
            this.GET(`/experiments?page=${page}`)
    };

    experiment = {
        // @GetMapping(value = "/experiment/{id}")
        // public ExperimentApiData.ExperimentResult getExperiment(@PathVariable Long id) {
        //     return experimentTopLevelService.getExperimentWithoutProcessing(id);
        // }
        get: (id: string): Observable < any > =>
            this.GET(`/experiment/${id}`),

        // @PostMapping("/experiment-feature-plot-data-part/{experimentId}/{featureId}/{params}/{paramsAxis}/part")
        // public @ResponseBody
        // ExperimentApiData.PlotData getPlotData(
        //         @PathVariable Long experimentId, @PathVariable Long featureId,
        //         @PathVariable String[] params, @PathVariable String[] paramsAxis) {
        //     return experimentTopLevelService.getPlotData(experimentId, featureId, params, paramsAxis);
        // }
        featurePlotDataPart: (experimentId: string, featureId: string, params: string, paramsAxis: string): Observable < any > =>
            this.POST(`/experiment-feature-plot-data-part/${experimentId}/${featureId}/${params}/${paramsAxis}/part`),

        // @PostMapping("/experiment-feature-progress-console-part/{taskId}")
        // public ExperimentApiData.ConsoleResult getTasksConsolePart(@PathVariable(name="taskId") Long taskId) {
        //     return experimentTopLevelService.getTasksConsolePart(taskId);
        // }
        featureProgressConsolePart: (taskId: string): Observable < any > =>
            this.POST(`/experiment-feature-progress-console-part/${taskId}`),

        // @PostMapping("/experiment-feature-progress-part/{experimentId}/{featureId}/{params}/part")
        // public ExperimentApiData.ExperimentFeatureExtendedResult getFeatureProgressPart(@PathVariable Long experimentId, @PathVariable Long featureId, @PathVariable String[] params, @SuppressWarnings("DefaultAnnotationParam") @PageableDefault(size = 10) Pageable pageable) {
        //     return experimentTopLevelService.getFeatureProgressPart(experimentId, featureId, params, pageable);
        // }
        featureProgressPart: (experimentId: string, featureId: string, params: string): Observable < any > =>
            this.POST(`/experiment-feature-progress-part/${experimentId}/${featureId}/${params}/part`),

        // @GetMapping(value = "/experiment-feature-progress/{experimentId}/{featureId}")
        // public ExperimentApiData.ExperimentFeatureExtendedResult getFeatures(@PathVariable Long experimentId, @PathVariable Long featureId) {
        //     return experimentTopLevelService.getExperimentFeatureExtended(experimentId, featureId);
        // }
        featureProgress: (experimentId: string, featureId: string): Observable < any > =>
            this.GET(`/experiment-feature-progress/${experimentId}/${featureId}`),


        // @GetMapping(value = "/experiment-info/{id}")
        // public ExperimentApiData.ExperimentInfoExtendedResult info(@PathVariable Long id) {
        //     return experimentTopLevelService.getExperimentInfo(id);
        // }
        info: (id: string): Observable < any > =>
            this.GET(`/experiment-info/${id}`),

        // @GetMapping(value = "/experiment-edit/{id}")
        // public ExperimentApiData.ExperimentsEditResult edit(@PathVariable Long id) {
        //     return experimentTopLevelService.editExperiment(id);
        // }
        edit: (id: string): Observable < any > =>
            this.GET(`/experiment-edit/${id}`),

        // @PostMapping("/experiment-add-commit")
        // public OperationStatusRest addFormCommit(@RequestBody ExperimentApiData.ExperimentData experiment) {
        //     return experimentTopLevelService.addExperimentCommit(experiment);
        // }
        addCommit: (data: any): Observable < any > =>
            this.POST(`/experiment-add-commit`, data),

        // @PostMapping("/experiment-edit-commit")
        // public OperationStatusRest editFormCommit(@RequestBody ExperimentApiData.SimpleExperiment simpleExperiment) {
        //     return experimentTopLevelService.editExperimentCommit(simpleExperiment);
        // }
        editCommit: (data: any): Observable < any > =>
            this.POST(`/experiment-edit-commit`, data),


        // @PostMapping("/experiment-metadata-add-commit/{id}")
        // public OperationStatusRest metadataAddCommit(@PathVariable Long id, String key, String value) {
        //     return experimentTopLevelService.metadataAddCommit(id, key, value);
        // }
        metadataAddCommit: (experimentId: string, data: any): Observable < any > =>
            this.POST(`/experiment-metadata-add-commit/${experimentId}`, this.formData(data)),


        // @PostMapping("/experiment-metadata-edit-commit/{id}")
        // public OperationStatusRest metadataEditCommit(@PathVariable Long id, String key, String value) {
        //     return experimentTopLevelService.metadataEditCommit(id, key, value);
        // }
        metadataEditCommit: (experimentId: string, data: any): Observable < any > =>
            this.POST(`/experiment-metadata-edit-commit/${experimentId}`, this.formData(data)),


        // @PostMapping("/experiment-snippet-add-commit/{id}")
        // public OperationStatusRest snippetAddCommit(@PathVariable Long id, String code) {
        //     return experimentTopLevelService.snippetAddCommit(id, code);
        // }
        snippetAddCommit: (id: string, data: any): Observable < any > =>
            this.POST(`/experiment-snippet-add-commit/${id}`, this.formData(data)),

        // @GetMapping("/experiment-metadata-delete-commit/{experimentId}/{key}")
        // public OperationStatusRest metadataDeleteCommit(@PathVariable Long experimentId, @PathVariable String key) {
        //     if (true) throw new IllegalStateException("Need to change this in web(html files) and angular");
        //     return experimentTopLevelService.metadataDeleteCommit(experimentId, key);
        // }
        metadataDeleteCommit: (experimentId: string | number, key: string | number): Observable < any > =>
            this.GET(`/experiment-metadata-delete-commit/${experimentId}/${key}`),

        // @GetMapping("/experiment-metadata-default-add-commit/{experimentId}")
        // public OperationStatusRest metadataDefaultAddCommit(@PathVariable Long experimentId) {
        //     return experimentTopLevelService.metadataDefaultAddCommit(experimentId);
        // }
        metadataDefaultAddCommit: (experimentId: string | number): Observable < any > =>
            this.GET(`/experiment-metadata-default-add-commit/${experimentId}`),

        // @GetMapping("/experiment-snippet-delete-commit/{experimentId}/{snippetCode}")
        // public OperationStatusRest snippetDeleteCommit(@PathVariable Long experimentId, @PathVariable String snippetCode) {
        //     return experimentTopLevelService.snippetDeleteCommit(experimentId, snippetCode);
        // }
        snippetDeleteCommit: (experimentId: string, id: string): Observable < any > =>
            this.GET(`/experiment-snippet-delete-commit/${experimentId}/${id}`),

        // @PostMapping("/experiment-delete-commit")
        // public OperationStatusRest deleteCommit(Long id) {
        //     return experimentTopLevelService.experimentDeleteCommit(id);
        // }
        deleteCommit: (id: string): Observable < any > =>
            this.POST(`/experiment-delete-commit`, this.formData({ id })),

        // @PostMapping("/experiment-clone-commit")
        // public OperationStatusRest experimentCloneCommit(Long id) {
        //     return experimentTopLevelService.experimentCloneCommit(id);
        // }
        cloneCommit: (id: string | number): Observable < any > =>
            this.POST(`/experiment-clone-commit`, this.formData({ id })),

        // @PostMapping("/task-rerun/{taskId}")
        // public OperationStatusRest rerunTask(@PathVariable Long taskId) {
        //     return workbookService.resetTask(taskId);
        // }
        taskRerun: (taskId: string): Observable < any > =>
            this.POST(`/task-rerun/${taskId}`),


        // @PostMapping(value = "/experiment-upload-from-file")
        // public OperationStatusRest uploadSnippet(final MultipartFile file) {
        //     return experimentTopLevelService.uploadExperiment(file);
        // }
        uploadFromFile: (file: any): Observable < any > =>
            this.POST(`/experiment-upload-from-file`, file),

        // @PostMapping("/bind-experiment-to-plan-with-resource")
        // public OperationStatusRest bindExperimentToPlanWithResource(String experimentCode, String resourcePoolCode) {
        //     return experimentTopLevelService.bindExperimentToPlanWithResource(experimentCode, resourcePoolCode);
        // }
        bindExperimentToPlanWithResource: (experimentCode: string, resourcePoolCode: string): Observable < any > =>
            this.POST(`/bind-experiment-to-plan-with-resource`, { experimentCode, resourcePoolCode }),

        // @PostMapping("/produce-tasks")
        // public OperationStatusRest produceTasks(String experimentCode) {
        //     return experimentTopLevelService.produceTasks(experimentCode);
        // }
        produceTasks: (experimentCode: string): Observable < any > =>
            this.POST(`/produce-tasks`, { experimentCode }),

        // @PostMapping("/start-processing-of-tasks")
        // public OperationStatusRest startProcessingOfTasks(String experimentCode) {
        //     return experimentTopLevelService.startProcessingOfTasks(experimentCode);
        // }
        startProcessingOfTasks: (experimentCode: string): Observable < any > =>
            this.POST(`/start-processing-of-tasks`, { experimentCode }),


        // @GetMapping("/processing-status/{experimentCode}")
        // public EnumsApi.WorkbookExecState getExperimentProcessingStatus(@PathVariable String experimentCode) {
        //     return experimentTopLevelService.getExperimentProcessingStatus(experimentCode);
        // }
        processingStatus: (experimentCode: string): Observable < any > =>
            this.GET(`/processing-status/${experimentCode}`),

        // @GetMapping(value = "/experiment-to-atlas/{id}")
        // public OperationStatusRest toAtlas(@PathVariable Long id) {
        //     return experimentTopLevelService.toAtlas(id);
        // }
        toAtlas: (id: string): Observable < any > =>
            this.GET(`/experiment-to-atlas/${id}`)
    };
}