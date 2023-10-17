import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { FunctionsService } from '@src/app/services/functions/functions.service';
import { CtFileUploadComponent } from '@src/app/modules/ct/ct-file-upload/ct-file-upload.component';
import {UploadingStatus} from '@app/modules/bundle/bundle-data';

@Component({
    selector: 'add-function',
    templateUrl: './add-function.component.html',
    styleUrls: ['./add-function.component.scss']
})

export class AddFunctionComponent {

    response: UploadingStatus;

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
            .uploadBundle(this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe(
                (response) => {
                    this.response = response;
                    if (!response.errorMessages && !response.infoMessages) {
                        this.cancel();
                    }
                }
            );
    }
}