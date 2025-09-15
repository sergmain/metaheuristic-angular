import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell } from '@angular/material/table';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { CompanyService } from '@app/services/company/company.service';
import { SimpleCompaniesResult } from '@app/services/company/SimpleCompaniesResult';
import { SimpleCompany } from '@app/services/company/SimpleCompany';
import { DispatcherAssetModeService } from '@app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtAlertComponent } from '../../ct/ct-alert/ct-alert.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.sass'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgTemplateOutlet, CtAlertComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, CtTablePaginationComponent, CtTableComponent, MatTable, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, RouterLink]
})
export class CompaniesComponent extends UIStateComponent implements OnInit {
    columnsToDisplay: string[] = ['uniqueId', 'name', 'bts'];
    simpleCompaniesResult: SimpleCompaniesResult;
    dataSource: MatTableDataSource<SimpleCompany> = new MatTableDataSource([]);

    constructor(
        readonly authenticationService: AuthenticationService,
        private companyService: CompanyService,
        public dispatcherAssetModeService: DispatcherAssetModeService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(pageNumber: number): void {
        this.setIsLoadingStart();
        this.companyService
            .companies(pageNumber.toString())
            .subscribe({
                next: simpleCompaniesResult => {
                    this.simpleCompaniesResult = simpleCompaniesResult;
                    this.dataSource = new MatTableDataSource(this.simpleCompaniesResult.companies.content);
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }


    prevPage(): void {
        this.updateTable((this.simpleCompaniesResult.companies.number - 1));
    }

    nextPage(): void {
        this.updateTable((this.simpleCompaniesResult.companies.number + 1));
    }
}
