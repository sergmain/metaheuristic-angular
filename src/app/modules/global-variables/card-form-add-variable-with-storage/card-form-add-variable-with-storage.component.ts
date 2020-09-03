import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalVariablesService } from '@src/app/services/global-variables/global-variables.service';
import { Router } from '@angular/router';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

@Component({
    selector: 'card-form-add-variable-with-storage',
    templateUrl: './card-form-add-variable-with-storage.component.html',
    styleUrls: ['./card-form-add-variable-with-storage.component.scss']
})
export class CardFormAddVariableWithStorageComponent {

    @Output() afterResponse: EventEmitter<OperationStatusRest> = new EventEmitter<OperationStatusRest>();
    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    form: FormGroup = new FormGroup({
        storageUrl: new FormControl('', [Validators.required, Validators.minLength(1)]),
        poolCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    constructor(
        private globalVariablesService: GlobalVariablesService,
    ) { }

    create(): void {
        this.globalVariablesService.variable
            .inExternalStorage(this.form.value.poolCode, this.form.value.storageUrl)
            .subscribe((response) => {
                this.afterResponse.emit(response);
            });
    }
}
