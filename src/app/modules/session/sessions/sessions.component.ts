import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { SessionService } from '@src/app/services/session/session.service';
import { SimpleSessionsResult } from '@src/app/services/session/SimpleSessionsResult';
import { SimpleSession } from '@src/app/services/session/SimpleSession';
import {ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.sass']
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
