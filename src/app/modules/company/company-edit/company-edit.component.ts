import { Component, OnInit, inject, signal } from '@angular/core';
import { CompanyService } from '@app/services/company/company.service';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SimpleCompanyResult } from '@app/services/company/SimpleCompanyResult';
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
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'company-edit',
    templateUrl: './company-edit.component.html',
    styleUrls: ['./company-edit.component.sass'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, MatFormField, MatLabel, MatInput, FormsModule, MatHint, MatButton, RouterLink, CtRestStatusComponent]
})
export class CompanyEditComponent implements OnInit {
      private companyService = inject(CompanyService);
      private activatedRoute = inject(ActivatedRoute);
      private router = inject(Router);
    companyUniqueId: string;
    name = signal<string | undefined>(undefined);
    groups = signal<string | undefined>(undefined);
    operationStatusRest = signal<OperationStatusRest | undefined>(undefined);
    simpleCompanyResult = signal<SimpleCompanyResult | undefined>(undefined);

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.companyService
            .editCompany(this.companyUniqueId)
            .subscribe(simpleCompanyResult => {
                this.simpleCompanyResult.set(simpleCompanyResult);
                this.name.set(simpleCompanyResult.company.name);
                this.groups.set(simpleCompanyResult.companyAccessControl.groups);
            });
    }

    saveChanges(): void {
        this.companyService
            .editFormCommitCompany(this.companyUniqueId, this.name(), this.groups())
            .subscribe(operationStatusRest => {
                if (operationStatusRest.status === OperationStatus.OK) {
                    this.back();
                } else {
                    this.operationStatusRest.set(operationStatusRest);
                }
            });
    }
    back(): void {
        this.router.navigate(['../../companies'], { relativeTo: this.activatedRoute });
    }
}
