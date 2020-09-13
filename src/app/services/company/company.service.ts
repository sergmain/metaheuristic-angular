import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { SimpleCompaniesResult } from './SimpleCompaniesResult';
import { SimpleCompanyResult } from './SimpleCompanyResult';
import { NewAccount, AccountsResult, AccountResult } from '../accounts';
import { AccountWithRoleResult } from './AccountWithRoleResult';
import { BatchesResult } from '../batch/BatchesResult';
import { BatchData } from '@src/app/models/data/BatchData';

const url = (s: string): string => `${environment.baseUrl}dispatcher/company/${s}`;

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

    editFormCommitAccount = (id: string, publicName: string, enabled: boolean, companyUniqueId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-account-edit-commit/${companyUniqueId}`),
            generateFormData({

            }))

    passwordEdit = (accountId: string, companyUniqueId: string): Observable<AccountResult> =>
        this.http.get<AccountResult>(url(`company-account-password-edit/${companyUniqueId}/${accountId}`))

    passwordEditFormCommit = (id: string, password: string, password2: string, companyUniqueId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-account-password-edit-commit/${companyUniqueId}`),
            generateFormData({

            }))

    editRoles = (accountId: string, companyUniqueId: string): Observable<AccountWithRoleResult> =>
        this.http.get<AccountWithRoleResult>(url(`company-account-edit-roles/${companyUniqueId}/${accountId}`))

    rolesEditFormCommit = (accountId: string, role: string, checkbox: boolean, companyId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`company-account-edit-roles-commit/${companyId}`),
            generateFormData({
                accountId,
                role,
                checkbox,
                companyId
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

    uploadFile = (companyUniqueId: string): Observable<BatchData.UploadingStatus> =>
        this.http.get<BatchData.UploadingStatus>(url(`batch/company-batch-upload-from-file/${companyUniqueId}`))

    getProcessingResourceStatus = (companyUniqueId: string, batchId: string): Observable<BatchData.Status> =>
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
}