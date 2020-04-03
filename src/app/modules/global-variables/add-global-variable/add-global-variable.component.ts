import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalVariablesService } from '@src/app/services/global-variables/global-variables.service';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

@Component({
    selector: 'add-global-variable',
    templateUrl: './add-global-variable.component.html',
    styleUrls: ['./add-global-variable.component.scss']
})

export class AddGlobalVariableComponent {

    urlResponse: DefaultResponse;
    fileResponse: DefaultResponse;

    uploadForm = new FormGroup({
        poolCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    urlForm = new FormGroup({
        storageUrl: new FormControl('', [Validators.required, Validators.minLength(1)]),
        poolCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    constructor(
        private location: Location,
        private globalVariablesService: GlobalVariablesService,
        private router: Router,
    ) { }

    cancel() {
        this.location.back();
    }

    upload() {
        this.globalVariablesService.variable
            .resourceUploadFromFile(
                this.uploadForm.value.poolCode,
                this.fileUpload.fileInput.nativeElement.files[0]
            )
            .subscribe((response: DefaultResponse) => {
                this.fileResponse = response;
                if (response.errorMessages || response.infoMessages) {
                    //  ???
                } else {
                    this.router.navigate(['/dispatcher', 'global-variables']);
                }
            });
    }

    create() {
        this.globalVariablesService.variable
            .resourceInExternalStorage(this.urlForm.value.poolCode, this.urlForm.value.storageUrl)
            .subscribe(
                (response: DefaultResponse) => {
                    this.urlResponse = response;
                    if (response.errorMessages || response.infoMessages) {
                        //  ???
                    } else {
                        this.router.navigate(['/dispatcher', 'global-variables']);
                    }
                }
            );
    }
}