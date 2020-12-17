import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '@src/app/services/company/company.service';
import { SimpleCompaniesResult } from '@src/app/services/company/SimpleCompaniesResult';
import { MatTableDataSource } from '@angular/material/table';
import { SimpleCompany } from '@src/app/services/company/SimpleCompany';
import { MatButton } from '@angular/material/button';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { AuthenticationService } from '@src/app/services/authentication';
import { DispatcherAssetModeService } from '@src/app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { UIStateComponent } from '@src/app/models/UIStateComponent';

@Component({
    selector: 'companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.sass']
})
export class CompaniesComponent extends UIStateComponent implements OnInit {
    columnsToDisplay: string[] = ['uniqueId', 'name', 'bts'];
    simpleCompaniesResult: SimpleCompaniesResult;
    dataSource: MatTableDataSource<SimpleCompany> = new MatTableDataSource([]);

    constructor(
        public authenticationService: AuthenticationService,
        private companyService: CompanyService,
        public dispatcherAssetModeService: DispatcherAssetModeService
    ) {
        super()
     }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(pageNumber: number): void {
        this.setIsLoadingStart()
        this.companyService
            .companies(pageNumber.toString())
            .subscribe({
                next: simpleCompaniesResult => {
                    this.simpleCompaniesResult = simpleCompaniesResult;
                    this.dataSource = new MatTableDataSource(this.simpleCompaniesResult.companies.content);
                },
                complete: () => { 
                    this.setIsLoadingEnd()
                }
            })
    }


    prevPage(): void {
        this.updateTable((this.simpleCompaniesResult.companies.number - 1));
    }

    nextPage(): void {
        this.updateTable((this.simpleCompaniesResult.companies.number + 1));
    }
}
