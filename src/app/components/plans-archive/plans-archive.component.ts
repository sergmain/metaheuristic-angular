import { Component, OnInit, ViewChild, } from '@angular/core';
import { MatTableDataSource, MatButton } from '@angular/material';
import { LoadStates } from '@app/enums/LoadStates';
import { PlansResponse } from '@app/models';
import { CtTableComponent } from '@src/app/ct/ct-table/ct-table.component';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { PlansService } from '@src/app/services/plans/plans.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'plans-archive',
    templateUrl: './plans-archive.component.html',
    styleUrls: ['./plans-archive.component.scss']
})
export class PlansArchiveComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response: PlansResponse.Response;
    dataSource = new MatTableDataSource < PlansResponse.Plan > ([]);
    columnsToDisplay = ['id', 'code', 'createdOn', 'valid', 'bts'];
    deletedPlans: (PlansResponse.Plan)[] = [];

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;

    constructor(
        private dialog: MatDialog,
        private plansService: PlansService
    ) {}

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);
    }

    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        this.plansService.plans.getArchivedOnly(page)
            .subscribe(
                (response: PlansResponse.Response) => {
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
        question: (plan: PlansResponse.Plan): string =>
            `Do you want to delete Plan #${plan.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(plan: PlansResponse.Plan) {
        this.deletedPlans.push(plan);
        this.plansService.plan
            .delete(plan.id)
            .subscribe();

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