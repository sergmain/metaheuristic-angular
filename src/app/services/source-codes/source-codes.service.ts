import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { ExecContextResult } from './ExecContextResult';
import { ExecContextsResult } from './ExecContextsResult';
import { SimpleExecContextAddingResult } from './SimpleExecContextAddingResult';
import { SourceCodeResult } from './SourceCodeResult';
import { SourceCodesResult } from './SourceCodesResult';
import { SourceCodeType } from '@src/app/enums/SourceCodeType';
import { ExecContextStateResult } from './ExecContextStateResult';

const url = (s: string): string => `${environment.baseUrl}dispatcher/source-code/${s}`;

@Injectable({
    providedIn: 'root'
})
export class SourceCodesService {
    constructor(
        private http: HttpClient
    ) { }

    sourceCodes(page: string): Observable<SourceCodesResult> {
        return this.http.get<SourceCodesResult>(
            url('source-codes'),
            { params: { page } }
        );
    }

    sourceCodeArchivedOnly(page: string): Observable<SourceCodesResult> {
        return this.http.get<SourceCodesResult>(
            url('source-codes-archived-only'),
            { params: { page } }
        );
    }

    edit(id: string): Observable<SourceCodeResult> {
        return this.http.get<SourceCodeResult>(url(`source-code/${id}`));
    }

    validate(id: string): Observable<SourceCodeResult> {
        return this.http.get<SourceCodeResult>(url(`source-code-validate/${id}`));
    }

    addFormCommit(source: string): Observable<SourceCodeResult> {
        return this.http.post<SourceCodeResult>(
            url(`source-code-add-commit`),
            formData({ source })
        );
    }

    editFormCommit(sourceCodeId: string, source: string): Observable<SourceCodeResult> {
        return this.http.post<SourceCodeResult>(
            url(`source-code-edit-commit`),
            formData({ sourceCodeId, source })
        );
    }

    deleteCommit(id: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`source-code-delete-commit`),
            formData({ id })
        );
    }

    archiveCommit(id: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`source-code-archive-commit`),
            formData({ id })
        );
    }

    uploadSourceCode(file: File): Observable<SourceCodeResult> {
        return this.http.post<SourceCodeResult>(
            url(`source-code-upload-from-file`),
            formData({ file })
        );
    }


    //
    //
    //
    getSourceCodeType(uid: string, result: SourceCodesResult): SourceCodeType {
        let type: SourceCodeType = SourceCodeType.common;
        if (result.batches.includes(uid)) { type = SourceCodeType.batch; }
        if (result.experiments.includes(uid)) { type = SourceCodeType.experiment; }
        return type;
    }
}
