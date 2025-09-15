import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BatchData } from '@app/services/batch/BatchData';
import { CompanyService } from '@app/services/company/company.service';
import { NgIf } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtPreComponent } from '../../ct/ct-pre/ct-pre.component';

@Component({
    selector: 'company-batch-status',
    templateUrl: './company-batch-status.component.html',
    styleUrls: ['./company-batch-status.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtPreComponent]
})
export class CompanyBatchStatusComponent implements OnInit {
    isLoading: boolean;
    companyUniqueId: string;
    batchId: string;
    batchDataStatus: BatchData.Status;

    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.batchId = this.activatedRoute.snapshot.paramMap.get('batchId');
        this.companyService
            .getBatchStatus(this.companyUniqueId, this.batchId)
            .subscribe({
                next: (batchDataStatus) => this.batchDataStatus = batchDataStatus,
                error: () => this.isLoading = false,
                complete: () => this.isLoading = false
            });
    }
}
