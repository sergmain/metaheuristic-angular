import { Component, OnInit } from '@angular/core';
import { AccountResult } from '@src/app/services/accounts';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '@src/app/services/company/company.service';
import { OperationStatus } from '@src/app/enums/OperationStatus';

@Component({
    selector: 'account-add',
    templateUrl: './account-add.component.html',
    styleUrls: ['./account-add.component.sass'],
    standalone: false
})
export class AccountAddComponent implements OnInit {
    accountResult: AccountResult;
    companyUniqueId: string;
    operationStatusRest: OperationStatusRest;
    isLoading: boolean;
    isDone: boolean;

    form = new FormGroup({
        publicName: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        username: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        password2: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            (control: FormControl): ValidationErrors | null => {
                const group: FormGroup = this.form;
                if (group) {
                    return (group.value.password === control.value) ? null : {
                        notSame: true
                    };
                }
                return null;
            }
        ]),
    });

    constructor(
        private activatedRoute: ActivatedRoute,
        private companyService: CompanyService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.isDone = false;
        this.isLoading = true;
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.isLoading = false;

    }

    back(): void {
        this.router.navigate(['../../', 'accounts'], { relativeTo: this.activatedRoute });
    }

    createAccount(): void {
        this.isLoading = true;
        this.companyService
            .addFormCommitNewAccount({
                username: this.form.value.username,
                password: this.form.value.password,
                password2: this.form.value.password2,
                publicName: this.form.value.publicName
            }, this.companyUniqueId)
            .subscribe({
                next: (operationStatusRest) => this.operationStatusRest = operationStatusRest,
                complete: () => {
                    if (this.operationStatusRest.status === OperationStatus.OK) {
                        this.isDone = true;
                        this.form.reset();
                    }
                    this.isLoading = false;
                }
            });
    }
}
