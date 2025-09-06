import {Component, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { Subscription } from 'rxjs';
import {MatButton} from "@angular/material/button";
import {KbService} from "@services/kb/kb.service";

@Component({
    selector: 'kb-add',
    templateUrl: './kb-add.component.html',
    styleUrls: ['./kb-add.component.scss'],
    standalone: false
})

export class KbAddComponent {
    readonly states = LoadStates;
    currentStates = new Set();
    response: DefaultResponse;
    form = new FormGroup({
        code: new FormControl('', [Validators.required, Validators.minLength(3)]),
        params: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    constructor(
        private kbService: KbService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    @ViewChild(MatButton) button: MatButton;

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.kbService
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