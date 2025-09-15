import {Component} from '@angular/core';
import {SettingsService} from '@services/settings/settings.service';
import {MhStatus, RuntimeService, Status} from '@services/runtime/runtime.service';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {map, Observable} from 'rxjs';
import {Clipboard} from '@angular/cdk/clipboard';
import {environment} from '@src/environments/environment';
import { NgIf, AsyncPipe } from '@angular/common';
import { CtContentComponent } from '../../modules/ct/ct-content/ct-content.component';
import { CtColsComponent } from '../../modules/ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../modules/ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../modules/ct/ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../../modules/ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../modules/ct/ct-section-body-row/ct-section-body-row.component';
import { CtEnvMsgOuterComponent } from '../../modules/ct/ct-env-msg-outer/ct-env-msg-outer.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CopyRightComponent } from '../../modules/copy-right/copy-right/copy-right.component';

@Component({
    selector: 'app-index',
    templateUrl: './app-index.component.html',
    styleUrls: ['./app-index.component.scss'],
    imports: [NgIf, CtContentComponent, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtEnvMsgOuterComponent, MatButton, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatTooltip, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatIconButton, CopyRightComponent, AsyncPipe]
})
export class AppIndexComponent {

    private dataSource: MatTableDataSource<MhStatus> = new MatTableDataSource<MhStatus>([]);

    columnsToDisplay: string[] = ['stage', 'status'];
    mhStatusesAsMatTableDataSource$: Observable<MatTableDataSource<MhStatus>>;
    error: string = undefined;

    constructor(
        private settingsService: SettingsService,
        private runtimeService: RuntimeService,
        private clipboard: Clipboard
    ) {
        this.mhStatusesAsMatTableDataSource$ =
            this.runtimeService.mhStatuses.pipe(
                map((statuses) => {
                    const dataSource = this.dataSource;
                    dataSource.data = statuses.statuses
                    this.error = statuses.error;
                    return dataSource;
                })
            );

        this.runtimeService.updateMhStatuses();
    }

    copyErrorToClipboard() {
        this.clipboard.copy(this.runtimeService.getStatusError());
    }

    serverReady() {
        return this.runtimeService.isServerReady();
    }

    isNone(status: MhStatus): boolean {
        return status.status === Status.none;
    }

    isStarted(status: MhStatus): boolean {
        return status.status === Status.started;
    }

    isDone(status: MhStatus): boolean {
        return status.status === Status.done;
    }

    isError(status: MhStatus): boolean {
        return status.status === Status.error;
    }

    isStandalone(): boolean {
        return environment.standalone;
    }
}
