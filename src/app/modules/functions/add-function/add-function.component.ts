import { Component, viewChild, inject, signal, computed } from '@angular/core';
import {Router} from '@angular/router';
import {FunctionsService} from '@app/services/functions/functions.service';
import {CtFileUploadComponent} from '@app/modules/ct/ct-file-upload/ct-file-upload.component';
import {UploadingStatus} from '@app/modules/bundle/bundle-data';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButton} from '@angular/material/button';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';

@Component({
    standalone : true,
    selector: 'add-function',
    templateUrl: './add-function.component.html',
    styleUrls: ['./add-function.component.scss'],
    imports: [CtFileUploadComponent, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput]
})

export class AddFunctionComponent {
    private functionsService = inject(FunctionsService);
    private router = inject(Router);
    
    response = signal<UploadingStatus | undefined>(undefined);

    fileUpload = viewChild<CtFileUploadComponent>('fileUpload');
    button = viewChild<MatButton>('button');

    // Computed signal for upload button disabled state
    isUploadDisabled = computed(() => {
        const upload = this.fileUpload();
        return !upload || upload.filesLength() === 0;
    });

    form: FormGroup = new FormGroup({
        repo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('https?:\\/\\/.*')]),
        branch: new FormControl('', [Validators.required, Validators.minLength(1)]),
        commit: new FormControl('', [Validators.required, Validators.minLength(1)]),
        path: new FormControl('' )
    });

    cancel(): void {
        this.router.navigate(['/dispatcher', 'functions']);
    }

    upload(): void {
        const fileInput = this.fileUpload()?.fileInput();
        const file = fileInput?.nativeElement?.files?.[0];
        if (file) {
            this.functionsService
                .uploadBundle(file)
                .subscribe(response => {
                    this.response.set(response);
                    if (!response.errorMessages && !response.infoMessages) {
                        this.cancel();
                    }
                });
        }
    }

    changed(value: string): void {
        console.log('File changed event:', value);
        // No need to manually update button state - the computed signal handles it
    }

    uploadFromGit(): void {
        const button = this.button();
        if (button) {
            button.disabled = true;
        }
        this.functionsService
            .uploadFromGit(this.form.value.repo, this.form.value.branch, this.form.value.commit, this.form.value.path)
            .subscribe({
                next: sourceCodeResult => {
                    const btn = this.button();
                    if (btn) {
                        btn.disabled = false;
                    }
                    // this.responseChange.emit(sourceCodeResult); // Uncomment if needed
                },
                error: () => {
                    const btn = this.button();
                    if (btn) {
                        btn.disabled = false;
                    }
                },
            });
    }
}