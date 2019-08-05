import { jsonToUrlParams as toURL } from '@app/helpers/jsonToUrlParams';
import { environment } from '@src/environments/environment';

const base: string = environment.baseUrl + 'launchpad/batch';

const urls: any = {
    batches: {
        // @GetMapping("/batches")
        // public BatchData.BatchesResult batches(@PageableDefault(size = 20) Pageable pageable) {
        //     return batchTopLevelService.getBatches(pageable);
        // }
        get: (data: any): string => `${base}/batches?${toURL(data)}`
    },
    batch: {
        // @PostMapping("/batches-part")
        // public BatchData.BatchesResult batchesPart(@PageableDefault(size = 20) Pageable pageable) {
        //     return batchTopLevelService.getBatches(pageable);
        // }
        get: (id: string): string => `${base}/batches-part/${id}`,

        // @GetMapping(value = "/batch-add")
        // public BatchData.PlansForBatchResult batchAdd() {
        //     return batchTopLevelService.getPlansForBatchResult();
        // }
        add: (): string => base + '/batch-add/',

        // @PostMapping(value = "/batch-upload-from-file")
        // public OperationStatusRest uploadFile(final MultipartFile file, Long planId) {
        //     return batchTopLevelService.batchUploadFromFile(file, planId);
        // }
        upload: (planId: string, file: any): string => `${base}/batch-upload-from-file`,

        // @GetMapping(value= "/batch-status/{batchId}" )
        // public BatchData.Status getProcessingResourceStatus(@PathVariable("batchId") Long batchId) {
        //     return batchTopLevelService.getProcessingResourceStatus(batchId);
        // }
        status: (id: string): string => `${base}/batch-status/${id}`,

        // @GetMapping("/batch-delete/{batchId}")
        // public BatchData.Status processResourceDelete(@PathVariable Long batchId) {
        //     return batchTopLevelService.getProcessingResourceStatus(batchId);
        // }
        delete: (batchId: string): string => `${base}/batch-delete/${batchId}`,

        // @PostMapping("/batch-delete-commit")
        // public OperationStatusRest processResourceDeleteCommit(Long batchId) {
        //     return batchTopLevelService.processResourceDeleteCommit(batchId);
        // }
        deleteCommit: (data: any): string => `${base}/batch-delete-commit?${toURL(data)}`
    },
    downloadFile: (batchId: string): string => `${environment.host}launchpad/batch/batch-download-result/${batchId}/result.zip`

};

export { urls };
