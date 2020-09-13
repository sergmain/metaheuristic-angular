import { HttpClient } from '@angular/common/http';
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

    xxxxxxx = (): Observable<any> =>
        this.http.get(url(`xxxxxxxxxxxxxxxxxxxxxx`))

    batches = (page: string, companyUniqueId: string): Observable<BatchesResult> =>
        this.http.get<BatchesResult>(url(`batch/company-batches/${companyUniqueId}`), { params: { page } })



    // @GetMapping("/company-batch-delete/{companyUniqueId}/{batchId}")
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR')")
    // public BatchData.Status processBatchDelete(@PathVariable Long companyUniqueId, @PathVariable Long batchId) {
    //     BatchData.Status status = batchTopLevelService.getBatchProcessingStatus(batchId, companyUniqueId, true);
    //     return status;
    // }

    processBatchDelete = (companyUniqueId: string, batchId: string): Observable<BatchData.Status> =>
        this.http.get<BatchData.Status>(url(`batch/company-batch-delete/${companyUniqueId}/${batchId}`))


    // @PostMapping("/company-batch-delete-commit/{companyUniqueId}")
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR')")
    // public OperationStatusRest processBatchDeleteCommit(Long batchId, @PathVariable Long companyUniqueId) {
    //     OperationStatusRest r = batchTopLevelService.processBatchDeleteCommit(batchId, companyUniqueId, false);
    //     return r;
    // }

    processBatchDeleteCommit = (companyUniqueId: string, batchId: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`batch/company-batch-delete-commit/${companyUniqueId}`),
            generateFormData({ batchId })
        )

    // /**
    //  *
    //  * @param batchIds comma-separated list of batchId for deleting
    //  * @param companyUniqueId Company.uniqueId
    //  * @return
    //  */
    // @PostMapping("/company-batch-bulk-delete-commit/{companyUniqueId}")
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR')")
    // public BatchData.BulkOperations processBatchesBulkDeleteCommit(String batchIds, @PathVariable Long companyUniqueId) {
    //     BatchData.BulkOperations r = batchTopLevelService.processBatchBulkDeleteCommit(batchIds, companyUniqueId, false);
    //     return r;
    // }
    processBatchesBulkDeleteCommit = (companyUniqueId: string, batchIds: string): Observable<BatchData.BulkOperations> =>
        this.http.post<BatchData.BulkOperations>(
            url(`batch/company-batch-bulk-delete-commit/${companyUniqueId}`),
            generateFormData({ batchIds })
        )



    // @PostMapping(value = "/company-batch-upload-from-file/{companyUniqueId}")
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR')")
    // public BatchData.UploadingStatus uploadFile(final MultipartFile file, @PathVariable Long companyUniqueId,
    //                                             Long sourceCodeId, Authentication authentication) {
    //     // create context with putting current user to specific company
    //     DispatcherContext context = userContextService.getContext(authentication, companyUniqueId);
    //     BatchData.UploadingStatus uploadingStatus = batchTopLevelService.batchUploadFromFile(file, sourceCodeId, context);
    //     return uploadingStatus;
    // }

    // @GetMapping(value= "/company-batch-status/{companyUniqueId}/{batchId}" )
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR', 'MASTER_SUPPORT')")
    // public BatchData.Status getProcessingResourceStatus(@PathVariable Long companyUniqueId, @PathVariable("batchId") Long batchId) {
    //     BatchData.Status status = batchTopLevelService.getBatchProcessingStatus(batchId, companyUniqueId, true);
    //     return status;
    // }

    // @GetMapping(value= "/company-batch-download-result/{companyUniqueId}/{batchId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR', 'MASTER_SUPPORT')")
    // public HttpEntity<AbstractResource> downloadProcessingResult(
    //         HttpServletRequest request,
    //         @PathVariable Long companyUniqueId, @PathVariable("batchId") Long batchId) throws IOException {
    //     final ResponseEntity<AbstractResource> entity;
    //     try {
    //         CleanerInfo resource = batchTopLevelService.getBatchProcessingResult(batchId, companyUniqueId, true);
    //         if (resource==null) {
    //             return new ResponseEntity<>(Consts.ZERO_BYTE_ARRAY_RESOURCE, HttpStatus.GONE);
    //         }
    //         entity = resource.entity;
    //         request.setAttribute(Consts.RESOURCES_TO_CLEAN, resource.toClean);
    //     } catch (CommonErrorWithDataException e) {
    //         // TODO 2019-10-13 in case of this exception, resources won't be cleaned. Need to re-write
    //         return new ResponseEntity<>(Consts.ZERO_BYTE_ARRAY_RESOURCE, HttpStatus.GONE);
    //     }
    //     return entity;
    // }

    // @SuppressWarnings("TryWithIdenticalCatches")
    // @GetMapping(value= "/company-batch-download-origin-file/{companyUniqueId}/{batchId}/{fileName}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR', 'MASTER_SUPPORT')")
    // public HttpEntity<AbstractResource> downloadOriginFile(
    //         HttpServletRequest request,
    //         @PathVariable Long companyUniqueId,
    //         @PathVariable("batchId") Long batchId,
    //         @SuppressWarnings("unused") @PathVariable("fileName") String fileName) {
    //     final ResponseEntity<AbstractResource> entity;
    //     try {
    //         CleanerInfo resource = batchTopLevelService.getBatchOriginFile(batchId);
    //         if (resource==null) {
    //             return new ResponseEntity<>(Consts.ZERO_BYTE_ARRAY_RESOURCE, HttpStatus.GONE);
    //         }
    //         entity = resource.entity;
    //         request.setAttribute(Consts.RESOURCES_TO_CLEAN, resource.toClean);
    //     } catch (CommonErrorWithDataException e) {
    //         // TODO 2019-10-13 in case of this exception, resources won't be cleaned. Need to re-write
    //         return new ResponseEntity<>(Consts.ZERO_BYTE_ARRAY_RESOURCE, HttpStatus.GONE);
    //     } catch (Throwable e) {
    //         return new ResponseEntity<>(Consts.ZERO_BYTE_ARRAY_RESOURCE, HttpStatus.GONE);
    //     }
    //     return entity;
    // }


}