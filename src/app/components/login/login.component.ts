import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import {environment} from '@src/environments/environment';
import { CtSectionComponent } from '../../modules/ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../modules/ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../modules/ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../modules/ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../modules/ct/ct-section-body/ct-section-body.component';
import { NgIf } from '@angular/common';
import { CtSectionBodyRowComponent } from '../../modules/ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionContentComponent } from '../../modules/ct/ct-section-content/ct-section-content.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { CtSectionFooterComponent } from '../../modules/ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../modules/ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'login-view',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [CtSectionComponent, FormsModule, ReactiveFormsModule, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, NgIf, CtSectionBodyRowComponent, CtSectionContentComponent, MatFormField, MatLabel, MatInput, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
})
export class LoginComponent {

    username: string = '';
    password: string = '';

    form: FormGroup = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(1)]),
        password: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    constructor(
        private authenticationService: AuthenticationService,
    ) { }

    login(): void {
        if (this.form.valid) {
            this.authenticationService.login(
                this.form.value.username,
                this.form.value.password
            );
        }
    }

    isStandalone() {
        // console.log("environment.standalone: ", environment.standalone);
        return environment.standalone;
    }
}