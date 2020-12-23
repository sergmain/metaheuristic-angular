import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http"
import { BatchData } from "./BatchData"
import * as JSZip from "jszip"
import * as fileSaver from 'file-saver';
import { from, Observable, of } from "rxjs";
import { catchError, concatMap, delay, tap } from "rxjs/operators";

interface ProcessableItem {
    id: number;
    response: HttpResponse<Blob>;
    fileName: string
}

export class BatchDownloader {
    constructor(
        private http: HttpClient,
        private url: Function
    ) { }

    private list: number[] = []

    private getId(batchData: BatchData.BatchExecInfo): number {
        return batchData.batch.id
    }

    toggle(batchData: BatchData.BatchExecInfo) {
        if (this.isSelected(batchData)) {
            this.list.splice(this.list.indexOf(this.getId(batchData)), 1)
        } else {
            this.list.push(this.getId(batchData))
        }
        this.list.sort((a, z) => a - z)
    }

    isSelected(batchData: BatchData.BatchExecInfo) {
        if (this.list.indexOf(this.getId(batchData)) === -1) {
            return false
        } else {
            return true
        }
    }

    clear() {
        this.list = []
    }

    size() {
        return this.list.length
    }

    download() {
        const zipFileName = 'result ' + this.list.toString() + '.zip'
        const zip = new JSZip()
        const processable: ProcessableItem[] = this.list.map(el => ({
            id: el,
            fileName: 'empty',
            response: null,
        }))

        from(processable)
            .pipe(
                concatMap(item => this.downloadBatch(item.id.toString())
                    .pipe(
                        catchError(err => of(err)),
                        this.parseRrocessableItemOperator(item),
                    )
                )
            )
            .subscribe({
                next: e => { },
                error: error => { },
                complete: () => {
                    processable.forEach(item => {
                        zip.file(item.fileName, item.response.body)
                    })
                    zip.generateAsync({ type: "blob" }).then((blob: Blob) => {
                        fileSaver.saveAs(blob, zipFileName)
                    })
                }
            })

    }

    private parseRrocessableItemOperator(item: ProcessableItem) {
        return (source: Observable<HttpResponse<Blob>>) =>
            new Observable(observer => {
                return source.subscribe(
                    {
                        next: response => {
                            item.response = response
                            item.fileName = response.ok ?
                                `${item.id}.zip` :
                                `${item.id} error`
                            observer.next()
                        },
                        error: error => observer.error(error),
                        complete: () => observer.complete(),
                    }
                )
            })
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
