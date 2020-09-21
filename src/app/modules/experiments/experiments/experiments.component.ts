import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { MatButton, } from '@angular/material/button';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { CtTableComponent } from '@src/app/modules/ct/ct-table/ct-table.component';
import { Subscription } from 'rxjs';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { ExperimentsService } from '@src/app/services/experiments/experiments.service';
import { ExperimentItem } from '@src/app/services/experiments/response';
import { ExperimentApiData } from '@src/app/services/experiments/ExperimentApiData';
import { ExecContextState } from '@src/app/enums/ExecContextState';


@Component({
    selector: 'experiments-view',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss']
})

export class ExperimentsComponent implements OnInit {
    execContextState = ExecContextState;
    isLoading: boolean;

    experimentsResult: ExperimentApiData.ExperimentsResult;

    dataSource: MatTableDataSource<ExperimentApiData.ExperimentResult> = new MatTableDataSource<ExperimentApiData.ExperimentResult>([]);
    columnsToDisplay: string[] = ['id', 'name', 'createdOn', 'execState', 'bts'];

    deletedExperiments: ExperimentItem[] = [];
    deleteCommitResponse: DefaultResponse;

    constructor(
        private dialog: MatDialog,
        private experimentsService: ExperimentsService
    ) { }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.isLoading = true;
        this.experimentsService
            .getExperiments(page.toString())
            .subscribe({
                next: experimentsResult => {
                    this.experimentsResult = experimentsResult;
                    this.dataSource = new MatTableDataSource(experimentsResult.items.content || []);
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (experiment: ExperimentItem): string =>
            `Do you want to delete Experiment\xa0#${experiment.experiment.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(experiment: ExperimentItem): void {
        this.deletedExperiments.push(experiment);
        const subscribe: Subscription = this.experimentsService
            .deleteCommit(experiment.experiment.id.toString())
            .subscribe(
                (operationStatusRest) => {
                    // this.updateTable(this.experimentsResponse.items.number);
                },
                () => { },
                () => subscribe.unsubscribe()
            );
    }
    // TODO: delete ExperimentsResponse
    clone(element: ExperimentItem): void {
        this.isLoading = true;
        const subscribe: Subscription = this.experimentsService
            .experimentCloneCommit(element.experiment.id?.toString())
            .subscribe(
                () => this.updateTable(this.experimentsResult.items.number),
                () => this.updateTable(this.experimentsResult.items.number),
                () => subscribe.unsubscribe()
            );
    }

    produce(exp) {
        console.log(exp);
    }

    start(exp) {

    }

    stop(exp) {

    }

    nextPage(): void { this.updateTable(this.experimentsResult.items.number + 1); }

    prevPage(): void { this.updateTable(this.experimentsResult.items.number - 1); }

}