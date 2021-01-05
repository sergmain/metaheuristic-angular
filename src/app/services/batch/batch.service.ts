import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { SourceCodeUidsForCompany } from '../source-codes/SourceCodeUidsForCompany';
import { BatchDownloader } from './BatchDownloader';
import { BatchesResult } from './BatchesResult';
import { BatchExexStatusComparer } from './BatchExexStatusComparer';
import { ExecStatuses } from './ExecStatuses';
import { Status } from './Status';

const url = (urlString: string): string => `${environment.baseUrl}dispatcher/batch/${urlString}`;

const FINISHED_STATE: number = 4;
const ERROR_STATE: number = -1;

export interface GetBatchesParams {
    page: number;
    filterBatches: boolean;
}

@Injectable({ providedIn: 'root' })
export class BatchService {
    batchDownloader: BatchDownloader;
    batchExexStatusComparer: BatchExexStatusComparer;
    finishedNotification: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private http: HttpClient,
    ) {
        this.batchDownloader = new BatchDownloader(http, url);
        this.batchExexStatusComparer = new BatchExexStatusComparer([FINISHED_STATE, ERROR_STATE]);
        this.batchExexStatusComparer.notification.subscribe((s: boolean) => {
            this.finishedNotification.next(s);
        });
    }

    batches(page: string, filterBatches: boolean): Observable<BatchesResult> {
        return this.http.get<BatchesResult>(
            url(`batches`),
            { params: { page, filterBatches: filterBatches ? 'true' : 'false' } }
        );
    }

    batchExecStatuses(): Observable<ExecStatuses> {
        return this.http.get<ExecStatuses>(url(`batch-exec-statuses`));
    }

    batchAdd(): Observable<SourceCodeUidsForCompany> {
        return this.http.get<SourceCodeUidsForCompany>(url(`batch-add`));
    }

    processResourceDelete(batchId: string): Observable<Status> {
        return this.http.get<Status>(url(`batch-delete/${batchId}`));
    }

    processResourceDeleteCommit(batchId: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`batch-delete-commit`), generateFormData({ batchId }));
    }

    uploadFile(sourceCodeId: string, file: File): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`batch-upload-from-file`), generateFormData({ file, sourceCodeId }));
    }

    getProcessingResourceStatus(batchId: string): Observable<Status> {
        return this.http.get<Status>(url(`batch-status/${batchId}`));
    }

    downloadFile(batchId: string): Observable<HttpResponse<Blob>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');

        return this.http.get(url(`batch-download-result/${batchId}/result.zip`), {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }
}