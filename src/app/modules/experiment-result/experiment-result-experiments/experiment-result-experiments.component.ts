import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { ExperimentResultService } from '@src/app/services/experiment-result/experiment-result.service';
import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ExperimentData } from '@src/app/services/experiments/ExperimentData';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';
import { ExperimentResultSimple } from '@src/app/services/experiment-result/ExperimentResultSimple';

@Component({
    selector: 'experiment-result-experiments',
    templateUrl: './experiment-result-experiments.component.html',
    styleUrls: ['./experiment-result-experiments.component.scss']
})

export class ExperimentResultExperimentsComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response: ExperimentResultData.ExperimentResultSimpleList;
    dataSource = new MatTableDataSource<ExperimentResultSimple>([]);

    deletedExperiments: ExperimentData[] = [];


    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;


    tables = {
        generalInfo: {
            table: [],
            columnsToDisplay: ['key', 'value'],
        },
        hyperParameters: {
            table: new MatTableDataSource([]),
            columnsToDisplay: ['key', 'value', 'variants'],
        },
        features: {
            table: new MatTableDataSource([]),
            columnsToDisplay: ['id', 'resourceCodes', 'execStatus', 'maxValue', 'bts'],
        },
    };

    columnsToDisplay = ['id', 'name', 'description', 'createdOn', 'bts'];

    constructor(
        private route: ActivatedRoute,
        private experimentResultService: ExperimentResultService,
        private location: Location,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        const subscribe: Subscription = this.experimentResultService
            .init(page.toString())
            .subscribe({
                next: (response) => {
                    this.response = response;
                    this.dataSource = new MatTableDataSource(response.items.content || []);
                    this.prevTable.disabled = response.items.first;
                    this.nextTable.disabled = response.items.last;
                    this.currentStates.delete(this.states.firstLoading);
                    this.currentStates.delete(this.states.loading);
                    this.table.show();
                }
            });

    }

    @ConfirmationDialogMethod({
        question: (experiment: ExperimentData): string =>
            `Do you want to delete Experiment\xa0#${experiment.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(experiment: ExperimentData) {
        this.deletedExperiments.push(experiment);
        this.experimentResultService
            .deleteCommit(experiment.id.toString())
            .subscribe();
    }

    next() {
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.items.number + 1);
        this.table.wait();
    }

    prev() {
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.items.number - 1);
        this.table.wait();
    }
}