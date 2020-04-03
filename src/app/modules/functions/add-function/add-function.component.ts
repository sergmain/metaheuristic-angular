import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { FuncrionsService } from '@src/app/services/functions/functions.service';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

@Component({
    selector: 'add-function',
    templateUrl: './add-function.component.html',
    styleUrls: ['./add-function.component.scss']
})

export class AddFunctionComponent {
    readonly states = LoadStates;

    response: DefaultResponse;

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    constructor(
        private funcrionsService: FuncrionsService,
        private location: Location,
        private router: Router,
    ) { }

    cancel() {
        this.location.back();
    }

    upload() {
        const formData: FormData = new FormData();
        formData.append('file', this.fileUpload.fileInput.nativeElement.files[0]);
        this.funcrionsService.function.upload(this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe(
                (response: DefaultResponse) => {
                    this.response = response;
                    if (response.status.toLowerCase() === 'ok') {
                        this.router.navigate(['/dispatcher', 'functions']);
                    }
                }
            );
    }

}