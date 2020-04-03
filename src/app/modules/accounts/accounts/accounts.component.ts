import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { LoadStates } from '@app/enums/LoadStates';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { Account } from '@src/app/services/accounts/Account';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'accounts-view',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss']
})

export class AccountsComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();

    dataSource = new MatTableDataSource<Account>([]);
    columnsToDisplay = ['id', 'isEnabled', 'login', 'publicName', 'createdOn', 'bts'];

    response;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;

    constructor(
        private accountsService: AccountsService
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        this.accountsService.accounts
            .get(page.toString())
            .subscribe(response => {
                this.response = response;
                this.dataSource = new MatTableDataSource(this.response.accounts.content || []);
                this.prevTable.disabled = this.response.accounts.first;
                this.nextTable.disabled = this.response.accounts.last;
                this.table.show();
                this.currentStates.delete(this.states.firstLoading);
                this.currentStates.delete(this.states.loading);
            });
    }

    next() {
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.accounts.number + 1);
        this.table.wait();
    }

    prev() {
        this.prevTable.disabled = true;
        this.nextTable.disabled = true;
        this.updateTable(this.response.accounts.number - 1);
        this.table.wait();
    }

}