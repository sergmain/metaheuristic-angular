import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { MatButton, } from '@angular/material/button';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { ExperimentItem, ExperimentsService, response } from '@services/experiments';
import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { Subscription } from 'rxjs';
import { DefaultResponse } from '@src/app/models/DefaultResponse';


@Component({
    selector: 'experiments-view',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss']
})

export class ExperimentsComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    experimentsResponse: response.experiments.Get;
    dataSource = new MatTableDataSource<ExperimentItem>([]);
    columnsToDisplay = ['id', 'name', 'createdOn', 'bts'];

    deletedExperiments: ExperimentItem[] = [];
    deleteCommitResponse: DefaultResponse;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;

    constructor(
        private dialog: MatDialog,
        private experimentsService: ExperimentsService
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        const subscribe: Subscription = this.experimentsService.experiments
            .get(page.toString())
            .subscribe(
                (response: response.experiments.Get) => {
                    this.experimentsResponse = response;
                    this.dataSource = new MatTableDataSource(response.items.content || []);
                    this.prevTable.disabled = response.items.first;
                    this.nextTable.disabled = response.items.last;
                    this.table.show();
                    this.currentStates.delete(this.states.firstLoading);
                    this.currentStates.delete(this.states.loading);
                },
                () => { },
                () => subscribe.unsubscribe()
            );
    }

    @ConfirmationDialogMethod({
        question: (experiment: ExperimentItem): string =>
            `Do you want to delete Experiment\xa0#${experiment.experiment.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(experiment: ExperimentItem) {
        this.deletedExperiments.push(experiment);
        const subscribe: Subscription = this.experimentsService.experiment
            .deleteCommit(experiment.experiment.id.toString())
            .subscribe(
                (response: DefaultResponse) => {
                    // this.updateTable(this.experimentsResponse.items.number);
                },
                () => { },
                () => subscribe.unsubscribe()
            );
    }
    // TODO: delete ExperimentsResponse
    clone(element: ExperimentItem) {
        this.currentStates.add(this.states.loading);
        this.table.wait();
        const subscribe: Subscription = this.experimentsService.experiment
            .cloneCommit(element.experiment.id)
            .subscribe(
                () => this.updateTable(this.experimentsResponse.items.number),
                () => this.updateTable(this.experimentsResponse.items.number),
                () => subscribe.unsubscribe()
            );
    }

    next() {
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.experimentsResponse.items.number + 1);
        this.table.wait();
    }

    prev() {
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.experimentsResponse.items.number - 1);
        this.table.wait();
    }
}