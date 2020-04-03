import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import { response } from './response';

const url = (s: string): string => `${environment.baseUrl}dispatcher/global-variable${s}`;

@Injectable({ providedIn: 'root' })
export class GlobalVariablesService {
    constructor(
        private http: HttpClient
    ) { }

    variables = {
        get: (page: string): Observable<response.globalVariables.Get> =>
            this.http.get<response.globalVariables.Get>(url('/resources'), { params: { page } })
    };

    variable = {
        //     // @PostMapping(value = "/resource-upload-from-file-with-params/{resourcePoolCode}")
        //     // public OperationStatusRest createResourceFromFileWithParams(
        //     //         MultipartFile file, @PathVariable String resourcePoolCode) {
        //     //     return resourceTopLevelService.createResourceFromFile(file, resourcePoolCode, null);
        //     // }
        //     resourceUploadFromFileWithParams: (resourcePoolCode: string, file: File): Observable<any> =>
        //         this.POST(`/resource-upload-from-file-with-params/${resourcePoolCode}`, this.formData({ file })),


        //     // @PostMapping(value = "/resource-upload-from-file", headers = ("content-type=multipart/*"), produces = "application/json", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
        //     // public OperationStatusRest createResourceFromFile(
        //     //         @RequestPart MultipartFile file,
        //     //         @RequestParam(name = "code") String resourceCode,
        //     //         @RequestParam(name = "poolCode") String resourcePoolCode ) {
        //     //     return resourceTopLevelService.createResourceFromFile(file, resourcePoolCode, resourceCode);
        //     // }
        upload: (code: string, poolCode: string, file: File): Observable<any> =>
            this.http.post(url(`/resource-upload-from-file`), formData({ code, poolCode, file })),

        //     // @PostMapping(value = "/resource-in-external-storage")
        //     // public OperationStatusRest registerResourceInExternalStorage(
        //     //         @RequestParam(name = "poolCode") String resourcePoolCode,
        //     //         @RequestParam(name = "storageUrl") String storageUrl ) {
        //     //     return resourceTopLevelService.registerResourceInExternalStorage(resourcePoolCode, storageUrl);
        //     // }
        external: (poolCode: string, storageUrl: string): Observable<any> =>
            this.http.post(url(`/resource-in-external-storage`), formData({ poolCode, storageUrl })),


        //     // @GetMapping("/resource/{id}")
        //     // public ResourceData.ResourceResult get(@PathVariable Long id) {
        //     //     return resourceTopLevelService.getResourceById(id);
        //     // }
        //     get: (id: string | number): Observable<any> =>
        //         this.GET(`/resource/${id}`),

        delete: (id: string): Observable<any> =>
            this.http.post(url(`/resource-delete-commit`), formData({ id }))
    };
}