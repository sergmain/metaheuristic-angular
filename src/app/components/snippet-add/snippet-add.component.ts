import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { DefaultResponse } from '@app/models/';
import { SnippetsService } from '@app/services/snippets/snippets.service';
import { CtFileUploadComponent } from '@src/app/ct';

@Component({
    selector: 'snippet-add',
    templateUrl: './snippet-add.component.html',
    styleUrls: ['./snippet-add.component.scss']
})

export class SnippetAddComponent {
    readonly states = LoadStates;

    response: DefaultResponse;

    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    constructor(
        private snippetsService: SnippetsService,
        private location: Location,
        private router: Router,
    ) {}

    cancel() {
        this.location.back();
    }

    upload() {
        const formData: FormData = new FormData();
        formData.append('file', this.fileUpload.fileInput.nativeElement.files[0]);
        console.log(this.fileUpload.fileInput.nativeElement.files[0]);
        this.snippetsService.snippet.upload(this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe(
                (response: DefaultResponse) => {
                    this.response = response;
                    if (response.status.toLowerCase() === 'ok') {
                        this.router.navigate(['/launchpad', 'snippets']);
                    }
                }
            );
    }

}