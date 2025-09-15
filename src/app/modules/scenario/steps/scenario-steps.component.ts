import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {AuthenticationService} from '@app/services/authentication';
import {ScenarioService} from "@services/scenario/scenario.service";
import {ConfirmationDialogMethod} from "@app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {LoadStates} from "@app/enums/LoadStates";
import {ScenarioUidsForAccount} from "@services/scenario/ScenarioUidsForAccount";
import {SimpleScenarioSteps} from "@services/scenario/SimpleScenarioSteps";
import {SimpleScenarioStep} from "@services/scenario/SimpleScenarioStep";
import {MatButton} from "@angular/material/button";
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import { CdkDragDrop, CdkDropList, CdkDrag } from "@angular/cdk/drag-drop";
import { NgIf } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatIcon } from '@angular/material/icon';


@Component({
    standalone : true,
    selector: 'scenario-steps',
    templateUrl: './scenario-steps.component.html',
    styleUrls: ['./scenario-steps.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatButton, RouterLink, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, CdkDropList, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CdkDrag]
})
export class ScenarioStepsComponent extends UIStateComponent implements OnInit {
    readonly states = LoadStates;

    currentStates: Set<LoadStates> = new Set();

    columnsToDisplay: string[] = ['api', 'name', 'prompt', 'answer', 'bts'];

    simpleScenarioSteps: SimpleScenarioSteps;
    scenarioGroupId: string;
    scenarioId: string;

    dataSource = new MatTableDataSource<SimpleScenarioStep>([]);

    response: ScenarioUidsForAccount;

    @ViewChild(MatButton) cancelCreationButton: MatButton;

    constructor(
        readonly dialog: MatDialog,
        private scenarioService: ScenarioService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.scenarioGroupId = this.activatedRoute.snapshot.paramMap.get('scenarioGroupId');
        this.scenarioId = this.activatedRoute.snapshot.paramMap.get('scenarioId');
        this.updateTable();
    }

    updateTable(): void {
        this.setIsLoadingStart();
        this.scenarioService
            .scenarioSteps(this.scenarioGroupId, this.scenarioId)
            .subscribe({
                next: simpleScenarioSteps => {
                    this.simpleScenarioSteps = simpleScenarioSteps;
                    // console.log('ScenarioStepsComponent.simpleScenarioSteps: ' + JSON.stringify(this.simpleScenarioSteps));
                    this.dataSource = new MatTableDataSource(this.simpleScenarioSteps.steps || []);
                    // console.log('ScenarioStepsComponent.simpleScenarioSteps: #3');
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (scenarioStep: SimpleScenarioStep): string =>
            `Do you want to delete Scenario Step #${scenarioStep.uuid}`,

        resolveTitle: 'Delete',
        rejectTitle: 'Cancel'
    })
    delete(scenarioStep: SimpleScenarioStep): void {
        this.scenarioService
            .scenarioStepDeleteCommit(scenarioStep.scenarioId.toString(), scenarioStep.uuid)
            .subscribe(v => this.updateTable());
    }

    rearrangeTable(event: CdkDragDrop<SimpleScenarioStep[]>): void {
        // console.log("ScenarioStepsComponent.rearrangeTable, prev: "+ event.previousIndex+", curr: " + event.currentIndex);
        if (event.previousIndex===event.currentIndex) {
            return;
        }

        let prevUuid = this.simpleScenarioSteps.steps[event.previousIndex].uuid;
        let currUuid = this.simpleScenarioSteps.steps[event.currentIndex].uuid;
        this.scenarioService
            .scenarioStepRearrangeTable(this.scenarioId.toString(), prevUuid, currUuid)
            .subscribe(v => this.updateTable());
    }
}
