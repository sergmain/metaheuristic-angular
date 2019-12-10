import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { BehaviorSubject, forkJoin, Observable, timer } from 'rxjs';
import { repeatWhen } from 'rxjs/operators';
import { Batch } from './Bacth';
import { response } from './response';


const FINISHED_STATE = 'Finished';

@Injectable({ providedIn: 'root' })
export class BatchService {
    POST: any;
    GET: any;

    finishedNotification: BehaviorSubject < boolean > = new BehaviorSubject(false);

    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/batch${url}`;
        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string, options: any = {}): Observable < any > => this.http.get(base(url), options);
        this._startIntervalRequset()(environment.batchInterval);
    }

    batches = {
        getAll: () => {
            return new Observable(subscriber => {
                this.batches.get(0).subscribe((firstResponse: response.batches.Get) => {
                    let pages: number = firstResponse.batches.totalPages - 1;
                    const list: Observable < response.batches.Get > [] = [];
                    while (pages !== 0) {
                        list.push(this.batches.get(pages));
                        pages--;
                    }
                    forkJoin(list.reverse()).subscribe((data: response.batches.Get[]) => {
                        subscriber.next([firstResponse].concat(data));
                        subscriber.complete();
                    });
                });
            });
        },

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

    private _startIntervalRequset() {
        let prevList: Batch[] = [];
        let currentList: Batch[] = [];
        return (interval) => {
            interval = parseInt(interval, 10);
            if (!interval) { return false; }
            this.batches.getAll()
                .pipe(repeatWhen(() => timer(interval, interval)))
                .subscribe((content: response.batches.Get[]) => {
                    let exist: boolean = false;
                    let newList: Batch[] = [];
                    content.forEach((e: response.batches.Get) => newList = [].concat(newList, e.batches.content));
                    prevList = currentList;
                    currentList = newList;

                    currentList
                        .filter((e: Batch) => e.execStateStr === FINISHED_STATE)
                        .forEach((finishedElement: Batch) => {
                            prevList.find((element: Batch) => {
                                if (element.batch.id === finishedElement.batch.id) {
                                    if (element.execStateStr !== finishedElement.execStateStr) {
                                        exist = true;
                                    }
                                }
                            });
                        });
                    this.finishedNotification.next(exist);
                });
        };
    }
}