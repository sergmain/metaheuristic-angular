import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import {ConfirmationDialogInterface, ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {SimpleApisResult} from "@services/api/SimpleApisResult";
import {SimpleApi} from "@services/api/SimpleApi";
import {ApiService} from "@services/api/api.service";

@Component({
    selector: 'apis',
    templateUrl: './apis.component.html',
    styleUrls: ['./apis.component.scss'],
    standalone: false
})
export class ApisComponent extends UIStateComponent implements OnInit, ConfirmationDialogInterface {
  columnsToDisplay: string[] = ['id', 'name', 'code', 'bts'];
  secondColumnsToDisplay: string[] = ['empty', 'scheme'];
  simpleApisResult: SimpleApisResult;
  dataSource = new MatTableDataSource<SimpleApi>([]);
  expandParams: boolean = false;

  constructor(
      readonly dialog: MatDialog,
      readonly authenticationService: AuthenticationService,
      private apiService: ApiService,
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    console.log('apis.component.ts.ngOnInit()');
    this.getApis(0);
  }

  getApis(pageNumber: number): void {
    this.setIsLoadingStart();
    this.apiService
        .getApis(pageNumber.toString())
        .subscribe({
          next: simpleApisResult => {
            this.simpleApisResult = simpleApisResult;
            // console.log('ApisComponent.simpleApisResult: ' + JSON.stringify(this.simpleApisResult));
            this.dataSource = new MatTableDataSource(this.simpleApisResult.apis.content || []);
            // console.log('ApisComponent.simpleApisResult: #3');
          },
          complete: () => {
            this.setIsLoadingEnd();
          }
        });
  }

  @ConfirmationDialogMethod({
    question: (api: SimpleApi): string =>
        `Do you want to delete API #${api.id}`,

    resolveTitle: 'Delete',
    rejectTitle: 'Cancel'
  })
  delete(api: SimpleApi): void {
    this.apiService
        .apiDeleteCommit(api.id.toString())
        .subscribe(v => this.getApis(this.simpleApisResult.apis.number));
  }

  prevPage(): void {
    this.getApis((this.simpleApisResult.apis.number - 1));
  }

  nextPage(): void {
    this.getApis((this.simpleApisResult.apis.number + 1));
  }
}
