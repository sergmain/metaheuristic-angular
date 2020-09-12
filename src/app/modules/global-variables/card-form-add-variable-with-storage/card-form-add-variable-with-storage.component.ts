import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalVariablesService } from '@src/app/services/global-variables/global-variables.service';

@Component({
    selector: 'card-form-add-variable-with-storage',
    templateUrl: './card-form-add-variable-with-storage.component.html',
    styleUrls: ['./card-form-add-variable-with-storage.component.scss']
})
export class CardFormAddVariableWithStorageComponent {

    @Output() afterResponse: EventEmitter<OperationStatusRest> = new EventEmitter<OperationStatusRest>();
    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;
    @Output() abort: EventEmitter<void> = new EventEmitter<void>();

    form: FormGroup = new FormGroup({
        params: new FormControl('', [Validators.required, Validators.minLength(1)]),
        poolCode: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    constructor(
        private globalVariablesService: GlobalVariablesService,
    ) { }

    create(): void {
        this.globalVariablesService.variable
            .inExternalStorage(this.form.value.poolCode, this.form.value.params)
            .subscribe((response) => {
                this.afterResponse.emit(response);
            });
    }

    cancel(): void {
        this.abort.emit();
    }
}
