import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import {ConfirmationDialogInterface, ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {SimpleKbsResult} from "@services/kb/SimpleKbsResult";
import {KbService} from "@services/kb/kb.service";
import {SimpleKb} from "@services/kb/SimpleKb";
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatIcon } from '@angular/material/icon';
import { CtPre10pxComponent } from '../../ct/ct-pre-10px/ct-pre-10px.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'kbs',
    templateUrl: './kbs.component.html',
    styleUrls: ['./kbs.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatSlideToggle, FormsModule, MatButton, RouterLink, CtSectionBodyComponent, CtSectionBodyRowComponent, NgTemplateOutlet, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIcon, CtPre10pxComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, TranslateModule]
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
