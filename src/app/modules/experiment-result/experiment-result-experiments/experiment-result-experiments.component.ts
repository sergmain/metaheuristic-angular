import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { ExperimentResultService } from '@src/app/services/experiment-result/experiment-result.service';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';
import { ExperimentResultSimple } from '@src/app/services/experiment-result/ExperimentResultSimple';
import { ExperimentApiData } from '@src/app/services/experiments/ExperimentApiData';
import * as fileSaver from 'file-saver';

@Component({
    selector: 'experiment-result-experiments',
    templateUrl: './experiment-result-experiments.component.html',
    styleUrls: ['./experiment-result-experiments.component.scss']
})

export class ExperimentResultExperimentsComponent extends UIStateComponent implements OnInit {
    experimentResultSimpleList: ExperimentResultData.ExperimentResultSimpleList;
    dataSource: MatTableDataSource<ExperimentResultSimple> = new MatTableDataSource<ExperimentResultSimple>([]);
    columnsToDisplay: string[] = ['id', 'name', 'description', 'createdOn', 'bts'];

    constructor(
        private experimentResultService: ExperimentResultService,
        readonly dialog: MatDialog,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.experimentResultService
            .init(page.toString())
            .subscribe({
                next: experimentResultSimpleList => {
                    this.experimentResultSimpleList = experimentResultSimpleList;
                    this.dataSource = new MatTableDataSource(experimentResultSimpleList.items.content || []);
                },
                complete: () => this.setIsLoadingEnd()
            });
    }

    @ConfirmationDialogMethod({
        question: (experiment: ExperimentApiData.ExperimentData): string =>
            `Do you want to delete Experiment\xa0#${experiment.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    deleteExperiment(experiment: ExperimentApiData.ExperimentData): void {
        this.experimentResultService
            .deleteCommit(experiment.id.toString())
            .subscribe({
                complete: () => this.updateTable(this.experimentResultSimpleList.items.number)
            });
    }

    exportExperiment(experiment: ExperimentApiData.ExperimentData): void {
        this.experimentResultService
            .downloadExperimentResult(experiment.id.toString())
            .subscribe((res: HttpResponse<Blob>) => {
                fileSaver.saveAs(
                    new Blob([res.body], { type: 'application/octet-stream' }),
                    decodeURIComponent(`experiment-result-${experiment.id}.zip`)
                );
            });
    }

    nextPage(): void {
        this.updateTable(this.experimentResultSimpleList.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.experimentResultSimpleList.items.number - 1);
    }
}