import { Component, OnInit, inject, signal } from '@angular/core';
import { AccountResult } from '@app/services/accounts';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { FormGroup, FormControl, Validators, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '@app/services/company/company.service';
import { OperationStatus } from '@app/enums/OperationStatus';
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
    selector: 'account-add',
    templateUrl: './account-add.component.html',
    styleUrls: ['./account-add.component.sass'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent]
})
export class AccountAddComponent implements OnInit {
      private activatedRoute = inject(ActivatedRoute);
      private companyService = inject(CompanyService);
      private router = inject(Router);
    accountResult: AccountResult;
    companyUniqueId: string;
    operationStatusRest = signal<OperationStatusRest | undefined>(undefined);
    isLoading = signal<boolean | undefined>(undefined);
    isDone = signal<boolean | undefined>(undefined);

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

    ngOnInit(): void {
        this.isDone.set(false);
        this.isLoading.set(true);
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.isLoading.set(false);

    }

    back(): void {
        this.router.navigate(['../../', 'accounts'], { relativeTo: this.activatedRoute });
    }

    createAccount(): void {
        this.isLoading.set(true);
        this.companyService
            .addFormCommitNewAccount({
                username: this.form.value.username,
                password: this.form.value.password,
                password2: this.form.value.password2,
                publicName: this.form.value.publicName
            }, this.companyUniqueId)
            .subscribe({
                next: (operationStatusRest) => {
                    this.operationStatusRest.set(operationStatusRest);
                },
                complete: () => {
                    if (this.operationStatusRest().status === OperationStatus.OK) {
                        this.isDone.set(true);
                        this.form.reset();
                    }
                    this.isLoading.set(false);
                }
            });
    }
}
