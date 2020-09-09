import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
@Component({
    selector: 'experiment-add',
    templateUrl: './experiment-add.component.html',
    styleUrls: ['./experiment-add.component.scss']
})

export class ExperimentAddComponent {
    readonly states = LoadStates;
    currentState = LoadStates.show;
    response;

    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        description: new FormControl('', [Validators.required, Validators.minLength(3)]),
        code: new FormControl('', [Validators.required, Validators.minLength(3)]),
        seed: new FormControl('1', [Validators.required, Validators.minLength(1)]),
    });

    constructor(
        private experimentsService: ExperimentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    cancel(): void {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }

    create(): void {
        this.currentState = this.states.wait;
        this.experimentsService.experiment
            .addCommit(this.form.value)
            .subscribe((response) => {
                this.response = response;
                if (response.errorMessages || response.infoMessages) {

                } else {
                    this.cancel();
                }
            });
    }
}