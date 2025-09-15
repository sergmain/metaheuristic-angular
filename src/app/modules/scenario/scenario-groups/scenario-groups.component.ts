import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { SimpleScenarioGroup } from '@app/services/scenario/SimpleScenarioGroup';
import {ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {ScenarioService} from "@services/scenario/scenario.service";
import {SimpleScenarioGroupsResult} from '@services/scenario/ScenarioData';

@Component({
    selector: 'scenario-groups',
    templateUrl: './scenario-groups.component.html',
    styleUrls: ['./scenario-groups.component.sass'],
    standalone: false
})
export class ScenarioGroupsComponent extends UIStateComponent implements OnInit {
  columnsToDisplay: string[] = ['scenarioGroupId', 'createdOn', 'name', 'bts'];
  simpleScenarioGroupsResult: SimpleScenarioGroupsResult;
  dataSource = new MatTableDataSource<SimpleScenarioGroup>([]);

  constructor(
      readonly dialog: MatDialog,
      readonly authenticationService: AuthenticationService,
      private scenarioService: ScenarioService,
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    console.log('scenario-groups.component.ts.ngOnInit()');
    this.getScenarioGroups(0);
  }

  getScenarioGroups(pageNumber: number): void {
    this.setIsLoadingStart();
    this.scenarioService
        .getScenarioGroups(pageNumber.toString())
        .subscribe({
          next: simpleScenarioGroupsResult => {
            this.simpleScenarioGroupsResult = simpleScenarioGroupsResult;
            // console.log('ScenarioGroupsComponent.simpleScenarioGroupsResult: ' + JSON.stringify(this.simpleScenarioGroupsResult));
            this.dataSource = new MatTableDataSource(this.simpleScenarioGroupsResult.scenarioGroups.content || []);
            // console.log('ScenarioGroupsComponent.simpleScenarioGroupsResult: #3');
          },
          complete: () => {
            this.setIsLoadingEnd();
          }
        });
  }

  @ConfirmationDialogMethod({
    question: (scenarioGroup: SimpleScenarioGroup): string =>
        `Do you want to delete SimpleScenarioGroup\xa0#${scenarioGroup.scenarioGroupId}`,

    rejectTitle: 'Cancel',
    resolveTitle: 'Delete'
  })
  delete(scenarioGroup: SimpleScenarioGroup): void {
    this.scenarioService
        .scenarioGroupDeleteCommit(scenarioGroup.scenarioGroupId.toString())
        .subscribe(v => this.getScenarioGroups(this.simpleScenarioGroupsResult.scenarioGroups.number));
  }

  prevPage(): void {
    this.getScenarioGroups((this.simpleScenarioGroupsResult.scenarioGroups.number - 1));
  }

  nextPage(): void {
    this.getScenarioGroups((this.simpleScenarioGroupsResult.scenarioGroups.number + 1));
  }
}
