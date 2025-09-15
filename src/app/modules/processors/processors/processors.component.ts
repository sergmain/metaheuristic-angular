import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatDialog, } from '@angular/material/dialog';
import { ConfirmationDialogMethod, ConfirmationDialogInterface } from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import { ProcessorsService } from '@app/services/processors/processors.service';
import { ProcessorsResult } from '@app/services/processors/ProcessorsResult';
import { ProcessorStatus } from '@app/services/processors/ProcessorStatus';
import { SelectionModel } from '@angular/cdk/collections';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { CtPre10pxComponent } from '../../ct/ct-pre-10px/ct-pre-10px.component';
import { MatIconButton, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtTablePaginationComponent } from '../../ct/ct-table-pagination/ct-table-pagination.component';


@Component({
    selector: 'processors',
    templateUrl: './processors.component.html',
    styleUrls: ['./processors.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, MatSlideToggle, FormsModule, CtSectionBodyComponent, CtSectionBodyRowComponent, CtTableComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCheckbox, MatCellDef, MatCell, CtPre10pxComponent, NgFor, MatIconButton, RouterLink, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtTablePaginationComponent, DatePipe]
})

export class ProcessorsComponent extends UIStateComponent implements OnInit, ConfirmationDialogInterface {
    processorResult: ProcessorsResult;
    showStatusOfProcessor: boolean = false;
    dataSource: MatTableDataSource<ProcessorStatus> = new MatTableDataSource<ProcessorStatus>([]);
    selection: SelectionModel<ProcessorStatus> = new SelectionModel<ProcessorStatus>(true, []);
    columnsToDisplay: string[] = ['check', 'id', 'ip', 'description', 'reason', 'cores', 'bts'];
    secondColumnsToDisplay: string[] = ['empty', 'env'];

    constructor(
        readonly dialog: MatDialog,
        private processorsService: ProcessorsService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.updateTable(0);
    }

    updateTable(page: number): void {
        this.isLoading = true;
        this.processorsService
            .init(page.toString())
            .subscribe(processorResult => {
                this.processorResult = processorResult;
                const items: ProcessorStatus[] = processorResult.items.content || [];
                if (items.length) {
                    this.dataSource = new MatTableDataSource(items);
                }
                this.isLoading = false;
            });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    isAllSelected(): boolean {
        return this.selection.selected.length === this.dataSource.data.length;
    }

    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    nextPage(): void {
        this.updateTable(this.processorResult.items.number + 1);
    }

    prevPage(): void {
        this.updateTable(this.processorResult.items.number - 1);
    }

    @ConfirmationDialogMethod({
        question: (processor: ProcessorStatus): string =>
            `Do you want to delete Processor\xa0#${processor.processor.id}`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    delete(processor: ProcessorStatus): void {
        this.processorsService
            .deleteProcessorCommit(processor.processor.id.toString())
            .subscribe(() => this.updateTable(this.processorResult.items.number));
    }

    @ConfirmationDialogMethod({
        question: (): string => `Do you want to delete Processors`,
        rejectTitle: 'Cancel',
        resolveTitle: 'Delete'
    })
    deleteMany(): void {
        this.processorsService
            .processProcessorBulkDeleteCommit(this.selection.selected.map(v => v.processor.id.toString()))
            .subscribe(() => this.updateTable(this.processorResult.items.number));
    }
}