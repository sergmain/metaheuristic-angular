import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { Processor } from './Processor';
import { ProcessorResult } from './ProcessorResult';
import { ProcessorsResult } from './ProcessorsResult';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { ProcessorBulkDeleteCommitResult } from './ProcessorBulkDeleteCommitResult';


const url = (s: string): string => `${environment.baseUrl}dispatcher${s}`;


@Injectable({ providedIn: 'root' })

export class ProcessorsService {
    constructor(private http: HttpClient) { }

    init(page: string): Observable<ProcessorsResult> {
        return this.http.get<ProcessorsResult>(url(`/processors`), { params: { page } });
    }

    getProcessor(id: string): Observable<ProcessorResult> {
        return this.http.get<ProcessorResult>(url(`/processor/${id}`));
    }

    formCommit(station: Processor): Observable<ProcessorResult> {
        return this.http.post<ProcessorResult>(url(`/processor-form-commit/`), station);
    }

    deleteProcessorCommit(id: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/processor-delete-commit`), formData({ id }));
    }


    // @PostMapping("/processor-bulk-delete-commit")
    // @PreAuthorize("hasAnyRole('MASTER_OPERATOR')")
    // public ProcessorData.BulkOperations  processProcessorBulkDeleteCommit(String processorIds) {
    //     ProcessorData.BulkOperations  r = processorTopLevelService.processProcessorBulkDeleteCommit(processorIds);
    //     return r;
    // }
    processProcessorBulkDeleteCommit(processorIds: string[]): Observable<ProcessorBulkDeleteCommitResult> {
        return this.http.post<ProcessorBulkDeleteCommitResult>(url('/processor-bulk-delete-commit'), formData({
            processorIds: processorIds.join()
        }));
    }

}