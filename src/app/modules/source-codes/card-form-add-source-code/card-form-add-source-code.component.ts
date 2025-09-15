import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SourceCodesService } from '@app/services/source-codes/source-codes.service';
import { SourceCodeResult } from '@app/services/source-codes/SourceCodeResult';
import { MatButton } from '@angular/material/button';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';

@Component({
    standalone : true,
    selector: 'card-form-add-source-code',
    templateUrl: './card-form-add-source-code.component.html',
    styleUrls: ['./card-form-add-source-code.component.scss'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, FormsModule, ReactiveFormsModule, CtSectionBodyRowComponent, MatFormField, MatLabel, MatInput, CdkTextareaAutosize, MatHint, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
})
export class CardFormAddSourceCodeComponent {
    @ViewChild(MatButton) button: MatButton;
    @Output() responseChange: EventEmitter<SourceCodeResult> = new EventEmitter<SourceCodeResult>();
    @Output() abort: EventEmitter<void> = new EventEmitter<void>();


    form: FormGroup = new FormGroup({
        source: new FormControl('', [
            Validators.required,
            Validators.minLength(1)
        ]),
    });

    constructor(
        private sourceCodesService: SourceCodesService
    ) { }

    cancel(): void {
        this.abort.emit();
    }

    create(): void {
        this.button.disabled = true;
        this.sourceCodesService
            .addFormCommit(this.form.value.source)
            .subscribe(sourceCodeResult => {
                this.button.disabled = false;
                this.responseChange.emit(sourceCodeResult);
            });
    }
}
