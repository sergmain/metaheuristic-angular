import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalVariablesService } from '@app/services/global-variables/global-variables.service';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'card-form-add-variable-with-storage',
    templateUrl: './card-form-add-variable-with-storage.component.html',
    styleUrls: ['./card-form-add-variable-with-storage.component.scss'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, FormsModule, ReactiveFormsModule, CtSectionBodyRowComponent, MatFormField, MatLabel, MatInput, MatHint, CtSectionContentComponent, CdkTextareaAutosize, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
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
        this.globalVariablesService
            .registerResourceInExternalStorage(this.form.value.poolCode, this.form.value.params)
            .subscribe((response) => {
                this.afterResponse.emit(response);
            });
    }

    cancel(): void {
        this.abort.emit();
    }
}
