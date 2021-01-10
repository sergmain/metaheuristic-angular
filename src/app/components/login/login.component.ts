import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
@Component({
    selector: 'login-view',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
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
}