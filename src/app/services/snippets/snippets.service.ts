import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

// export * from './response';

@Injectable({ providedIn: 'root' })

export class SnippetsService {
    POST: any;
    GET: any;
    formData: any;
    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/snippet${url}`;
        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string): Observable < any > => this.http.get(base(url));
        this.formData = generateFormData;
    }

    snippets = {
        // @GetMapping("/snippets")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA', 'MANAGER')")
        // public SnippetData.SnippetsResult getSnippets() {
        //     return snippetTopLevelService.getSnippets();
        // }
        get: (page: number | string): Observable < any > =>
            this.GET(`/snippets?page=${page}`)

    };
    snippet = {
        // @PostMapping(value = "/snippet-upload-from-file")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public OperationStatusRest uploadSnippet(final MultipartFile file) {
        //     return snippetTopLevelService.uploadSnippet(file);
        // }
        upload: (file: File): Observable < any > =>
            this.POST(`/snippet-upload-from-file/`, this.formData({ file })),

        // @GetMapping("/snippet-delete/{id}")
        // @PreAuthorize("hasAnyRole('ADMIN', 'DATA')")
        // public OperationStatusRest deleteCommit(@PathVariable Long id) {
        //     return snippetTopLevelService.deleteSnippetById(id);
        // }
        delete: (id: string | number): Observable < any > =>
            this.GET(`/snippet-delete/${id}`)
    };
}