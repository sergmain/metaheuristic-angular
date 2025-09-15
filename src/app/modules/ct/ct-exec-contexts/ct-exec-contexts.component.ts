import {Component, Input, NgModule, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationDialogMethod } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ExecContextState } from '@app/enums/ExecContextState';
import { ExecContextService } from '@app/services/exec-context/exec-context.service';
import { ExecContext } from '@app/services/source-codes/ExecContext';
import { ExecContextsResult } from '@app/services/source-codes/ExecContextsResult';
import { SourceCodesService } from '@app/services/source-codes/source-codes.service';
import { CtSectionComponent } from '../ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../ct-heading/ct-heading.component';
import { NgIf, DatePipe } from '@angular/common';
import { CtSectionBodyComponent } from '../ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../ct-table/ct-table.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CtSectionFooterComponent } from '../ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../ct-section-footer-row/ct-section-footer-row.component';
import { CtStateOfTasksComponent } from '../ct-state-of-tasks/ct-state-of-tasks.component';


@Component({
    selector: 'ct-exec-contexts',
    templateUrl: './ct-exec-contexts.component.html',
    styleUrls: ['./ct-exec-contexts.component.scss'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgIf, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, MatIconButton, MatIcon, MatTooltip, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, RouterLink, MatDialogActions, MatDialogClose, CtStateOfTasksComponent, DatePipe]
})
export class CtExecContextsComponent implements OnInit {
    @ViewChild('stateOfTasksTemplate') stateOfTasksTemplate: TemplateRef<any>;
    @ViewChild('errorDialogTemplate') errorDialogTemplate: TemplateRef<any>;

    @Input() sourceCodeId: string;
    @Input() modal: boolean;

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;

    readonly execState = ExecContextState;

    response: ExecContextsResult;
    execContextTableSource: MatTableDataSource<ExecContext> = new MatTableDataSource<ExecContext>([]);
    execContextColumnsToDisplay: string[] = [
        'id',
        'createdOn',
        'isExecContextValid',
        'execState',
        'completedOn',
        'bts'
    ];

    execContextId: string;

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private execContextService: ExecContextService,
        private sourceCodesService: SourceCodesService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        //console.log("modal, modalBool", this.modal);

        // this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.getExecContexts(0);
    }

    getExecContexts(page: number): void {
        this.execContextService
            .execContexts(this.sourceCodeId, page.toString())
            .subscribe(execContextsResult => {
                this.response = execContextsResult;
                if (execContextsResult) {
                    this.execContextTableSource = new MatTableDataSource(execContextsResult.instances.content);
                    this.prevTable.disabled = execContextsResult.instances.first;
                    this.nextTable.disabled = execContextsResult.instances.last;
                }
            });
    }

    @ConfirmationDialogMethod({
        question: (execContext: ExecContext): string =>
            `Do you want to delete ExecContext\xa0#${execContext.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(execContext: ExecContext): void {
        this.execContextService
            .execContextDeleteCommit(this.sourceCodeId, execContext.id?.toString?.())
            .subscribe(v => this.getExecContexts(this.response.instances.number));
    }

    next(): void {
        this.getExecContexts(this.response.instances.number + 1);
    }

    prev(): void {
        this.getExecContexts(this.response.instances.number - 1);
    }

    runExecState(id, state): void {
        this.execContextService
            .execContextTargetState(this.sourceCodeId, state, id)
            .subscribe(v => this.getExecContexts(this.response.instances.number));
    }

    stop(el, event): void {
        event.target.disabled = true;
        this.runExecState(el.id, 'STOPPED');
    }

    start(el, event): void {
        event.target.disabled = true;
        this.runExecState(el.id, 'STARTED');
    }

    produce(el, event): void {
        event.target.disabled = true;
        this.runExecState(el.id, 'PRODUCING');
    }


    stateOfTasks(el) {
        this.dialog.closeAll();
        this.execContextId = el.id;
        this.dialog.open(this.stateOfTasksTemplate, {
            width: '90%'
        });
    }
}