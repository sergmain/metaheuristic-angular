import {Component, ViewChild} from '@angular/core';
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
import { CtFileUploadComponent as CtFileUploadComponent_1 } from '../../ct/ct-file-upload/ct-file-upload.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { NgIf } from '@angular/common';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';

@Component({
    standalone : true,
    selector: 'add-function',
    templateUrl: './add-function.component.html',
    styleUrls: ['./add-function.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtFileUploadComponent_1, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, NgIf, CtRestStatusComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput]
})

export class AddFunctionComponent {

    response: UploadingStatus;

    @ViewChild('fileUpload', { static: true }) fileUpload: CtFileUploadComponent;
    @ViewChild(MatButton) button: MatButton;

    form: FormGroup = new FormGroup({
        repo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('https?:\\/\\/.*')]),
        branch: new FormControl('', [Validators.required, Validators.minLength(1)]),
        commit: new FormControl('', [Validators.required, Validators.minLength(1)]),
        path: new FormControl('' )
    });

    constructor(
        private functionsService: FunctionsService,
        private router: Router,
    ) { }

    cancel(): void {
        this.router.navigate(['/dispatcher', 'functions']);
    }

    upload(): void {
        this.functionsService
            .uploadBundle(this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe(
                (response) => {
                    this.response = response;
                    if (!response.errorMessages && !response.infoMessages) {
                        this.cancel();
                    }
                }
            );
    }

    uploadFromGit(): void {
        this.button.disabled = true;
        this.functionsService
            .uploadFromGit(this.form.value.repo, this.form.value.branch, this.form.value.commit, this.form.value.path)
            .subscribe(sourceCodeResult => {
                this.button.disabled = false;
                // this.responseChange.emit(sourceCodeResult);
            });
    }
}