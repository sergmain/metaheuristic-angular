import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FunctionsService} from '@src/app/services/functions/functions.service';
import {CtFileUploadComponent} from '@src/app/modules/ct/ct-file-upload/ct-file-upload.component';
import {UploadingStatus} from '@app/modules/bundle/bundle-data';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'add-function',
    templateUrl: './add-function.component.html',
    styleUrls: ['./add-function.component.scss']
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