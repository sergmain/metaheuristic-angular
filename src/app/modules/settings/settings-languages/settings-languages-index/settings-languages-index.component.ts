import {Component, ViewChild} from '@angular/core';
import {LoadStates} from '@app/enums/LoadStates';
import {DefaultResponse} from '@app/models/DefaultResponse';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {Subscription} from 'rxjs';
import {OperationStatus} from '@app/enums/OperationStatus';

@Component({
    selector: "settings-languages-index",
    templateUrl: './settings-languages-index.component.html',
    styleUrls: ['./settings-languages-index.component.scss'],
})
export class SettingsLanguagesIndexComponent {
    readonly states = LoadStates;
    currentStates = new Set();
    response: DefaultResponse;
    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        code: new FormControl('', [Validators.required, Validators.minLength(3)]),
        scheme: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private apiService: ApiService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    @ViewChild(MatButton) button: MatButton;

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.apiService
            .addFormCommit(
                this.form.value.name,
                this.form.value.code,
                this.form.value.scheme
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