import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import {ConfirmationDialogInterface, ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {SimpleAuthsResult} from "@services/auth/SimpleAuthsResult";
import {AuthService} from "@services/auth/auth.service";
import {SimpleAuth} from "@services/auth/SimpleAuth";

@Component({
    selector: 'auths',
    templateUrl: './auths.component.html',
    styleUrls: ['./auths.component.scss'],
    standalone: false
})
export class AuthsComponent extends UIStateComponent implements OnInit, ConfirmationDialogInterface {
  columnsToDisplay: string[] = ['id', 'code', 'bts'];
  secondColumnsToDisplay: string[] = ['empty', 'params'];
  simpleAuthsResult: SimpleAuthsResult;
  dataSource = new MatTableDataSource<SimpleAuth>([]);
  expandParams: boolean = false;

  constructor(
      readonly dialog: MatDialog,
      readonly authenticationService: AuthenticationService,
      private authService: AuthService,
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    console.log('auths.component.ts.ngOnInit()');
    this.getAuths(0);
  }

  getAuths(pageNumber: number): void {
    this.setIsLoadingStart();
    this.authService
        .getAuths(pageNumber.toString())
        .subscribe({
          next: simpleAuthsResult => {
            this.simpleAuthsResult = simpleAuthsResult;
            console.log('ApisComponent.simpleAuthsResult: ' + JSON.stringify(this.simpleAuthsResult));
            this.dataSource = new MatTableDataSource(this.simpleAuthsResult.auths.content || []);
            console.log('ApisComponent.simpleAuthsResult: #3');
          },
          complete: () => {
            this.setIsLoadingEnd();
          }
        });
  }

  @ConfirmationDialogMethod({
    question: (auth: SimpleAuth): string =>
        `Do you want to delete Auth params of API #${auth.id}`,

    resolveTitle: 'Delete',
    rejectTitle: 'Cancel'
  })
  delete(auth: SimpleAuth): void {
    this.authService
        .authDeleteCommit(auth.id.toString())
        .subscribe(v => this.getAuths(this.simpleAuthsResult.auths.number));
  }

  prevPage(): void {
    this.getAuths((this.simpleAuthsResult.auths.number - 1));
  }

  nextPage(): void {
    this.getAuths((this.simpleAuthsResult.auths.number + 1));
  }
}
