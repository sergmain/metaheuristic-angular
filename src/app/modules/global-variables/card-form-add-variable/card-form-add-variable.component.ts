import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { GlobalVariablesService } from '@src/app/services/global-variables/global-variables.service';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'card-form-add-variable',
    templateUrl: './card-form-add-variable.component.html',
    styleUrls: ['./card-form-add-variable.component.scss']
})
export class CardFormAddVariableComponent {
    @Output() afterResponse: EventEmitter<OperationStatusRest> = new EventEmitter<OperationStatusRest>();
    @Output() abort: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;

    form: FormGroup = new FormGroup({
        poolCode: new FormControl('', [
            Validators.required,
            Validators.minLength(1)
        ]),
    });

    constructor(
        private globalVariablesService: GlobalVariablesService,
    ) { }

    upload(): void {
        this.globalVariablesService.variable
            .uploadFromFile(
                this.form.value.poolCode,
                this.fileUpload.fileInput.nativeElement.files[0]
            )
            .subscribe((response: OperationStatusRest) => {
                this.afterResponse.emit(response);
            });
    }

    cancel(): void {
        this.abort.emit();
    }

    checkDisable(): boolean {
        if (this.form.valid && this.fileUpload.fileInput.nativeElement.files.length) {
            return false;
        }
        return true;
    }
}
