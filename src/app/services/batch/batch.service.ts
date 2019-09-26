import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

export * from './Bacth';
export * from './response';

@Injectable({ providedIn: 'root' })

export class BatchService {
    POST: any;
    GET: any;
    formData: any;

    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/batch${url}`;
        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string, options: any = {}): Observable < any > => this.http.get(base(url), options);
        this.formData = generateFormData;
    }

    batches = {
        // @GetMapping("/batches")
        // public BatchData.BatchesResult batches(@PageableDefault(size = 20) Pageable pageable) {
        //     return batchTopLevelService.getBatches(pageable);
        // }
        get: (page: number): Observable < any > =>
            this.GET(`/batches?page=${page}`),

        // @PostMapping("/batches-part")
        // public BatchData.BatchesResult batchesPart(@PageableDefault(size = 20) Pageable pageable) {
        //     return batchTopLevelService.getBatches(pageable);
        // }
        part: (page: number): Observable < any > =>
            this.POST(`/batches-part`)
    };

    batch: any = {
        // @GetMapping(value = "/batch-add")
        // public BatchData.PlansForBatchResult batchAdd() {
        //     return batchTopLevelService.getPlansForBatchResult();
        // }
        add: (): Observable < any > =>
            this.GET(`/batch-add`),

        // @GetMapping("/batch-delete/{batchId}")
        // public BatchData.Status processResourceDelete(@PathVariable Long batchId) {
        //     return batchTopLevelService.getProcessingResourceStatus(batchId);
        // }
        delete: (batchId: string): Observable < any > =>
            this.GET(`/batch-delete/${batchId}`),


        // @PostMapping("/batch-delete-commit")
        // public OperationStatusRest processResourceDeleteCommit(Long batchId) {
        //     return batchTopLevelService.processResourceDeleteCommit(batchId);
        // }
        deleteCommit: (batchId: string): Observable < any > =>
            this.POST(`/batch-delete-commit`, this.formData({ batchId })),

        // @GetMapping(value= "/batch-status/{batchId}" )
        // public BatchData.Status getProcessingResourceStatus(@PathVariable("batchId") Long batchId) {
        //     return batchTopLevelService.getProcessingResourceStatus(batchId);
        // }
        status: (batchId: string): Observable < any > =>
            this.GET(`/batch-status/${batchId}`),

        // @PostMapping(value = "/batch-upload-from-file")
        // public OperationStatusRest uploadFile(final MultipartFile file, Long planId) {
        //     return batchTopLevelService.batchUploadFromFile(file, planId);
        // }
        upload: (planId: string | number, file: File): Observable < any > =>
            this.POST(`/batch-upload-from-file`, this.formData({ file, planId })),
    };

    // @GetMapping(value= "/batch-download-result/{batchId}/{fileName}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    // public HttpEntity<AbstractResource> downloadProcessingResult(
    //         HttpServletResponse response, @PathVariable("batchId") Long batchId,
    //         @SuppressWarnings("unused") @PathVariable("fileName") String fileName) throws IOException {
    //     return batchTopLevelService.getBatchProcessingResult(batchId);
    // }
    downloadFile(batchId: string): Observable < HttpResponse < Blob >> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');

        return this.GET(`/batch-download-result/${batchId}/result.zip`, {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }
}