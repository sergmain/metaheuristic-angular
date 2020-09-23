import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { ExperimentResultService } from '@src/app/services/experiment-result/experiment-result.service';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'experiment-result-import',
    templateUrl: './experiment-result-import.component.html',
    styleUrls: ['./experiment-result-import.component.sass']
})
export class ExperimentResultImportComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    operationStatusRest: OperationStatusRest;

    constructor(
        private experimentResultService: ExperimentResultService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
    }

    importFile(): void {
        this.experimentResultService
            .uploadFromFile(this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe({
                next: (operationStatusRest) => {
                    if (operationStatusRest.status === OperationStatus.OK) {
                        this.fileUpload.removeFile();
                    }
                    this.operationStatusRest = operationStatusRest;
                }
            });
    }

    back(): void {
        this.router.navigate(['../../', 'experiments'], { relativeTo: this.activatedRoute });
    }

}
