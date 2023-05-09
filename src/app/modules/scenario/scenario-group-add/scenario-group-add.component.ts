import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadStates} from '@app/enums/LoadStates';
import {DefaultResponse} from '@app/models/DefaultResponse';
import {OperationStatus} from '@src/app/enums/OperationStatus';
import {Subscription} from 'rxjs';
import {MatButton} from "@angular/material/button";
import {ScenarioService} from "@services/scenario/scenario.service";

@Component({
    selector: 'scenario-group-add',
    templateUrl: './scenario-group-add.component.html',
    styleUrls: ['./scenario-group-add.component.scss']
})

export class ScenarioGroupAddComponent {
    readonly states = LoadStates;
    currentStates = new Set();
    response: DefaultResponse;
    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        description: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    constructor(
        private scenarioService: ScenarioService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    @ViewChild(MatButton) button: MatButton;

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.scenarioService
            .addScenarioGroupFormCommit(
                this.form.value.name,
                this.form.value.description,
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