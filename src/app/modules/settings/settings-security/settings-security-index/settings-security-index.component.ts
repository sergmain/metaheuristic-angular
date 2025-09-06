import {Component, ViewChild} from '@angular/core';
import {DefaultResponse} from '@app/models/DefaultResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {SettingsService} from '@app/modules/settings/settings.service';
import {OperationStatus} from '@app/enums/OperationStatus';

@Component({
    selector: "settings-security-index",
    templateUrl: './settings-security-index.component.html',
    styleUrls: ['./settings-security-index.component.scss'],
    standalone: false
})
export class SettingsSecurityIndexComponent {
    response: DefaultResponse;
    status: string;
    passwordForm = new FormGroup({
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
        newPassword2: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private settingsService: SettingsService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    changePassword(): void {
        this.settingsService
            .changePasswordCommit(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword)
            .subscribe({
                next: result => {
                    this.status = result.status === OperationStatus.OK ? 'Password was changed successfully.' : result.errorMessagesAsStr;
                },
                complete: () => {
                    this.passwordForm.reset()
                }
            });
    }

    notToCreate() {
        //console.log();
        return this.passwordForm.invalid || this.passwordForm.value.newPassword!==this.passwordForm.value.newPassword2
            || this.passwordForm.value.oldPassword===this.passwordForm.value.newPassword;
    }

}