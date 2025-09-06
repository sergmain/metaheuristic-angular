import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { SourceCodeUidsForCompany } from '@src/app/services/source-codes/SourceCodeUidsForCompany';
@Component({
    selector: 'experiment-add',
    templateUrl: './experiment-add.component.html',
    styleUrls: ['./experiment-add.component.scss'],
    standalone: false
})

export class ExperimentAddComponent implements OnInit {
    form: FormGroup = new FormGroup({
        sourceCodeUID: new FormControl('', [Validators.required, Validators.minLength(1)]),
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        description: new FormControl('', [Validators.required, Validators.minLength(3)]),
        experimentCode: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    operationStatusRest: OperationStatusRest;
    sourceCodeUidsForCompany: SourceCodeUidsForCompany;

    constructor(
        private experimentsService: ExperimentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.experimentsService
            .experimentAdd()
            .subscribe({
                next: (sourceCodeUidsForCompany) => {
                    this.sourceCodeUidsForCompany = sourceCodeUidsForCompany;
                }
            });
    }

    cancel(): void {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }

    create(): void {
        this.experimentsService
            .addFormCommit(
                this.form.value.sourceCodeUID,
                this.form.value.name,
                this.form.value.description,
                this.form.value.experimentCode
            )
            .subscribe({
                next: (operationStatusRest) => {
                    this.operationStatusRest = operationStatusRest;
                    if (operationStatusRest.status === OperationStatus.OK) {
                        this.form.reset();
                    }
                }
            });
    }
}