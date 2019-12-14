import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { BehaviorSubject, forkJoin, Observable, timer } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';
import { Batch } from './Bacth';
import { response } from './response';
import { BatchExecStatus } from './BatchExecStatus';
import { AuthenticationService } from '../authentication';
import { BatchExexStatusComparer } from './BatchExexStatusComparer';


const FINISHED_STATE: number = 4;
const ERROR_STATE: number = -1;

@Injectable({ providedIn: 'root' })
export class BatchService {

    private intervalStarted: boolean = false;
    batchExexStatusComparer: BatchExexStatusComparer;

    POST: any;
    GET: any;

    finishedNotification: BehaviorSubject < boolean > = new BehaviorSubject(false);

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService
    ) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/batch${url}`;
        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string, options: any = {}): Observable < any > => this.http.get(base(url), options);
        this.batchExexStatusComparer = new BatchExexStatusComparer([FINISHED_STATE, ERROR_STATE]);

        this.batchExexStatusComparer.notification.subscribe((s: boolean) => {
            this.finishedNotification.next(s);
        });
    }

    batches = {
        get: (page: number): Observable < response.batches.Get > => this.GET(`/batches?page=${page}`),

        part: (page: number): Observable < any > =>
            this.POST(`/batches-part`)
    };

    batch = {
        add: (): Observable < response.batch.Add > =>
            this.GET(`/batch-add`),

        delete: (batchId: string): Observable < any > =>
            this.GET(`/batch-delete/${batchId}`),

        deleteCommit: (batchId: string): Observable < any > =>
            this.POST(`/batch-delete-commit`, generateFormData({ batchId })),

        status: (batchId: string): Observable < response.batch.Status > =>
            this.GET(`/batch-status/${batchId}`),

        upload: (planId: string | number, file: File): Observable < response.batch.Upload > =>
            this.POST(`/batch-upload-from-file`, generateFormData({ file, planId })),

        execStatuses: (): Observable < response.batch.ExecStatuses > => this.GET(`/batch-exec-statuses`)
    };

    downloadFile(batchId: string): Observable < HttpResponse < Blob >> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');

        return this.GET(`/batch-download-result/${batchId}/result.zip`, {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }

    stopIntervalRequset() {
        this.intervalStarted = false;
    }

    startIntervalRequset(interval: number) {
        if (this.intervalStarted) {
            return false;
        }
        this.intervalRequset(interval);
        this.intervalStarted = true;
    }

    private intervalRequset(interval: number) {
        const base: BatchService = this;
        fn();

        function fn() {
            if (!base.authenticationService.isAuth()) {
                return false;
            }
            base.batch.execStatuses().subscribe((content: response.batch.ExecStatuses) => {
                base.batchExexStatusComparer.takeApart(content.statuses);
                if (base.intervalStarted) {
                    setTimeout(() => { fn(); }, interval);
                }
            });
        }
    }
}