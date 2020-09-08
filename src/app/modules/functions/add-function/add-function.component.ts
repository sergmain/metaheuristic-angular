import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OperationStatus } from '@src/app/models/OperationStatus';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { FuncrionsService } from '@src/app/services/functions/functions.service';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'add-function',
    templateUrl: './add-function.component.html',
    styleUrls: ['./add-function.component.scss']
})

export class AddFunctionComponent {

    response: OperationStatusRest;

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    constructor(
        private funcrionsService: FuncrionsService,
        private router: Router,
    ) { }

    cancel(): void {
        this.router.navigate(['/dispatcher', 'functions']);
    }

    upload(): void {
        this.funcrionsService.function.upload(this.fileUpload.fileInput.nativeElement.files[0])
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