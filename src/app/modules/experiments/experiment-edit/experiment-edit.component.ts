import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ExperimentsService, response } from '@app/services/experiments/';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleSelectOption } from '@src/app/models/SimpleSelectOption';
import { ExperimentApiData } from '@src/app/services/experiments/ExperimentApiData';
import { CtWrapBlockComponent } from '../../ct/ct-wrap-block/ct-wrap-block.component';
import { ExperimentParamsYaml } from '@src/app/services/experiments/ExperimentParamsYaml';
import { SimpleExperiment } from '@src/app/services/experiments/SimpleExperiment';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';

@Component({
    selector: 'experiment-edit',
    templateUrl: './experiment-edit.component.html',
    styleUrls: ['./experiment-edit.component.scss'],
    animations: [
        trigger('editMetadataCaption', [
            state('collapsed', style({
                'border-color': '*'
            })),
            state('expanded', style({
                'border-color': 'rgba(0,0,0,0)'
            })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
        trigger('editMetadataValue', [
            state('collapsed', style({
                height: '0px',
                minHeight: '0',
                display: 'none',
                opacity: '0'
            })),
            state('expanded', style({
                height: '*',
                opacity: '1'
            })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ])
    ]
})

export class ExperimentEditComponent implements OnInit {

    experimentEditResponse: ExperimentApiData.ExperimentsEditResult;
    simpleExperimentResponse: OperationStatusRest;

    addHyperParamsResponse: DefaultResponse;
    editHyperParamsResponse: DefaultResponse;

    simpleExperiment: SimpleExperiment;

    hyperParams: ExperimentApiData.HyperParamsResult;
    newHyperParams: ExperimentParamsYaml.HyperParam = {
        key: null,
        values: null,
        variants: null
    };
    updatedHyperParams: ExperimentParamsYaml.HyperParam;
    currentEditHyperParams = {
        newValues: null
    };

    hyperParamsDataSource = new MatTableDataSource([]);
    hyperParamsColumnsToDisplay = ['key', 'values', 'delete'];
    hyperParamsSecondColumnsToDisplay = ['empty', 'edit', 'done'];

    functionAddCommitResponse: DefaultResponse;
    functionDeleteCommitResponse: DefaultResponse;
    currentFunctionAddCommit;

    functionResult: ExperimentApiData.FunctionResult;
    functionDataSource = new MatTableDataSource([]);
    functionColumnsToDisplay = ['type', 'code', 'bts'];

    @ViewChild('functionBlock', { static: true }) functionBlock: CtWrapBlockComponent;
    @ViewChild('functionMatSelect') functionMatSelect: MatSelect;

    @ViewChild('metadataBlock', { static: true }) metadataBlock: CtWrapBlockComponent;

    constructor(
        private route: ActivatedRoute,
        private experimentsService: ExperimentsService,
        private location: Location,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.loadExperimet();
    }

    loadExperimet() {
        const id: string = this.route.snapshot.paramMap.get('experimentId');
        this.experimentsService.experiment.edit(id)
            .subscribe(
                (response) => {
                    this.experimentEditResponse = response;
                    this.simpleExperiment = response.simpleExperiment;
                    this.hyperParams = response.hyperParams;
                    this.hyperParamsDataSource = new MatTableDataSource(response.hyperParams.items);
                    this.functionResult = response.functionResult;
                    this.functionDataSource = new MatTableDataSource(response.functionResult.functions);
                    if (this.simpleExperiment.seed.toString().trim() === '') {
                        // TODO why?
                        this.simpleExperiment.seed = 1;
                    }
                },
                () => { },
                () => {
                    if (this.functionBlock) {
                        this.functionBlock.show();
                    }
                    if (this.metadataBlock) {
                        this.metadataBlock.show();
                    }
                }
            );
    }

    updateSimpleExperiment(event: Event) {
        const button = event.target as HTMLButtonElement;
        button.disabled = true;
        this.experimentsService.experiment
            .editCommit(this.simpleExperiment)
            .subscribe(
                (response) => {
                    this.simpleExperimentResponse = response;
                },
                () => { },
                () => {
                    button.disabled = false;
                }
            );
    }

    updateHyperParams(el, event) {
        this.metadataBlock.wait();
        if (!el.newValues) {
            return false;
        }
        let data = {
            id: el.id,
            key: el.key,
            value: el.newValues
        };
        let experimentId = this.simpleExperiment.id.toString();
        this.experimentsService.experiment
            .metadataEditCommit(experimentId, data)
            .subscribe((response: DefaultResponse) => {
                this.editHyperParamsResponse = response;
                this.loadExperimet();
            });
    }

    addHyperParams() {
        this.metadataBlock.wait();
        let data = {
            id: this.simpleExperiment.id,
            key: this.newHyperParams.key,
            value: this.newHyperParams.values
        };
        this.experimentsService.experiment
            .metadataAddCommit(this.simpleExperiment.id.toString(), data)
            .subscribe((response: DefaultResponse) => {
                this.addHyperParamsResponse = response;
                this.loadExperimet();
            });
    }

    @ConfirmationDialogMethod({
        question: (hyperParam: ExperimentParamsYaml.HyperParam): string =>
            `Do you want to delete hyper\xa0param\xa0[${hyperParam.key}]`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    deleteHyperParams(el) {
        this.metadataBlock.wait();
        this.experimentsService.experiment
            .metadataDeleteCommit(this.simpleExperiment.id, el.key)
            .subscribe(() => this.loadExperimet());
    }

    addDefaultHyperParams() {
        this.metadataBlock.wait();
        this.experimentsService.experiment
            .metadataDefaultAddCommit(this.simpleExperiment.id)
            .subscribe(() => this.loadExperimet());
    }

    openEditHyperParams(el) {
        if (this.currentEditHyperParams === el) {
            this.currentEditHyperParams = {
                newValues: null
            };
        } else {
            this.currentEditHyperParams = el;
        }
    }

    @ConfirmationDialogMethod({
        question: (functionCommit: ExperimentApiData.ExperimentFunctionResult): string => {
            return `Do you want to delete function? [${functionCommit.functionCode}]`;
        },
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    functionDeleteByTypeCommit(el: ExperimentApiData.ExperimentFunctionResult) {
        this.functionBlock.wait();
        this.experimentsService.experiment
            .functionDeleteByTypeCommit(el.experimentId?.toString?.(), el.type)
            .subscribe((response: DefaultResponse) => {
                this.functionDeleteCommitResponse = response;
                this.loadExperimet();
            });
    }

    functionAddCommit(el: SimpleSelectOption) {
        this.functionBlock.wait();
        this.experimentsService.experiment
            .functionAddCommit(this.simpleExperiment?.id?.toString?.(), el.value)
            .subscribe((response: DefaultResponse) => {
                this.functionAddCommitResponse = response;
                this.loadExperimet();
            });
    }

    functionMatSelectSelected() {
        if (this.functionMatSelect && this.functionMatSelect.selected) {
            return true;
        }
        return false;
    }

    save() {
        this.back();
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }


    // add() {
    //     let key = this.newMetadata.key.trim()
    //     let value = this.newMetadata.value.trim()
    //     if (key == '' || value == '') return false;
    //     this.experiment.metadatas.unshift(new Metadata(key, value))
    //     this.dataSource = new MatTableDataSource(this.experiment.metadatas);
    //     this.newMetadata = new Metadata('', '')

    // }

    // fill() {
    //     this.experiment.metadatas = this.experimentsService.setDefault(this.experiment.metadatas)
    //     this.dataSource = new MatTableDataSource(this.experiment.metadatas);
    // }

    // edit(el) {
    //     if (this.currentEditMetadata == el) return false;
    //     el.newValue = el.value
    //     this.currentEditMetadata = el
    // }

    // change(metadata, event) {
    //     event.stopPropagation()
    //     this.currentEditMetadata = null
    //     metadata.value = metadata.newValue
    //     delete metadata.newValue
    // }

    // delete(metadata, event) {
    //     event.stopPropagation()
    //     const i = this.experiment.metadatas.indexOf(metadata)
    //     this.experiment.metadatas.splice(i, 1)
    //     this.dataSource = new MatTableDataSource(this.experiment.metadatas);
    // }
}