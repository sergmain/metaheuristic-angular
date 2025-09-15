import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { GlobalVariablesService } from '@app/services/global-variables/global-variables.service';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatHint, MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';

@Component({
    standalone : true,
    selector: 'card-form-add-variable',
    templateUrl: './card-form-add-variable.component.html',
    styleUrls: ['./card-form-add-variable.component.scss'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, FormsModule, ReactiveFormsModule, CtSectionBodyRowComponent, CtFileUploadComponent, MatHint, MatFormField, MatLabel, MatInput, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
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
        this.globalVariablesService
            .createResourceFromFile(
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
