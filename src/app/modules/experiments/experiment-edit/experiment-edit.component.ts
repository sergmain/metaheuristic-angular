import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { ExperimentApiData } from '@app/services/experiments/ExperimentApiData';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
import { SimpleExperiment } from '@app/services/experiments/SimpleExperiment';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';

@Component({
    selector: 'experiment-edit',
    templateUrl: './experiment-edit.component.html',
    styleUrls: ['./experiment-edit.component.scss'],
    standalone: false
})

export class ExperimentEditComponent extends UIStateComponent implements OnInit {

    experimentsEditResult: ExperimentApiData.ExperimentsEditResult;
    operationStatusRest: OperationStatusRest;

    simpleExperiment: SimpleExperiment = {
        name: null,
        description: null,
        code: null,
        id: null
    };

    constructor(
        private route: ActivatedRoute,
        private experimentsService: ExperimentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.setIsLoadingStart();
        this.simpleExperiment.id = this.route.snapshot.paramMap.get('experimentId');
        this.experimentsService
            .edit(this.route.snapshot.paramMap.get('experimentId'))
            .subscribe({
                next: experimentsEditResult => {
                    this.experimentsEditResult = experimentsEditResult;
                    this.simpleExperiment.code = experimentsEditResult.simpleExperiment.code;
                    this.simpleExperiment.description = experimentsEditResult.simpleExperiment.description;
                    this.simpleExperiment.name = experimentsEditResult.simpleExperiment.name;
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    save(): void {
        this.setIsLoadingStart();
        this.experimentsService
            .editFormCommit(this.simpleExperiment)
            .subscribe({
                next: operationStatusRest => this.operationStatusRest = operationStatusRest,
                complete: () => this.setIsLoadingEnd()
            });
    }

    back(): void {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    }

}