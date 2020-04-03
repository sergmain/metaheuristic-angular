import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourcesService } from '@app/services/resources/resources.service';
import { CtFileUploadComponent } from '@src/app/modules/ct/ct-file-upload/ct-file-upload.component';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

@Component({
    selector: 'resource-add',
    templateUrl: './resource-add.component.html',
    styleUrls: ['./resource-add.component.scss'] 
})

export class ResourceAddComponent {

    urlResponse: DefaultResponse;
    fileResponse: DefaultResponse;

    uploadForm = new FormGroup({
        code: new FormControl('', []),
        poolCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    urlForm = new FormGroup({
        storageUrl: new FormControl('', [Validators.required, Validators.minLength(1)]),
        poolCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    constructor(
        private location: Location,
        private resourcesService: ResourcesService,
        private router: Router,
    ) {}

    cancel() {
        this.location.back();
    }

    upload() {
        this.resourcesService.resource
            .upload(
                this.uploadForm.value.code,
                this.uploadForm.value.poolCode,
                this.fileUpload.fileInput.nativeElement.files[0]
            )
            .subscribe((response: DefaultResponse) => {
                this.fileResponse = response;
                if (response.errorMessages || response.infoMessages) {
                    //  ???
                } else {
                    this.router.navigate(['/dispatcher', 'resources']);
                }
            });
    }

    create() {
        this.resourcesService.resource
            .external(this.urlForm.value.poolCode, this.urlForm.value.storageUrl)
            .subscribe(
                (response: DefaultResponse) => {
                    this.urlResponse = response;
                    if (response.errorMessages || response.infoMessages) {
                        //  ???
                    } else {
                        this.router.navigate(['/dispatcher', 'resources']);
                    }
                }
            );
    }
}