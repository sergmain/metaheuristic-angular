import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
@Component({
    selector: 'experiment-add',
    templateUrl: './experiment-add.component.html',
    styleUrls: ['./experiment-add.component.scss']
})

export class ExperimentAddComponent {
    response: DefaultResponse;
    listOfSourceCodes: any = [];
    form: FormGroup = new FormGroup({
        sourceCodeUID: new FormControl('', [Validators.required, Validators.minLength(1)]),
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        description: new FormControl('', [Validators.required, Validators.minLength(3)]),
        experimentCode: new FormControl('', [Validators.required, Validators.minLength(3)]),
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
        this.experimentsService
            .addFormCommit(this.form.value)
            .subscribe((response) => {
                this.response = response;
                if (response.errorMessages || response.infoMessages) {

                } else {
                    this.cancel();
                }
            });
    }
}