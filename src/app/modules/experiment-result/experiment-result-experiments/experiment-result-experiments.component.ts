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
import { ExperimentApiData } from '@src/app/services/experiments/ExperimentApiData';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';
import { ExperimentResultSimple } from '@src/app/services/experiment-result/ExperimentResultSimple';

@Component({
    selector: 'experiment-result-experiments',
    templateUrl: './experiment-result-experiments.component.html',
    styleUrls: ['./experiment-result-experiments.component.scss']
})

export class ExperimentResultExperimentsComponent implements OnInit {

    isLoading: boolean;
    experimentResultSimpleList: ExperimentResultData.ExperimentResultSimpleList;
    dataSource = new MatTableDataSource<ExperimentResultSimple>([]);

    deletedExperiments: ExperimentApiData.ExperimentData[] = [];

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
        private activatedRoute: ActivatedRoute,
        private experimentResultService: ExperimentResultService,
        private location: Location,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.experimentResultService
            .init(page.toString())
            .subscribe({
                next: (experimentResultSimpleList) => {
                    this.experimentResultSimpleList = experimentResultSimpleList;
                    this.dataSource = new MatTableDataSource(experimentResultSimpleList.items.content || []);
                }
            });

    }

    @ConfirmationDialogMethod({
        question: (experiment: ExperimentApiData.ExperimentData): string =>
            `Do you want to delete Experiment\xa0#${experiment.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(experiment: ExperimentApiData.ExperimentData): void {
        this.deletedExperiments.push(experiment);
        this.experimentResultService
            .deleteCommit(experiment.id.toString())
            .subscribe();
    }

    nextPage(): void {
        this.updateTable(this.experimentResultSimpleList.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.experimentResultSimpleList.items.number - 1);
    }
}