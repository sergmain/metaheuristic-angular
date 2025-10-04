import { Component, output, viewChild, inject, computed } from '@angular/core';
import { SourceCodesService } from '@app/services/source-codes/source-codes.service';
import { MatButton } from '@angular/material/button';
import { SourceCodeResult } from '@app/services/source-codes/SourceCodeResult';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';

@Component({
    standalone : true,
    selector: 'card-form-upload-source-code',
    templateUrl: './card-form-upload-source-code.component.html',
    styleUrls: ['./card-form-upload-source-code.component.sass'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtFileUploadComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
})
export class CardFormUploadSourceCodeComponent {
    private sourceCodesService = inject(SourceCodesService);
    
    button = viewChild(MatButton);
    file = viewChild(CtFileUploadComponent);
    responseChange = output<SourceCodeResult>();
    abort = output<void>();

    // Computed signal for upload button disabled state
    isUploadDisabled = computed(() => {
        const upload = this.file();
        return !upload || upload.filesLength() === 0;
    });

    upload(): void {
        const fileInput = this.file()?.fileInput();
        const file = fileInput?.nativeElement?.files?.[0];

        if (file) {
            this.sourceCodesService
                .uploadSourceCode(file)
                .subscribe(response => {
                    this.responseChange.emit(response);
                });
        }
    }

    cancel(): void {
        this.abort.emit();
    }

    changed(value: string): void {
        console.log('File changed event:', value);
        // No need to manually update button state - the computed signal handles it
    }
}
