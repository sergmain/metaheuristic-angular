import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountsService {
    POST: any;
    GET: any;
    formData: any;

    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/account${url}`;
        this.POST = (url: string, data: any): Observable < any > => this.http.post(base(url), data);
        this.GET = (url: string, options: any = {}): Observable < any > => this.http.get(base(url), options);
        this.formData = generateFormData;
    }

    accounts = {
        // @GetMapping("/accounts")
        // public AccountData.AccountsResult accounts(@PageableDefault(size = 5) Pageable pageable) {
        //     return accountTopLevelService.getAccounts(pageable);
        // }
        get: (page: number): Observable < object > =>
            this.GET(`/accounts?page=${page}`)
    };

    account = {
        // @GetMapping(value = "/account/{id}")
        // public AccountData.AccountResult getAccount(@PathVariable Long id) {
        //     return accountTopLevelService.getAccount(id);
        // }
        get: (id: string | number): Observable < object > =>
            this.GET(`/account/${id}`),

        // @PostMapping("/account-add-commit")
        // public OperationStatusRest addFormCommit(@RequestBody Account account) {
        //     return accountTopLevelService.addAccount(account);
        // }
        addCommit: (account: object): Observable < object > =>
            this.POST(`/account-add-commit`, account),

        // @PostMapping("/account-edit-commit")
        // public OperationStatusRest editFormCommit(Long id, String publicName, boolean enabled) {
        //     return accountTopLevelService.editFormCommit(id, publicName, enabled);
        // }
        editCommit: (id: string, publicName: string, enabled: boolean): Observable < object > =>
            this.POST(`/account-edit-commit`, this.formData({ id, publicName, enabled })),

        // @PostMapping("/account-password-edit-commit")
        // public OperationStatusRest passwordEditFormCommit(Long id, String password, String password2) {
        //     return accountTopLevelService.passwordEditFormCommit(id, password, password2);
        // }
        passwordEditCommit: (id: string, password: string, password2: string): Observable < object > =>
            this.POST(`/account-password-edit-commit`, this.formData({ id, password, password2 })),

        // @PostMapping("/account-role-commit")
        // public OperationStatusRest roleFormCommit(Long accountId, String roles) {
        //     return accountTopLevelService.roleFormCommit(accountId, roles);
        // }
        roleCommit: (accountId: string, roles: string): Observable < object > =>
            this.POST(`/account-role-commit`, this.formData({ accountId, roles }))
    };
}