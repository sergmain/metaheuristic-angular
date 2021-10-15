import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@app/helpers/generateFormData';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { from, Observable, of, Subscription } from 'rxjs';
import { SimpleCompaniesResult } from './SimpleCompaniesResult';
import { SimpleCompanyResult } from './SimpleCompanyResult';
import { NewAccount, AccountsResult, AccountResult } from '../accounts';
import { AccountWithRoleResult } from '@services/company/AccountWithRoleResult';
import { BatchesResult } from '@services/batch/BatchesResult';
import { BatchData } from '@services/batch/BatchData';
import { SourceCodesForCompany } from '@services/source-codes/SourceCodesForCompany';
import * as JSZip from 'jszip';
import { catchError, concatMap } from 'rxjs/operators';
import * as fileSaver from 'file-saver';

const url = (s: string): string => `${environment.baseUrl}dispatcher/company/${s}`;

interface ProcessableItem {
    id: string;
    companyId: string;
    response: HttpResponse<Blob>;
    fileName: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
    constructor(
        private http: HttpClient
    ) { }

    companies = (page: string): Observable<SimpleCompaniesResult> =>
        this.http.get<SimpleCompaniesResult>(url('companies'), { params: { page } })

    addFormCommitCompany = (companyName: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url('company-add-commit'),
            generateFormData({
                companyName
            }))

    editCompany = (companyUniqueId: string): Observable<SimpleCompanyResult> =>
        this.http.get<SimpleCompanyResult>(url(`company-edit/${companyUniqueId}`))

    editFormCommitCompany = (companyUniqueId: string, name: string, groups: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-edit-commit`),
            generateFormData({
                companyUniqueId,
                name,
                groups
            }))

    accounts = (page: string, companyUniqueId: string): Observable<AccountsResult> =>
        this.http.get<AccountsResult>(url(`company-accounts/${companyUniqueId}`), { params: { page } })

    addFormCommitNewAccount = (account: NewAccount, companyUniqueId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-account-add-commit/${companyUniqueId}`), account)

    edit = (companyUniqueId: string, id: string): Observable<AccountResult> =>
        this.http.get<AccountResult>(url(`company-account-edit/${companyUniqueId}/${id}`))



    // @PostMapping("/company-account-edit-commit/{companyUniqueId}")
    // @PreAuthorize("hasAnyRole('MASTER_ADMIN')")
    // public OperationStatusRest editFormCommit(Long id, String publicName, boolean enabled, @PathVariable Long companyUniqueId) {
    //     OperationStatusRest operationStatusRest = companyAccountTopLevelService.editFormCommit(id, publicName, enabled, companyUniqueId);
    //     return operationStatusRest;
    // }

    editFormCommit = (id: string, publicName: string, enabled: boolean, companyUniqueId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-account-edit-commit/${companyUniqueId}`),
            generateFormData({
                id, publicName, enabled, companyUniqueId
            }))

    passwordEdit = (accountId: string, companyUniqueId: string): Observable<AccountResult> =>
        this.http.get<AccountResult>(url(`company-account-password-edit/${companyUniqueId}/${accountId}`))

    passwordEditFormCommit = (id: string, password: string, password2: string, companyUniqueId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-account-password-edit-commit/${companyUniqueId}`),
            generateFormData({
                id, password, password2, companyUniqueId
            }))

    editRoles = (accountId: string, companyUniqueId: string): Observable<AccountWithRoleResult> =>
        this.http.get<AccountWithRoleResult>(url(`company-account-edit-roles/${companyUniqueId}/${accountId}`))

    rolesEditFormCommit = (accountId: string, role: string, checkbox: boolean, companyId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-account-edit-roles-commit/${companyId}`),
            generateFormData({
                accountId, role, checkbox, companyId
            }))

    //
    //
    //
    //

    batches = (page: string, companyUniqueId: string): Observable<BatchesResult> =>
        this.http.get<BatchesResult>(url(`batch/company-batches/${companyUniqueId}`), { params: { page } })

    processBatchDelete = (companyUniqueId: string, batchId: string): Observable<BatchData.Status> =>
        this.http.get<BatchData.Status>(url(`batch/company-batch-delete/${companyUniqueId}/${batchId}`))

    processBatchDeleteCommit = (companyUniqueId: string, batchId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`batch/company-batch-delete-commit/${companyUniqueId}`),
            generateFormData({ batchId })
        )

    processBatchesBulkDeleteCommit = (companyUniqueId: string, batchIds: string): Observable<BatchData.BulkOperations> =>
        this.http.post<BatchData.BulkOperations>(
            url(`batch/company-batch-bulk-delete-commit/${companyUniqueId}`),
            generateFormData({ batchIds })
        )

    uploadFile = (companyUniqueId: string, sourceCodeId: string, file: File): Observable<BatchData.UploadingStatus> =>
        this.http.post<BatchData.UploadingStatus>(
            url(`batch/company-batch-upload-from-file/${companyUniqueId}`),
            generateFormData({
                sourceCodeId,
                file
            })
        )

    getBatchStatus = (companyUniqueId: string, batchId: string): Observable<BatchData.Status> =>
        this.http.get<BatchData.Status>(url(`batch/company-batch-status/${companyUniqueId}/${batchId}`))

    downloadProcessingResult = (companyUniqueId: string, batchId: string): Observable<HttpResponse<Blob>> => {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');
        return this.http.get(url(`batch/company-batch-download-result/${companyUniqueId}/${batchId}`), {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }

    downloadOriginFile = (companyUniqueId: string, batchId: string, fileName: string): Observable<HttpResponse<Blob>> => {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');
        return this.http.get(url(`batch/company-batch-download-origin-file/${companyUniqueId}/${batchId}/${fileName}`), {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }

    sourceCodesForCompany = (companyUniqueId: string): Observable<SourceCodesForCompany> =>
        this.http.get<SourceCodesForCompany>(
            url(`batch/company-batch-source-codes/${companyUniqueId}`)
        )

    downloadProcessingResults(list: number[], companyId: string): Observable<boolean> {
        const zipFileName: string = 'result ' + list.toString() + '.zip';
        const zip: JSZip = new JSZip();
        const processable: ProcessableItem[] = list.map(el => ({
            id: el.toString(),
            fileName: 'empty',
            response: null,
            companyId
        }));
        return new Observable<boolean>(sub => {
            from(processable)
                .pipe(
                    concatMap(item => this.downloadProcessingResult(item.companyId, item.id)
                        .pipe(
                            catchError(err => of(err)),
                            this.parseProcessableItemOperator(item),
                        )
                    )
                )
                .subscribe({
                    next: e => { },
                    error: error => sub.error(error),
                    complete: () => {
                        processable.forEach(item => {
                            zip.file(item.fileName, item.response.body);
                        });
                        zip.generateAsync({ type: 'blob' }).then((blob: Blob) => {
                            fileSaver.saveAs(blob, zipFileName);
                        });
                        sub.next(true);
                        sub.complete();
                    }
                });
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
}