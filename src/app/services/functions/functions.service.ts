import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { FunctionsResult } from './FunctionsResult';
import {UploadingStatus} from '@app/modules/bundle/bundle-data';


const url = (s: string): string => `${environment.baseUrl}dispatcher/function/${s}`;
const bundleUrl = (s: string): string => `${environment.baseUrl}dispatcher/bundle/${s}`;


@Injectable({ providedIn: 'root' })
export class FunctionsService {
    constructor(private http: HttpClient) { }


    // @GetMapping("/functions")
    // @PreAuthorize("hasAnyRole('ADMIN', 'DATA', 'MANAGER')")
    // public FunctionData.FunctionsResult getFunctions() {
    //     return functionTopLevelService.getFunctions();
    // }
    getFunctions(page: string): Observable<FunctionsResult> {
        return this.http.get<FunctionsResult>(url('functions'), { params: { page } });
    }


    // @GetMapping("/function-delete/{id}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
    // public OperationStatusRest deleteCommit(@PathVariable Long id) {
    //     return functionTopLevelService.deleteFunctionById(id);
    // }
    deleteCommit(id: string): Observable<OperationStatusRest> {
        return this.http.get<OperationStatusRest>(url(`function-delete/${id}`));
    }


    // @PostMapping(value = "/function-upload-from-file")
    // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
    // public OperationStatusRest uploadFunction(final MultipartFile file) {
    //     return functionTopLevelService.uploadFunction(file);
    // }
    uploadBundle(file: File): Observable<UploadingStatus> {
        return this.http.post<UploadingStatus>(bundleUrl('bundle-upload-from-file'), formData({ file }));
    }

    // String repo, String branch, String commit, String path
    uploadFromGit(repo:string, branch: string, commit: string, path: string): Observable<UploadingStatus> {
        return this.http.post<UploadingStatus>(bundleUrl('bundle-upload-from-git'), formData({ repo, branch, commit, path }));
    }
}