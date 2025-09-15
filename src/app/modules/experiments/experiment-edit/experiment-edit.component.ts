import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { ExperimentApiData } from '@app/services/experiments/ExperimentApiData';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
import { SimpleExperiment } from '@app/services/experiments/SimpleExperiment';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { NgIf } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'experiment-edit',
    templateUrl: './experiment-edit.component.html',
    styleUrls: ['./experiment-edit.component.scss'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, MatFormField, MatLabel, MatInput, FormsModule, MatHint, CdkTextareaAutosize, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent]
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