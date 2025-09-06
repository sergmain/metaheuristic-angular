import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchData } from '@src/app/services/batch/BatchData';
import { BatchService } from '@src/app/services/batch/batch.service';
import { CompanyService } from '@src/app/services/company/company.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';
import { SourceCodesForCompany } from '@src/app/services/source-codes/SourceCodesForCompany';
import { SourceCodeUidsForCompany } from '@src/app/services/source-codes/SourceCodeUidsForCompany';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'company-batch-upload',
    templateUrl: './company-batch-upload.component.html',
    styleUrls: ['./company-batch-upload.component.sass'],
    standalone: false
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

