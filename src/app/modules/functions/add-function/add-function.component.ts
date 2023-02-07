import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { FunctionsService } from '@src/app/services/functions/functions.service';
import { CtFileUploadComponent } from '@src/app/modules/ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'add-function',
    templateUrl: './add-function.component.html',
    styleUrls: ['./add-function.component.scss']
})

export class AddFunctionComponent {

    response: OperationStatusRest;

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    constructor(
        private functionsService: FunctionsService,
        private router: Router,
    ) { }

    cancel(): void {
        this.router.navigate(['/dispatcher', 'functions']);
    }

    upload(): void {
        this.functionsService
            .uploadFunction(this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe(
                (response) => {
                    this.response = response;
                    if (response.status === OperationStatus.OK) {
                        this.cancel();
                    }
                }
            );
    }
}