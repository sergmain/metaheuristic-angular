import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadStates} from '@app/enums/LoadStates';
import {DefaultResponse} from '@app/models/DefaultResponse';
import {OperationStatus} from '@src/app/enums/OperationStatus';
import {Subscription} from 'rxjs';
import {MatButton} from "@angular/material/button";
import {ApiService} from "@services/api/api.service";

@Component({
    selector: 'api-add',
    templateUrl: './api-add.component.html',
    styleUrls: ['./api-add.component.scss'],
    standalone: false
})

export class ApiAddComponent {
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