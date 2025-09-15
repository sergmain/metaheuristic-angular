import {Component, ViewChild} from '@angular/core';
import {DefaultResponse} from '@app/models/DefaultResponse';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {MatButton} from '@angular/material/button';
import {SettingsService} from '@app/modules/settings/settings.service';
import {OperationStatus} from '@app/enums/OperationStatus';
import { CtColsComponent } from '../../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../../ct/ct-section-body/ct-section-body.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { CtSectionFooterComponent } from '../../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: "settings-security-index",
    templateUrl: './settings-security-index.component.html',
    styleUrls: ['./settings-security-index.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, RouterLink, TranslateModule]
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