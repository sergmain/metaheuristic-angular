import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import {SessionService} from "@services/session/session.service";
import {ErrorsResult} from "@services/session/ErrorsResult";
import {SimpleError} from "@services/session/SimpleError";
import { NgIf } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';

@Component({
    standalone : true,
    selector: 'errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent]
})
export class ErrorsComponent extends UIStateComponent implements OnInit {
    dataSource: MatTableDataSource<SimpleError> = new MatTableDataSource<SimpleError>([]);
    columnsToDisplay: string[] = ['id', 'p', 'a'];
    errorsResult: ErrorsResult;
    sessionId: string;

    constructor(
        private sessionService: SessionService,
        private activatedRoute: ActivatedRoute,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.sessionId = this.activatedRoute.snapshot.paramMap.get('sessionId');
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.setIsLoadingStart();
        this.sessionService
            .errors(page.toString(), this.sessionId)
            .subscribe({
                next: accountsResult => {
                    this.errorsResult = accountsResult;
                    this.dataSource = new MatTableDataSource(this.errorsResult.errors.content || []);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    nextPage(): void {
        this.updateTable(this.errorsResult.errors.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.errorsResult.errors.number - 1);
    }
}
