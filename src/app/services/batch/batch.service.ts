import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.reducers';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from '../authentication';
import { SourceCodeUidsForCompany } from '../source-codes/SourceCodeUidsForCompany';
import { newExecStatus } from './batch.actions';
import { BatchesResult } from './BatchesResult';
import { BatchExexStatusComparer } from './BatchExexStatusComparer';
import { ExecStatuses } from './ExecStatuses';
import { Status } from './Status';

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


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @GetMapping("/batches")
    // public BatchData.BatchesResult batches(
    //         @RequestParam(required = false, defaultValue = "false") boolean filterBatches,
    //         @PageableDefault(size = 20) Pageable pageable, Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     return batchTopLevelService.getBatches(pageable, context, false, filterBatches);
    // }
    batches(page: string, filterBatches: boolean): Observable<BatchesResult> {
        return this.http.get<BatchesResult>(
            url(`batches`),
            { params: { page, filterBatches: filterBatches ? 'true' : 'false' } }
        );
    }


    // @GetMapping("/batch-exec-statuses")
    // @PreAuthorize("isAuthenticated()")
    // public BatchData.ExecStatuses batchExecStatuses(Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     return batchTopLevelService.getBatchExecStatuses(context);
    // }
    batchExecStatuses(): Observable<ExecStatuses> {
        return this.http.get<ExecStatuses>(url(`batch-exec-statuses`));
    }


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @PostMapping("/batches-part")
    // public BatchData.BatchesResult batchesPart(
    //         @RequestParam(required = false, defaultValue = "false") boolean filterBatches,
    //         @PageableDefault(size = 20) Pageable pageable, Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     return batchTopLevelService.getBatches(pageable, context, false, filterBatches);
    // }


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @GetMapping(value = "/batch-add")
    // public SourceCodeData.SourceCodeUidsForCompany batchAdd(Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     SourceCodeData.SourceCodeUidsForCompany codes = new SourceCodeData.SourceCodeUidsForCompany();
    //     List<String> uids = dispatcherParamsService.getBatches();
    //     codes.items = sourceCodeSelectorService.getAvailableSourceCodesForCompany(context).items.stream()
    //             .filter(o->uids.contains(o.getUid()))
    //             .map(o->new SourceCodeData.SourceCodeUid(o.getId(), o.getUid()))
    //             .collect(Collectors.toList());
    //     return codes;
    // }
    batchAdd(): Observable<SourceCodeUidsForCompany> {
        return this.http.get<SourceCodeUidsForCompany>(url(`batch-add`));
    }


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @GetMapping("/batch-delete/{batchId}")
    // public BatchData.Status processResourceDelete(@PathVariable Long batchId, Authentication authentication) {
    //     return batchTopLevelService.getBatchProcessingStatus(batchId, userContextService.getContext(authentication).getCompanyId(), false);
    // }
    processResourceDelete(batchId: string): Observable<Status> {
        return this.http.get<Status>(url(`batch-delete/${batchId}`));
    }


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @PostMapping("/batch-delete-commit")
    // public OperationStatusRest processResourceDeleteCommit(Long batchId, Authentication authentication) {
    //     return batchTopLevelService.processBatchDeleteCommit(batchId, userContextService.getContext(authentication), true);
    // }
    processResourceDeleteCommit(batchId: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`batch-delete-commit`), generateFormData({ batchId }));
    }


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @PostMapping(value = "/batch-upload-from-file")
    // public OperationStatusRest uploadFile(final MultipartFile file, Long sourceCodeId, Authentication authentication) {
    //     BatchData.UploadingStatus uploadingStatus = batchTopLevelService.batchUploadFromFile(file, sourceCodeId, userContextService.getContext(authentication));
    //     if (uploadingStatus.isErrorMessages()) {
    //         return new OperationStatusRest(EnumsApi.OperationStatus.ERROR, Objects.requireNonNull(uploadingStatus.getErrorMessages()));
    //     }
    //     return OperationStatusRest.OPERATION_STATUS_OK;
    // }
    uploadFile(sourceCodeId: string, file: File): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`batch-upload-from-file`), generateFormData({ file, sourceCodeId }));
    }


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @GetMapping(value= "/batch-status/{batchId}" )
    // public BatchData.Status getProcessingResourceStatus(@PathVariable("batchId") Long batchId, Authentication authentication) {
    //     return batchTopLevelService.getBatchProcessingStatus(batchId, userContextService.getContext(authentication).getCompanyId(), false);
    // }
    getProcessingResourceStatus(batchId: string): Observable<Status> {
        return this.http.get<Status>(url(`batch-status/${batchId}`));
    }


    // @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'MANAGER')")
    // @GetMapping(value= "/batch-download-result/{batchId}/{fileName}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    // public HttpEntity<AbstractResource> downloadProcessingResult(
    //         HttpServletRequest request, @PathVariable("batchId") Long batchId,
    //         @SuppressWarnings("unused") @PathVariable("fileName") String fileName, Authentication authentication) throws IOException {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     final ResponseEntity<AbstractResource> entity;
    //     try {
    //         CleanerInfo resource = batchTopLevelService.getBatchProcessingResult(batchId, context.getCompanyId(), false);
    //         if (resource==null) {
    //             return new ResponseEntity<>(Consts.ZERO_BYTE_ARRAY_RESOURCE, HttpStatus.GONE);
    //         }
    //         entity = resource.entity;
    //         request.setAttribute(Consts.RESOURCES_TO_CLEAN, resource.toClean);
    //     } catch (CommonErrorWithDataException e) {
    //         return new ResponseEntity<>(Consts.ZERO_BYTE_ARRAY_RESOURCE, HttpStatus.GONE);
    //     }
    //     return entity;
    // }


    //
    //
    //
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
                base.batchExecStatuses().subscribe({
                    next: content => {
                        base.batchExexStatusComparer.takeApart(content.statuses);
                        if (base.intervalStarted) {
                            setTimeout(() => { fn(); }, interval);
                        }
                        base.store.dispatch(newExecStatus({ payload: content.statuses }));
                    },
                    error: () => { }
                });
            }
        }
    }
}