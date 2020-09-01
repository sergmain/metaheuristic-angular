import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from '../authentication';
import { BatchExexStatusComparer } from './BatchExexStatusComparer';
import { response } from './response';
import { Batch } from './Batch';
import { BatchExecStatus } from './BatchExecStatus';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.reducers';
import { newExecStatus } from './batch.actions';


const url = (urlString: string): string => `${environment.baseUrl}dispatcher/batch/${urlString}`;

const FINISHED_STATE: number = 4;
const ERROR_STATE: number = -1;

export interface GetBatchesParams {
    page: number;
    filterBatches: boolean;
}

@Injectable({ providedIn: 'root' })
export class BatchService {

    private intervalStarted: boolean = false;
    batchExexStatusComparer: BatchExexStatusComparer;
    finishedNotification: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService,
        private store: Store<AppState>
    ) {
        this.batchExexStatusComparer = new BatchExexStatusComparer([FINISHED_STATE, ERROR_STATE]);
        this.batchExexStatusComparer.notification.subscribe((s: boolean) => {
            this.finishedNotification.next(s);
        });
    }

    batches = {
        get: (params: GetBatchesParams): Observable<response.batches.Get> =>
            this.http.get<response.batches.Get>(url(`batches?page=${params.page}${params.filterBatches ? '&filterBatches=true' : ''}`)),

        part: (page: number) =>
            this.http.post(url(`batches-part`), {})
    };

    batch = {
        add: (): Observable<response.batch.Add> =>
            this.http.get<response.batch.Add>(url(`batch-add`)),

        delete: (batchId: string) =>
            this.http.get(url(`batch-delete/${batchId}`)),

        deleteCommit: (batchId: string) =>
            this.http.post(url(`batch-delete-commit`), generateFormData({ batchId })),

        status: (batchId: string): Observable<response.batch.Status> =>
            this.http.get<response.batch.Status>(url(`batch-status/${batchId}`)),

        upload: (sourceCodeId: string | number, file: File): Observable<response.batch.Upload> =>
            this.http.post<response.batch.Upload>(url(`batch-upload-from-file`), generateFormData({ file, sourceCodeId })),

        execStatuses: (): Observable<response.batch.ExecStatuses> =>
            this.http.get<response.batch.ExecStatuses>(url(`batch-exec-statuses`))
    };

    static updateBatchExecStatus(batches: Batch[], statuses: BatchExecStatus[]): void {
        statuses.forEach(status => {
            batches
                .filter(batch => batch.batch.id === status.id)
                .forEach(batch => {
                    return batch.execState = status.state;
                });
        });
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

    stopIntervalRequset(): void {
        this.intervalStarted = false;
    }

    startIntervalRequset(interval: number): void {
        if (!this.intervalStarted) {
            this.intervalRequset(interval);
            this.intervalStarted = true;
        }
    }

    private intervalRequset(interval: number): void {
        const base: BatchService = this;
        fn();

        function fn(): void {
            if (base.authenticationService.isAuth()) {
                base.batch.execStatuses().subscribe((content: response.batch.ExecStatuses) => {
                    base.batchExexStatusComparer.takeApart(content.statuses);
                    if (base.intervalStarted) {
                        setTimeout(() => { fn(); }, interval);
                    }
                    base.store.dispatch(newExecStatus({ payload: content.statuses }));
                });
            }
        }
    }
}