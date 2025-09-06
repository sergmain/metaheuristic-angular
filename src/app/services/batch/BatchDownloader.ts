import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BatchData } from './BatchData';
import JSZip from 'jszip';
import * as fileSaver from 'file-saver';
import { from, Observable, of, Subscription } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { BatchSelector } from './BatchSelector';

interface ProcessableItem {
    id: number;
    response: HttpResponse<Blob>;
    fileName: string;
}

export class BatchDownloader extends BatchSelector {
    constructor(
        private http: HttpClient,
        private url: (s: string) => string
    ) { super(); }


    download(): void {
        const zipFileName: string = 'result ' + this.list.toString() + '.zip';
        const zip: JSZip = new JSZip();
        const processable: ProcessableItem[] = this.list.map(el => ({
            id: el,
            fileName: 'empty',
            response: null,
        }));

        from(processable)
            .pipe(
                concatMap(item => this.downloadBatch(item.id.toString())
                    .pipe(
                        catchError(err => of(err)),
                        this.parseProcessableItemOperator(item),
                    )
                )
            )
            .subscribe({
                next: e => { },
                error: error => { },
                complete: () => {
                    processable.forEach(item => {
                        zip.file(item.fileName, item.response.body);
                    });
                    zip.generateAsync({ type: 'blob' }).then((blob: Blob) => {
                        fileSaver.saveAs(blob, zipFileName);
                    });
                }
            });

    }

    private parseProcessableItemOperator(item: ProcessableItem): (source: Observable<HttpResponse<Blob>>) => Observable<Subscription> {
        return (source: Observable<HttpResponse<Blob>>) =>
            new Observable<Subscription>(observer => {
                return source.subscribe(
                    {
                        next: response => {
                            item.response = response;
                            item.fileName = response.ok ?
                                `${item.id}.zip` :
                                `${item.id} error`;
                            observer.next();
                        },
                        error: error => observer.error(error),
                        complete: () => observer.complete(),
                    }
                );
            });
    }

    private downloadBatch(batchId: string): Observable<HttpResponse<Blob>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');
        return this.http.get(this.url(`batch-download-result/${batchId}/result.zip`), {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }
}
