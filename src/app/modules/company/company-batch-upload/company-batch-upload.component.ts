import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchData } from '@src/app/models/data/BatchData';
import { BatchService } from '@src/app/services/batch/batch.service';
import { CompanyService } from '@src/app/services/company/company.service';
import { SourceCodeUidsForCompany } from '@src/app/services/source-codes/SourceCodeUidsForCompany';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'company-batch-upload',
    templateUrl: './company-batch-upload.component.html',
    styleUrls: ['./company-batch-upload.component.sass']
})
export class CompanyBatchUploadComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    batchId: string;
    companyUniqueId: string;
    sourceCodeUidsForCompany: SourceCodeUidsForCompany;
    sourceCode: string;
    file: File;
    batchDataUploadingStatus: BatchData.UploadingStatus;
    constructor(
        private companyService: CompanyService,
        private batchService: BatchService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.batchId = this.activatedRoute.snapshot.paramMap.get('batchId');
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');

        this.batchService.batch
            .add()
            .subscribe((sourceCodeUidsForCompany: SourceCodeUidsForCompany) => {
                this.sourceCodeUidsForCompany = sourceCodeUidsForCompany;
            });
    }

    fileUploadChanged(): void {
        this.file = this.fileUpload.fileInput.nativeElement.files[0] || false;
    }

    upload(): void {
        this.companyService
            .uploadFile(this.companyUniqueId)
            .subscribe(batchDataUploadingStatus => {
                this.batchDataUploadingStatus = batchDataUploadingStatus;
            });
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
}

