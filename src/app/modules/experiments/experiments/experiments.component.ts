import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ExecContextState } from '@src/app/enums/ExecContextState';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { ExperimentApiData } from '@src/app/services/experiments/ExperimentApiData';
import { ExperimentsService } from '@src/app/services/experiments/experiments.service';
import { ExperimentItem } from '@src/app/services/experiments/response';

@Component({
    selector: 'experiments-view',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss']
})

export class ExperimentsComponent extends UIStateComponent implements OnInit {
    ExecContextState: typeof ExecContextState = ExecContextState;
    experimentsResult: ExperimentApiData.ExperimentsResult;
    dataSource: MatTableDataSource<ExperimentApiData.ExperimentResult> = new MatTableDataSource<ExperimentApiData.ExperimentResult>([]);
    columnsToDisplay: string[] = ['id', 'name', 'createdOn', 'code', 'description', 'execState', 'bts'];

    constructor(
        private dialog: MatDialog,
        private experimentsService: ExperimentsService
    ) { super(); }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.experimentsService
            .getExperiments(page.toString())
            .subscribe({
                next: experimentsResult => {
                    this.experimentsResult = experimentsResult;
                    this.dataSource = new MatTableDataSource(experimentsResult.items.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd();
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
        this.experimentsService
            .deleteCommit(experiment.experiment.id.toString())
            .subscribe({
                complete: () => this.updateTable(this.experimentsResult.items.number)
            });
    }

    clone(element: ExperimentItem): void {
        this.experimentsService
            .experimentCloneCommit(element.experiment.id?.toString())
            .subscribe({
                complete: () => this.updateTable(this.experimentsResult.items.number)
            });
    }

    produce(experiment: ExperimentApiData.ExperimentResult): void {
        this.execContextTargetExecState(experiment.experiment.id.toString(), ExecContextState.PRODUCED.toLowerCase());
    }

    start(experiment: ExperimentApiData.ExperimentResult): void {
        this.execContextTargetExecState(experiment.experiment.id.toString(), ExecContextState.STARTED.toLowerCase());
    }

    stop(experiment: ExperimentApiData.ExperimentResult): void {
        this.execContextTargetExecState(experiment.experiment.id.toString(), ExecContextState.STOPPED.toLowerCase());
    }

    private execContextTargetExecState(id: string, state: string): void {
        this.experimentsService
            .execContextTargetExecState(id, state)
            .subscribe({
                complete: () => this.updateTable(this.experimentsResult.items.number)
            });
    }

    nextPage(): void {
        this.updateTable(this.experimentsResult.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.experimentsResult.items.number - 1);
    }

}