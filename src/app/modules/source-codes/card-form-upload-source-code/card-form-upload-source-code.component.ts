import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { MatButton } from '@angular/material/button';
import { SourceCodeResult } from '@src/app/services/source-codes/SourceCodeResult';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'card-form-upload-source-code',
    templateUrl: './card-form-upload-source-code.component.html',
    styleUrls: ['./card-form-upload-source-code.component.sass']
})
export class CardFormUploadSourceCodeComponent {
    @ViewChild(MatButton) button: MatButton;
    @ViewChild(CtFileUploadComponent) file: CtFileUploadComponent;
    @Output() responseChange: EventEmitter<SourceCodeResult> = new EventEmitter<SourceCodeResult>();

    constructor(
        private sourceCodesService: SourceCodesService
    ) { }

    upload(): void {
        this.sourceCodesService.sourceCode
            .uploadFromFile(this.file.fileInput.nativeElement.files[0])
            .subscribe(response => {
                this.responseChange.emit(response);
            });
    }

    changed(value: string): void {
        if ((this.file.fileInput.nativeElement as HTMLInputElement).files.length) {
            this.button.disabled = false;
        } else {
            this.button.disabled = true;
        }
    }
}
