import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';

export * from './response';

@Injectable({ providedIn: 'root' })

export class ResourcesService {
    POST: any;
    GET: any;
    formData: any;
    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}dispatcher/resource${url}`;
        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string): Observable < any > => this.http.get(base(url));
        this.formData = generateFormData;
    }

    resources = {
        // @GetMapping("/resources")
        // public ResourceData.ResourcesResult getResources(@PageableDefault(size = 5) Pageable pageable) {
        //     return resourceTopLevelService.getResources(pageable);
        // }
        get: (page: string | number): Observable < any > =>
            this.GET(`/resources?page=${page}`)
    };

    resource = {
        // @PostMapping(value = "/resource-upload-from-file-with-params/{resourcePoolCode}")
        // public OperationStatusRest createResourceFromFileWithParams(
        //         MultipartFile file, @PathVariable String resourcePoolCode) {
        //     return resourceTopLevelService.createResourceFromFile(file, resourcePoolCode, null);
        // }
        resourceUploadFromFileWithParams: (resourcePoolCode: string, file: File): Observable < any > =>
            this.POST(`/resource-upload-from-file-with-params/${resourcePoolCode}`, this.formData({ file })),


        // @PostMapping(value = "/resource-upload-from-file", headers = ("content-type=multipart/*"), produces = "application/json", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
        // public OperationStatusRest createResourceFromFile(
        //         @RequestPart MultipartFile file,
        //         @RequestParam(name = "code") String resourceCode,
        //         @RequestParam(name = "poolCode") String resourcePoolCode ) {
        //     return resourceTopLevelService.createResourceFromFile(file, resourcePoolCode, resourceCode);
        // }
        upload: (code: string, poolCode: string, file: File): Observable < any > =>
            this.POST(`/resource-upload-from-file`, this.formData({ code, poolCode, file })),

        // @PostMapping(value = "/resource-in-external-storage")
        // public OperationStatusRest registerResourceInExternalStorage(
        //         @RequestParam(name = "poolCode") String resourcePoolCode,
        //         @RequestParam(name = "storageUrl") String storageUrl ) {
        //     return resourceTopLevelService.registerResourceInExternalStorage(resourcePoolCode, storageUrl);
        // }
        external: (poolCode: string, storageUrl: string): Observable < any > =>
            this.POST(`/resource-in-external-storage`, this.formData({ poolCode, storageUrl })),

        // @GetMapping("/resource/{id}")
        // public ResourceData.ResourceResult get(@PathVariable Long id) {
        //     return resourceTopLevelService.getResourceById(id);
        // }
        get: (id: string | number): Observable < any > =>
            this.GET(`/resource/${id}`),


        // @PostMapping("/resource-delete-commit")
        // public OperationStatusRest deleteResource(Long id) {
        //     return resourceTopLevelService.deleteResource(id);
        // }
        delete: (id: string | number): Observable < any > =>
            this.POST(`/resource-delete-commit`, this.formData({ id }))
    };
}