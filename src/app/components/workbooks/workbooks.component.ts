import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { WorkbookExecState } from '@app/enums/WorkbookExecState';
import { PlansService } from '@app/services/plans/plans.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@src/app/app.reducers';
import { IPlan } from '@src/app/services/plans/IPlan';
import { IPlansState } from '@src/app/services/plans/IPlansState';
import { IWorkbook } from '@src/app/services/plans/IWorkbook';
import { deleteWorkbook, getWorkbooks } from '@src/app/services/plans/plans.actions';
import { Subscription } from 'rxjs';
import { ConfirmationDialogMethod } from '../app-dialog-confirmation/app-dialog-confirmation.component';
import { response } from '@src/app/services/plans/response';


@Component({
    selector: 'workbooks-view',
    templateUrl: './workbooks.component.html',
    styleUrls: ['./workbooks.component.scss']
})
export class WorkbooksComponent implements OnInit, OnDestroy {
    readonly execState = WorkbookExecState;

    @ViewChild('nextTable') nextTable: MatButton;
    @ViewChild('prevTable') prevTable: MatButton;

    storeSubscription: Subscription;
    plan: IPlan;
    planId: string;
    workbooksResponse: response.workbooks.Get;
    workbooksTableSource = new MatTableDataSource < IWorkbook > ([]);
    workbooksColumnsToDisplay = [
        'id',
        'planCode',
        'inputResourceParam',
        'createdOn',
        'isPlanValid',
        'isWorkbookValid',
        'execState',
        'completedOn',
        'bts'
    ];

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private plansService: PlansService,
        private store: Store < IAppState >
    ) {}

    ngOnInit() {
        this.planId = this.route.snapshot.paramMap.get('planId');
        this.storeSubscription = this.store.subscribe((state: IAppState) => {
            this.workbooksResponse = state.plans.getWorkbooksResponse;
            if (this.workbooksResponse) {
                this.plan = Object.values(this.workbooksResponse.plans)[0];
                this.workbooksTableSource = new MatTableDataSource(this.workbooksResponse.instances.content);
                this.prevTable.disabled = this.workbooksResponse.instances.first;
                this.nextTable.disabled = this.workbooksResponse.instances.last;
            }
        });
        this.store.dispatch(getWorkbooks({
            planId: this.planId,
            pageNumber: 0
        }));
    }

    ngOnDestroy() {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    @ConfirmationDialogMethod({
        question: (workbook: IWorkbook): string =>
            `Do you want to delete Workbook\xa0#${workbook.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(workbook: IWorkbook) {
        workbook.__deleted = true;
        this.store.dispatch(deleteWorkbook({
            planId: workbook.planId.toString(),
            workbookId: workbook.id.toString()
        }));
    }

    next() {
        this.store.dispatch(
            getWorkbooks({
                planId: this.planId,
                pageNumber: this.workbooksResponse.instances.number + 1
            })
        );
    }

    prev() {
        this.store.dispatch(
            getWorkbooks({
                planId: this.planId,
                pageNumber: this.workbooksResponse.instances.number - 1
            })
        );
    }

    runExecState(id, state) {
        this.plansService.workbook
            .targetExecState(this.planId, state, id)
            .subscribe((response) => {
                this.store.dispatch(getWorkbooks({
                    planId: this.planId,
                    pageNumber: this.workbooksResponse.instances.number
                }));
            });
    }

    stop(el, event) {
        event.target.disabled = true;
        this.runExecState(el.id, 'STOPPED');
    }

    start(el, event) {
        event.target.disabled = true;
        this.runExecState(el.id, 'STARTED');
    }

    produce(el, event) {
        event.target.disabled = true;
        this.runExecState(el.id, 'PRODUCED');
    }
}