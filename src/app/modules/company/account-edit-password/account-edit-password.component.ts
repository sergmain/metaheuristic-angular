import { Component, OnInit } from '@angular/core';
import { CompanyService } from '@app/services/company/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountResult } from '@app/services/accounts/AccountResult';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { NgIf } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'account-edit-password',
    templateUrl: './account-edit-password.component.html',
    styleUrls: ['./account-edit-password.component.sass'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent]
})
export class AccountEditPasswordComponent implements OnInit {
    accountResult: AccountResult;
    accoundId: string;
    companyUniqueId: string;
    operationStatusRest: OperationStatusRest;

    form = new FormGroup({
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

    isLoading: boolean;
    constructor(
        private activatedRoute: ActivatedRoute,
        private companyService: CompanyService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.accoundId = this.activatedRoute.snapshot.paramMap.get('accountId');
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.companyService
            .passwordEdit(this.accoundId, this.companyUniqueId)
            .subscribe({
                next: accountResult => this.accountResult = accountResult,
                complete: () => this.isLoading = false
            });
    }


    back(): void {
        this.router.navigate(['../../../', 'accounts'], { relativeTo: this.activatedRoute });
    }

    saveChanges(): void {
        this.isLoading = true;
        this.companyService
            .passwordEditFormCommit(this.accoundId, this.form.value.password, this.form.value.password2, this.companyUniqueId)
            .subscribe({
                next: operationStatusRest => this.operationStatusRest = operationStatusRest,
                complete: () => this.isLoading = false
            });
    }

}
