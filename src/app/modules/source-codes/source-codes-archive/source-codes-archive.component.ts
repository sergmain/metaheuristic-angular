import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { response } from '@src/app/services/source-codes/response';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'source-codes-archive',
  templateUrl: './source-codes-archive.component.html',
  styleUrls: ['./source-codes-archive.component.sass']
})
export class SourceCodesArchiveComponent implements OnInit {
  readonly states = LoadStates;
  currentStates = new Set();
  response: response.sourceCodes.GetArchivedOnly;
  dataSource = new MatTableDataSource<SourceCode>([]);
  columnsToDisplay = ['id', 'uid', 'createdOn', 'valid','locked', 'bts'];
  deletedRows: SourceCode[] = [];

  @ViewChild('nextTable', { static: true }) nextTable: MatButton;
  @ViewChild('prevTable', { static: true }) prevTable: MatButton;
  @ViewChild('table', { static: true }) table: CtTableComponent;

  constructor(
    private dialog: MatDialog,
    private sourceCodesService: SourceCodesService
  ) { }

  ngOnInit() {
    this.currentStates.add(this.states.firstLoading);
    this.updateTable(0);
  }

  updateTable(page: number) {
    this.currentStates.add(this.states.loading);
    this.sourceCodesService.sourceCodes.getArchivedOnly(page.toString())
      .subscribe(
        (response: response.sourceCodes.GetArchivedOnly) => {
          this.response = response;
          this.dataSource = new MatTableDataSource(response.items.content || []);
          this.table.show();
          this.currentStates.delete(this.states.firstLoading);
          this.currentStates.delete(this.states.loading);
          this.prevTable.disabled = this.response.items.first;
          this.nextTable.disabled = this.response.items.last;
        }
      );
  }

  @ConfirmationDialogMethod({
    question: (sourceCode: SourceCode): string =>
      `Do you want to delete SourceCode #${sourceCode.id}`,
    rejectTitle: 'Cancel',
    resolveTitle: 'Delete'
  })
  delete(sourceCode: SourceCode) {
    this.deletedRows.push(sourceCode);
    this.sourceCodesService.sourceCode
      .delete(sourceCode.id.toString())
      .subscribe()

  }

  next() {
    this.table.wait();
    this.prevTable.disabled = true;
    this.nextTable.disabled = true;
    this.updateTable(this.response.items.number + 1);
  }

  prev() {
    this.table.wait();
    this.prevTable.disabled = true;
    this.nextTable.disabled = true;
    this.updateTable(this.response.items.number - 1);
  }

}