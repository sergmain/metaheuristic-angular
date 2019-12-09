import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatTabGroup, MatTableDataSource } from '@angular/material';
import { ConfirmationDialogInterface, ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { LoadStates } from '@app/enums/LoadStates';
import { PlansService } from '@app/services/plans/plans.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@src/app/app.reducers';
import { PlansArchiveComponent } from '@src/app/components/plans-archive/plans-archive.component';
import { CtTableComponent } from '@src/app/ct/ct-table/ct-table.component';
import { IPlan } from '@src/app/services/plans/IPlan';
import { IPlansState } from '@src/app/services/plans/IPlansState';
import { getPlans } from '@src/app/services/plans/plans.actions';
import { response } from '@src/app/services/plans/response';
import { Subscription } from 'rxjs';

@Component({
    selector: 'plans-view',
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss']
})

export class PlansComponent implements OnInit, OnDestroy, ConfirmationDialogInterface {
    TABINDEX: number = 0;

    states = LoadStates;
    currentStates = new Set();
    response: response.plans.Get;
    dataSource = new MatTableDataSource < IPlan > ([]);
    columnsToDisplay = ['id', 'code', 'createdOn', 'valid', 'bts'];
    deletedPlans: IPlan[] = [];
    archivedPlans: IPlan[] = [];

    storeSubscription: Subscription;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('matTabGroup', { static: true }) matTabGroup: MatTabGroup;
    @ViewChild('table', { static: true }) table: CtTableComponent;
    @ViewChild('plansArchive', { static: true }) plansArchive: PlansArchiveComponent;

    // ############################

    state: IPlansState;

    constructor(
        readonly dialog: MatDialog,
        private planService: PlansService,
        private store: Store < IAppState >
    ) {}

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.updateTable(0);

        this.storeSubscription = this.store.subscribe((state) => {
            this.state = state.plans;
        });
        this.store.dispatch(getPlans({ pageNumber: 0 }));
    }

    ngOnDestroy() {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }


    updateTable(page: number) {
        this.currentStates.add(this.states.loading);
        this.planService.plans
            .get(page)
            .subscribe(
                (response: response.plans.Get) => {
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
        question: (plan: IPlan): string =>
            `Do you want to delete Plan\xa0#${plan.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(plan: IPlan) {
        this.deletedPlans.push(plan);
        this.planService.plan
            .delete(plan.id)
            .subscribe();
    }

    @ConfirmationDialogMethod({
        question: (plan: IPlan): string =>
            `Do you want to archive Plan\xa0#${plan.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Archive'
    })
    archive(plan: IPlan) {
        this.archivedPlans.push(plan);
        this.planService.plan
            .archive(plan.id)
            .subscribe();
    }

    tabChange() {
        if (this.matTabGroup.selectedIndex === 1) {
            this.plansArchive.updateTable(0);
        }
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