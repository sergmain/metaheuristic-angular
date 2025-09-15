import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ExecContextState } from '@app/enums/ExecContextState';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { ExperimentApiData } from '@app/services/experiments/ExperimentApiData';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
import { NgIf, NgTemplateOutlet, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone : true,
    selector: 'experiments-view',
    templateUrl: './experiments.component.html',
    styleUrls: ['./experiments.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, NgTemplateOutlet, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, MatButton, RouterLink, MatIcon, DatePipe]
})

export class ExperimentsComponent extends UIStateComponent implements OnInit {
    ExecContextState: typeof ExecContextState = ExecContextState;
    experimentsResult: ExperimentApiData.ExperimentsResult;
    dataSource: MatTableDataSource<ExperimentApiData.ExperimentResult> = new MatTableDataSource<ExperimentApiData.ExperimentResult>([]);
    columnsToDisplay: string[] = ['id', 'name', 'createdOn', 'code', 'description', 'execState', 'bts'];

    constructor(
        readonly dialog: MatDialog,
        private experimentsService: ExperimentsService,
        readonly authenticationService: AuthenticationService

    ) {
        super(authenticationService);
    }

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
        question: (experiment: ExperimentApiData.ExperimentResult): string =>
            `Do you want to delete Experiment\xa0#${experiment.experiment.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(experiment: ExperimentApiData.ExperimentResult): void {
        this.experimentsService
            .deleteCommit(experiment.experiment.id.toString())
            .subscribe({
                complete: () => this.updateTable(this.experimentsResult.items.number)
            });
    }

    clone(element: ExperimentApiData.ExperimentResult): void {
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