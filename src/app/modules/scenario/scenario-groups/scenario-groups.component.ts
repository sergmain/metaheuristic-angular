import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { SimpleScenarioGroup } from '@app/services/scenario/SimpleScenarioGroup';
import {ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {ScenarioService} from "@services/scenario/scenario.service";
import {SimpleScenarioGroupsResult} from '@services/scenario/ScenarioData';
import { NgIf, NgTemplateOutlet, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'scenario-groups',
    templateUrl: './scenario-groups.component.html',
    styleUrls: ['./scenario-groups.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatButton, RouterLink, CtSectionBodyComponent, CtSectionBodyRowComponent, NgTemplateOutlet, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe, TranslateModule]
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
