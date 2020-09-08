import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCodeResult } from '@src/app/services/source-codes/SourceCodeResult';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'card-form-add-source-code',
    templateUrl: './card-form-add-source-code.component.html',
    styleUrls: ['./card-form-add-source-code.component.scss']
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
        this.sourceCodesService.sourceCode.add(this.form.value.source).subscribe(response => {
            this.button.disabled = false;
            this.responseChange.emit(response);
        });
    }
}
