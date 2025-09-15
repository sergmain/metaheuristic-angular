import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import {ConfirmationDialogInterface, ConfirmationDialogMethod} from "@src/app/components/app-dialog-confirmation/app-dialog-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {SimpleApisResult} from "@services/api/SimpleApisResult";
import {SimpleApi} from "@services/api/SimpleApi";
import {ApiService} from "@services/api/api.service";
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
    selector: 'apis',
    templateUrl: './apis.component.html',
    styleUrls: ['./apis.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatSlideToggle, FormsModule, MatButton, RouterLink, CtSectionBodyComponent, CtSectionBodyRowComponent, NgTemplateOutlet, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, CtPre10pxComponent, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, TranslateModule]
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
