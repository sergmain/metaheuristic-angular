import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '@src/app/services/company/company.service';
import { SimpleCompaniesResult } from '@src/app/services/company/SimpleCompaniesResult';
import { MatTableDataSource } from '@angular/material/table';
import { SimpleCompany } from '@src/app/services/company/SimpleCompany';
import { MatButton } from '@angular/material/button';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { AuthenticationService } from '@src/app/services/authentication';

@Component({
    selector: 'companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.sass']
})
export class CompaniesComponent implements OnInit {
    @ViewChild('nextPageButton', { static: false }) nextTable: MatButton;
    @ViewChild('prevPageButton', { static: false }) prevTable: MatButton;
    @ViewChild('table', { static: false }) table: CtTableComponent;

    columnsToDisplay: string[] = ['uniqueId', 'name', 'bts'];
    simpleCompaniesResult: SimpleCompaniesResult;
    dataSource: MatTableDataSource<SimpleCompany> = new MatTableDataSource([]);

    constructor(
        public authenticationService: AuthenticationService,
        private companyService: CompanyService
    ) { }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(pageNumber: number): void {
        this.companyService.companies(pageNumber.toString()).subscribe(result => {
            this.simpleCompaniesResult = result;
            this.dataSource = new MatTableDataSource(this.simpleCompaniesResult.companies.content);
        });
    }

    nextPage(): void {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.simpleCompaniesResult.companies.number + 1);
    }

    prevPage(): void {
        this.table.wait();
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.simpleCompaniesResult.companies.number - 1);
    }
}
