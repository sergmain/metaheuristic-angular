import { Component } from '@angular/core';
import { CompanyService } from '@app/services/company/company.service';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
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
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'company-add',
    templateUrl: './company-add.component.html',
    styleUrls: ['./company-add.component.sass'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, FormsModule, ReactiveFormsModule, CtSectionBodyRowComponent, MatFormField, MatLabel, MatInput, MatHint, MatButton, RouterLink, CtRestStatusComponent]
})
export class CompanyAddComponent {
    operationStatusRest: OperationStatusRest;

    form: FormGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(1)
        ]),
    });

    constructor(
        private companyService: CompanyService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    createCompany(): void {
        this.companyService
            .addFormCommitCompany(this.form.value.name)
            .subscribe((operationStatusRest) => {
                if (operationStatusRest.status === OperationStatus.OK) {
                    this.back();
                } else {
                    this.operationStatusRest = operationStatusRest;
                }
            });
    }
    back(): void {
        this.router.navigate(['../', 'companies'], { relativeTo: this.activatedRoute });
    }
}
