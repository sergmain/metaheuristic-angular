import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
import { OperationStatus } from '@app/enums/OperationStatus';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { SourceCodeUidsForCompany } from '@app/services/source-codes/SourceCodeUidsForCompany';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatHint, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatOption } from '@angular/material/autocomplete';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';
@Component({
    standalone : true,
    selector: 'experiment-add',
    templateUrl: './experiment-add.component.html',
    styleUrls: ['./experiment-add.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, NgFor, MatOption, MatHint, MatInput, CdkTextareaAutosize, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent]
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