import { Component, output, viewChild, inject, computed } from '@angular/core';
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
    private globalVariablesService = inject(GlobalVariablesService);
    
    afterResponse = output<OperationStatusRest>();
    abort = output<void>();

    fileUpload = viewChild<CtFileUploadComponent>('fileUpload');

    form: FormGroup = new FormGroup({
        poolCode: new FormControl('', [
            Validators.required,
            Validators.minLength(1)
        ]),
    });

    // Computed signal for upload button disabled state
    isUploadDisabled = computed(() => {
        const upload = this.fileUpload();
        return !this.form.valid || !upload || upload.filesLength() === 0;
    });

    upload(): void {
        const file = this.fileUpload()?.fileInput()?.nativeElement.files[0];
        if (!this.form.value.poolCode || !file) {
            return; // Prevent upload if no poolCode or file
        }
        this.globalVariablesService
            .createResourceFromFile(this.form.value.poolCode, file)
            .subscribe((response: OperationStatusRest) => {
                this.afterResponse.emit(response);
            });
    }

    cancel(): void {
        this.abort.emit();
    }
}
