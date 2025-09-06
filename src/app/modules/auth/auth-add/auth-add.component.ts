import {Component, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { Subscription } from 'rxjs';
import {MatButton} from "@angular/material/button";
import {AuthService} from "@services/auth/auth.service";

@Component({
    selector: 'auth-add',
    templateUrl: './auth-add.component.html',
    styleUrls: ['./auth-add.component.scss'],
    standalone: false
})

export class AuthAddComponent {
    readonly states = LoadStates;
    currentStates = new Set();
    response: DefaultResponse;
    form = new FormGroup({
        code: new FormControl('', [Validators.required, Validators.minLength(3)]),
        params: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    @ViewChild(MatButton) button: MatButton;

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.authService
            .addFormCommit(
                this.form.value.code,
                this.form.value.params
            )
            .subscribe(
                (response) => {
                    if (response.status === OperationStatus.OK) {
                        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
                    }
                },
                () => {},
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
    }
}