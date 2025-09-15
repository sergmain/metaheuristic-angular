import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import {ConfirmationDialogInterface, ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {SimpleAuthsResult} from "@services/auth/SimpleAuthsResult";
import {AuthService} from "@services/auth/auth.service";
import {SimpleAuth} from "@services/auth/SimpleAuth";
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
import { CtPre10pxComponent } from '../../ct/ct-pre-10px/ct-pre-10px.component';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'auths',
    templateUrl: './auths.component.html',
    styleUrls: ['./auths.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatSlideToggle, FormsModule, MatButton, RouterLink, CtSectionBodyComponent, CtSectionBodyRowComponent, NgTemplateOutlet, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, CtPre10pxComponent, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, TranslateModule]
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
