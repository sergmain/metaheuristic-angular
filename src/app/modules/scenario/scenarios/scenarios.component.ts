import {Component, OnInit} from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {AuthenticationService} from '@app/services/authentication';
import {ScenariosResult} from '@services/scenario/ScenariosResult';
import {ScenarioService} from '@services/scenario/scenario.service';
import {SimpleScenario} from '@services/scenario/SimpleScenario';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import {MatDialog} from '@angular/material/dialog';
import { NgIf, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatTooltip } from '@angular/material/tooltip';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';

@Component({
    selector: 'scenarios',
    templateUrl: './scenarios.component.html',
    styleUrls: ['./scenarios.component.css'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatIconButton, RouterLink, MatIcon, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatTooltip, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, DatePipe]
})
export class ScenariosComponent extends UIStateComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleScenario> = new MatTableDataSource<SimpleScenario>([]);
    columnsToDisplay: string[] = ['id', 'createdOn', 'name', 'bts'];
    scenariosResult: ScenariosResult;
    scenarioGroupId: string;

    constructor(
        readonly dialog: MatDialog,
        private scenarioService: ScenarioService,
        private activatedRoute: ActivatedRoute,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.scenarioGroupId = this.activatedRoute.snapshot.paramMap.get('scenarioGroupId');
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.scenarioService
            .scenarios(page.toString(), this.scenarioGroupId)
            .subscribe({
                next: accountsResult => {
                    this.scenariosResult = accountsResult;
                    this.dataSource = new MatTableDataSource(this.scenariosResult.scenarios.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (ss: SimpleScenario): string =>
            `Do you want to delete Scenario #${ss.scenarioId}`,

        resolveTitle: 'Delete',
        rejectTitle: 'Cancel'
    })
    delete(scenario: SimpleScenario): void {
        this.scenarioService
            .scenarioDeleteCommit(scenario.scenarioId.toString())
            .subscribe(v => this.updateTable(this.scenariosResult.scenarios.number));
    }

    @ConfirmationDialogMethod({
        question: (ss: SimpleScenario): string =>
            `Do you want to copy Scenario #${ss.scenarioId}, ${ss.name}`,

        resolveTitle: 'Copy scenario',
        rejectTitle: 'Cancel'
    })
    copyScenario(scenario: SimpleScenario) {
        this.scenarioService
            .copyScenario(scenario.scenarioGroupId.toString(), scenario.scenarioId.toString())
            .subscribe(v => this.updateTable(this.scenariosResult.scenarios.number));
    }

    nextPage(): void {
        this.updateTable(this.scenariosResult.scenarios.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.scenariosResult.scenarios.number - 1);
    }

}
