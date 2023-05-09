import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {SimpleKbsResult} from './SimpleKbsResult';
import {OperationStatusRest} from "@app/models/OperationStatusRest";
import {generateFormData} from "@app/helpers/generateFormData";
import {SimpleKbResult} from "./SimpleKbResult";


const url = (s: string): string => `${environment.baseUrl}dispatcher/kb/${s}`;

@Injectable({ providedIn: 'root' })
export class KbService {
    constructor(
        private http: HttpClient
    ) { }

    getKbs(page: string): Observable<SimpleKbsResult> {
        let newUrl = url('kbs')
        console.log('KbService.newUrl: ' + newUrl);
        return this.http.get<SimpleKbsResult>(newUrl, {params: {page}});
    }

    getKb(id: string): Observable<SimpleKbResult> {
        return this.http.get<SimpleKbResult>(url(`kb/${id}`));
    }

    kbDeleteCommit(kbId: string): Observable<OperationStatusRest> {
        console.log("Delete KB #"+ kbId);
        return this.http.post<OperationStatusRest>(url(`kb-delete-commit`), generateFormData({ id: kbId }));
    }

    addFormCommit(code: string, params: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`kb-add-commit`),
            generateFormData({
                code, params
            })
        );
    }

    editFormCommit = (id: string, params: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`kb-edit-commit/${id}`),
            generateFormData({
                params
            }))

    kbInit(kbId: string): Observable<OperationStatusRest> {
        console.log("Init KB #"+ kbId);
        return this.http.post<OperationStatusRest>(url(`kb-init`), generateFormData({ id: kbId }));
    }
}