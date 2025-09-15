import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { SessionService } from '@app/services/session/session.service';
import { SimpleSessionsResult } from '@app/services/session/SimpleSessionsResult';
import { SimpleSession } from '@app/services/session/SimpleSession';
import {ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import { NgIf, NgTemplateOutlet, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'sessions',
    templateUrl: './sessions.component.html',
    styleUrls: ['./sessions.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, NgTemplateOutlet, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, RouterLink, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe, TranslateModule]
})
export class SessionsComponent extends UIStateComponent implements OnInit {
//   columnsToDisplay: string[] = ['sessionId', 'startedOn', 'finishedOn',
//     'sessionStatus', 'safe', 'normalPercent', 'failPercent', 'errorPercent', 'providerCode', 'modelInfo'];
  columnsToDisplay: string[] = ['sessionId', 'startedOn', 'providerCode',
    'normalPercent', 'failPercent', 'errorPercent', 'bts'];
  simpleSessionsResult: SimpleSessionsResult;
  dataSource = new MatTableDataSource<SimpleSession>([]);

  constructor(
      readonly dialog: MatDialog,
      readonly authenticationService: AuthenticationService,
      private sessionService: SessionService,
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    console.log('sessions.component.ts.ngOnInit()');
    this.getEvaluations(0);
  }

  getEvaluations(pageNumber: number): void {
    this.setIsLoadingStart();
    this.sessionService
        .getSessions(pageNumber.toString())
        .subscribe({
          next: simpleSessionsResult => {
            this.simpleSessionsResult = simpleSessionsResult;
            // console.log('SessionsComponent.simpleSessionsResult: ' + JSON.stringify(this.simpleSessionsResult));
            this.dataSource = new MatTableDataSource(this.simpleSessionsResult.sessions.content || []);
            // console.log('SessionsComponent.simpleSessionsResult: #3');
          },
          complete: () => {
            this.setIsLoadingEnd();
          }
        });
  }

  @ConfirmationDialogMethod({
    question: (session: SimpleSession): string =>
        `Do you want to delete SimpleEvaluation\xa0#${session.sessionId}`,

    rejectTitle: 'Cancel',
    resolveTitle: 'Delete'
  })
  delete(session: SimpleSession): void {
    this.sessionService
        .sessionDeleteCommit(session.sessionId.toString())
        .subscribe(v => this.getEvaluations(this.simpleSessionsResult.sessions.number));
  }

  prevPage(): void {
    this.getEvaluations((this.simpleSessionsResult.sessions.number - 1));
  }

  nextPage(): void {
    this.getEvaluations((this.simpleSessionsResult.sessions.number + 1));
  }
}
