import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import {ConfirmationDialogInterface, ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {SimpleKbsResult} from "@services/kb/SimpleKbsResult";
import {KbService} from "@services/kb/kb.service";
import {SimpleKb} from "@services/kb/SimpleKb";

@Component({
  selector: 'kbs',
  templateUrl: './kbs.component.html',
  styleUrls: ['./kbs.component.scss']
})
export class KbsComponent extends UIStateComponent implements OnInit, ConfirmationDialogInterface {
  columnsToDisplay: string[] = ['id', 'code', 'status', 'bts'];
  secondColumnsToDisplay: string[] = ['empty', 'params'];
  simpleKbsResult: SimpleKbsResult;
  dataSource = new MatTableDataSource<SimpleKb>([]);
  expandParams: boolean = false;

  constructor(
      readonly dialog: MatDialog,
      readonly authenticationService: AuthenticationService,
      private kbService: KbService,
  ) {
    super(authenticationService);
  }

  ngOnInit(): void {
    console.log('kbs.component.ts.ngOnInit()');
    this.getKbs(0);
  }

  getKbs(pageNumber: number): void {
    this.setIsLoadingStart();
    this.kbService
        .getKbs(pageNumber.toString())
        .subscribe({
          next: simpleKbsResult => {
            this.simpleKbsResult = simpleKbsResult;
            console.log('KbsComponent.simpleKbsResult: ' + JSON.stringify(this.simpleKbsResult));
            this.dataSource = new MatTableDataSource(this.simpleKbsResult.kbs.content || []);
            console.log('KbsComponent.simpleKbsResult: #3');
          },
          complete: () => {
            this.setIsLoadingEnd();
          }
        });
  }

  @ConfirmationDialogMethod({
    question: (kb: SimpleKb): string =>
        `Do you want to init KB #${kb.id}`,
    resolveTitle: 'Init',
    rejectTitle: 'Cancel'
  })
  initKb(kb: SimpleKb) {
    this.kbService
        .kbInit(kb.id.toString())
        .subscribe(v => this.getKbs(this.simpleKbsResult.kbs.number));
  }

  @ConfirmationDialogMethod({
    question: (kb: SimpleKb): string =>
        `Do you want to delete KB #${kb.id}`,

    resolveTitle: 'Delete',
    rejectTitle: 'Cancel'
  })
  delete(kb: SimpleKb): void {
    this.kbService
        .kbDeleteCommit(kb.id.toString())
        .subscribe(v => this.getKbs(this.simpleKbsResult.kbs.number));
  }

  prevPage(): void {
    this.getKbs((this.simpleKbsResult.kbs.number - 1));
  }

  nextPage(): void {
    this.getKbs((this.simpleKbsResult.kbs.number + 1));
  }
}
