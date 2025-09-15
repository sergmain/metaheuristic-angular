import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchData } from '@app/services/batch/BatchData';
import { BatchService } from '@app/services/batch/batch.service';
import { CompanyService } from '@app/services/company/company.service';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodesForCompany } from '@app/services/source-codes/SourceCodesForCompany';
import { SourceCodeUidsForCompany } from '@app/services/source-codes/SourceCodeUidsForCompany';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { NgIf, NgFor } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { CtHintComponent } from '../../ct/ct-hint/ct-hint.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'company-batch-upload',
    templateUrl: './company-batch-upload.component.html',
    styleUrls: ['./company-batch-upload.component.sass'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, MatFormField, MatLabel, MatSelect, FormsModule, NgFor, MatOption, MatHint, CtFileUploadComponent, CtHintComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent, TranslateModule]
})
export class CompanyBatchUploadComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    batchId: string;
    companyUniqueId: string;
    sourceCodesForCompany: SourceCodesForCompany;
    sourceCode: SourceCode;
    file: File;
    batchDataUploadingStatus: BatchData.UploadingStatus;
    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.batchId = this.activatedRoute.snapshot.paramMap.get('batchId');
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');

        this.companyService
            .sourceCodesForCompany(this.companyUniqueId)
            .subscribe(sourceCodesForCompany => {
                this.sourceCodesForCompany = sourceCodesForCompany;
            });
    }

    fileUploadChanged(): void {
        this.file = this.fileUpload.fileInput.nativeElement.files[0] || false;
    }

    upload(): void {
        this.companyService
            .uploadFile(this.companyUniqueId, this.sourceCode.id.toString(), this.file)
            .subscribe(batchDataUploadingStatus => {
                this.batchDataUploadingStatus = batchDataUploadingStatus;
            });
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
}

