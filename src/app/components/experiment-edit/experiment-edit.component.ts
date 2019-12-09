import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSelect, MatSelectChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { DefaultResponse } from '@app/models';
import { ExperimentsService, HyperParam, HyperParams, response, SimpleExperiment, Snippet, SnippetResult } from '@app/services/experiments/';
import { CtWrapBlockComponent } from '@src/app/ct/ct-wrap-block/ct-wrap-block.component';
import { Subscription } from 'rxjs';

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
    experimentEditResponse: response.experiment.Edit;
    simpleExperimentResponse: response.experiment.Edit;
    addHyperParamsResponse: DefaultResponse;
    editHyperParamsResponse: DefaultResponse;

    simpleExperiment: SimpleExperiment;

    hyperParams: HyperParams;
    newHyperParams: HyperParam = {};
    updatedHyperParams: HyperParam;
    currentEditHyperParams: HyperParam = {};

    hyperParamsDataSource = new MatTableDataSource([]);
    hyperParamsColumnsToDisplay = ['key', 'values', 'delete'];
    hyperParamsSecondColumnsToDisplay = ['empty', 'edit', 'done'];

    snippetResult: SnippetResult;
    snippetAddCommitResponse: DefaultResponse;
    snippetDeleteCommitResponse: DefaultResponse;
    currentSnippetAddCommit;
    snippetsDataSource = new MatTableDataSource([]);
    snippetsColumnsToDisplay = ['type', 'code', 'bts'];


    // snippets: any = false;
    // currentEditMetadata: Metadata | null;

    // newMetadata: Metadata = new Metadata('', '')
    @ViewChild('snippetsBlock') snippetsBlock: CtWrapBlockComponent;
    @ViewChild('snippetMatSelect') snippetMatSelect: MatSelect;

    @ViewChild('metadataBlock') metadataBlock: CtWrapBlockComponent;

    constructor(
        private route: ActivatedRoute,
        private experimentsService: ExperimentsService,
        private location: Location,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.loadExperimet();
    }

    loadExperimet() {
        const id: string = this.route.snapshot.paramMap.get('experimentId');
        const subscribe: Subscription = this.experimentsService.experiment.edit(id)
            .subscribe(
                (response: response.experiment.Edit) => {
                    this.experimentEditResponse = response;
                    this.simpleExperiment = response.simpleExperiment;

                    if (this.simpleExperiment.seed.toString().trim() === '') {
                        this.simpleExperiment.seed = 1;
                    }

                    this.hyperParams = response.hyperParams;
                    this.hyperParamsDataSource = new MatTableDataSource(response.hyperParams.items);

                    this.snippetResult = response.snippetResult;
                    this.snippetsDataSource = new MatTableDataSource(response.snippetResult.snippets);
                },
                () => {},
                () => {
                    subscribe.unsubscribe();
                    if (this.snippetsBlock) {
                        this.snippetsBlock.show();
                    }
                    if (this.metadataBlock) {
                        this.metadataBlock.show();
                    }
                }
            );
    }

    updateSimpleExperiment(event: Event) {
        const button: HTMLButtonElement = event.target as HTMLButtonElement;
        button.disabled = true;
        const subscribe: Subscription = this.experimentsService.experiment
            .editCommit(this.simpleExperiment)
            .subscribe(
                (response: response.experiment.Edit) => {
                    this.simpleExperimentResponse = response;
                },
                () => {},
                () => {
                    subscribe.unsubscribe();
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
        let subscribe = this.experimentsService.experiment
            .metadataEditCommit(experimentId, data)
            .subscribe((response: DefaultResponse) => {
                this.editHyperParamsResponse = response;
                this.loadExperimet();
                subscribe.unsubscribe();
            });
    }

    addHyperParams() {
        this.metadataBlock.wait();
        let data = {
            id: this.simpleExperiment.id,
            key: this.newHyperParams.key,
            value: this.newHyperParams.values
        };
        let experimentId = this.simpleExperiment.id.toString();
        let subscribe = this.experimentsService.experiment
            .metadataAddCommit(experimentId, data)
            .subscribe(
                (response: DefaultResponse) => {
                    this.addHyperParamsResponse = response;
                    this.loadExperimet();
                },
                () => {},
                () => {
                    subscribe.unsubscribe();
                }
            );
    }

    @ConfirmationDialogMethod({
        question: (hyperParam: HyperParam): string =>
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
            this.currentEditHyperParams = {};
        } else {
            this.currentEditHyperParams = el;
        }
    }

    @ConfirmationDialogMethod({
        question: (snippet: Snippet): string =>
            `Do you want to delete snippet\xa0[${snippet.snippetCode}]`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    snippetDeleteCommit(el) {
        this.snippetsBlock.wait();
        const subscribe: Subscription = this.experimentsService.experiment
            .snippetDeleteByTypeCommit(el.experimentId, el.type)
            // .snippetDeleteCommit(el.experimentId, el.snippetCode)
            .subscribe(
                (response: DefaultResponse) => {
                    this.snippetDeleteCommitResponse = response;
                    this.loadExperimet();
                },
                () => {},
                () => {
                    subscribe.unsubscribe();
                }
            );
    }

    snippetAddCommit(el) {
        this.snippetsBlock.wait();
        const experimentId = this.simpleExperiment.id.toString();
        const data = { code: el.value };
        const subscribe = this.experimentsService.experiment
            .snippetAddCommit(experimentId, data)
            .subscribe(
                (response: DefaultResponse) => {
                    this.snippetAddCommitResponse = response;
                    this.loadExperimet();
                },
                () => {},
                () => {
                    subscribe.unsubscribe();
                }
            );
    }

    snippetMatSelectSelected() {
        if (this.snippetMatSelect && this.snippetMatSelect.selected) {
            return true;
        }
        return false;
    }

    save() {
        this.back();
    }

    back() {
        this.router.navigate(['/launchpad', 'experiments']);
    }

    cancel() {
        this.back();
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