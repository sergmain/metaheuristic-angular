import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { CompanyService } from '@src/app/services/company/company.service';
import { SimpleCompaniesResult } from '@src/app/services/company/SimpleCompaniesResult';
import { SimpleCompany } from '@src/app/services/company/SimpleCompany';
import { DispatcherAssetModeService } from '@src/app/services/dispatcher-asset-mode/dispatcher-asset-mode.service';

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
