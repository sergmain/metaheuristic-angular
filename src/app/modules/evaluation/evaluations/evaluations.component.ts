import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { SimpleEvaluationsResult } from '@app/services/evaluation/SimpleEvaluationsResult';
import { SimpleEvaluation } from '@app/services/evaluation/SimpleEvaluation';
import {ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {EvaluationService} from "@services/evaluation/evaluation.service";
import {SimpleApi} from "@services/api/SimpleApi";
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
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'evaluations',
    templateUrl: './evaluations.component.html',
    styleUrls: ['./evaluations.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatButton, RouterLink, CtSectionBodyComponent, CtSectionBodyRowComponent, NgTemplateOutlet, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatTooltip, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe, TranslateModule]
})
export class EvaluationsComponent extends UIStateComponent implements OnInit {
  columnsToDisplay: string[] = ['evaluationId', 'code', 'createdOn', 'bts'];
  simpleEvaluationsResult: SimpleEvaluationsResult;
  dataSource = new MatTableDataSource<SimpleEvaluation>([]);

  constructor(
      readonly dialog: MatDialog,
      readonly authenticationService: AuthenticationService,
      private evaluationService: EvaluationService,
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    console.log('evaluations.component.ts.ngOnInit()');
    this.getEvaluations(0);
  }

  getEvaluations(pageNumber: number): void {
    this.setIsLoadingStart();
    this.evaluationService
        .getEvaluations(pageNumber.toString())
        .subscribe({
          next: simpleEvaluationsResult => {
            this.simpleEvaluationsResult = simpleEvaluationsResult;
            // console.log('EvaluationsComponent.simpleEvaluationsResult: ' + JSON.stringify(this.simpleEvaluationsResult));
            this.dataSource = new MatTableDataSource(this.simpleEvaluationsResult.evaluations.content || []);
            // console.log('EvaluationsComponent.simpleEvaluationsResult: #3');
          },
          complete: () => {
            this.setIsLoadingEnd();
          }
        });
  }

  @ConfirmationDialogMethod({
    question: (evaluation: SimpleEvaluation): string =>
        `Do you want to delete SimpleEvaluation\xa0#${evaluation.evaluationId}`,

    rejectTitle: 'Cancel',
    resolveTitle: 'Delete'
  })
  delete(evaluation: SimpleEvaluation): void {
    this.evaluationService
        .evaluationDeleteCommit(evaluation.evaluationId.toString())
        .subscribe(v => this.getEvaluations(this.simpleEvaluationsResult.evaluations.number));
  }

  @ConfirmationDialogMethod({
    question: (api: SimpleApi): string => `Do you want to run an evaluation #${api.id}`,

    resolveTitle: 'Run',
    rejectTitle: 'Cancel'
  })
  runEvaluation(evaluation: SimpleEvaluation): void {
    this.evaluationService
        .runEvaluation(evaluation.evaluationId.toString())
        .subscribe(v => this.getEvaluations(this.simpleEvaluationsResult.evaluations.number));
  }

  @ConfirmationDialogMethod({
    question: (api: SimpleApi): string => `Do you want to run a test evaluation #${api.id}`,

    resolveTitle: 'Test',
    rejectTitle: 'Cancel'
  })
  runTestEvaluation(evaluation: SimpleEvaluation): void {
    this.evaluationService
        .runTestEvaluation(evaluation.evaluationId.toString())
        .subscribe(v => this.getEvaluations(this.simpleEvaluationsResult.evaluations.number));
  }

  prevPage(): void {
    this.getEvaluations((this.simpleEvaluationsResult.evaluations.number - 1));
  }

  nextPage(): void {
    this.getEvaluations((this.simpleEvaluationsResult.evaluations.number + 1));
  }
}
