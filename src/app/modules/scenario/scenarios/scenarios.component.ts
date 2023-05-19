import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import {ScenariosResult} from "@services/scenario/ScenariosResult";
import {ScenarioService} from "@services/scenario/scenario.service";
import {SimpleScenario} from "@services/scenario/SimpleScenario";
import {ConfirmationDialogMethod} from "@app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'scenarios',
    templateUrl: './scenarios.component.html',
    styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent extends UIStateComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleScenario> = new MatTableDataSource<SimpleScenario>([]);
    columnsToDisplay: string[] = ['id', 'createdOn', 'apiCode', 'name', 'bts'];
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
            `Do you want to exec Scenario #${ss.scenarioId}, ${ss.name}`,

        resolveTitle: 'Run scenario',
        rejectTitle: 'Cancel'
    })
    runScenario(scenario: SimpleScenario): void {
        this.scenarioService
            .runScenario(scenario.scenarioGroupId.toString(), scenario.scenarioId.toString())
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
