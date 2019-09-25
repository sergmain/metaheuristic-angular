import { environment } from '@src/environments/environment';
import { jsonToUrlParams as toURL } from '@app/helpers/jsonToUrlParams';

const base: string = environment.baseUrl + 'launchpad/atlas';

export const urls: any = {
    experiments: {
        get: (page: number): string =>
            `${base}/atlas-experiments?page=${page}`
    },
    experiment: {
        info: (id: string): string =>
            `${base}/atlas-experiment-info/${id}`,

        deleteCommit: (data: any): string =>
            // `${base}/atlas-experiment-delete-commit?${toURL(data)}`,
            `${base}/atlas-experiment-delete-commit`,

        featureProgress: (atlasId: string, experimentId: string, featureId: string): string =>
            `${base}/atlas-experiment-feature-progress/${atlasId}/${experimentId}/${featureId}`,

        featurePlotDataPart: (atlasId: string, experimentId: string, featureId: string, params: string, paramsAxis: string): string =>
            `${base}/atlas-experiment-feature-plot-data-part/${atlasId}/${experimentId}/${featureId}/${params}/${paramsAxis}/part`,

        featureProgressConsolePart: (atlasId: string, taskId: string): string =>
            `${base}/atlas-experiment-feature-progress-console-part/${atlasId}/${taskId}`,

        featureProgressPart: (atlasId: string, experimentId: string, featureId: string, params: string): string =>
            `${base}/atlas-experiment-feature-progress-part/${atlasId}/${experimentId}/${featureId}/${params}/part`,


        // TODO add /atlas-experiment-upload-from-file"
        // @PostMapping(value = "/atlas-experiment-upload-from-file")
        // public OperationStatusRest uploadAtlas(final MultipartFile file) {
        //     return atlasTopLevelService.uploadExperiment(file);
        // }
    }
};
