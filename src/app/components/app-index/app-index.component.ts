import {Component} from '@angular/core';
import {SettingsService} from '@services/settings/settings.service';
import {MhStatus, RuntimeService, Status} from '@services/runtime/runtime.service';
import {MatTableDataSource} from '@angular/material/table';
import {map, Observable} from 'rxjs';

@Component({
    selector: 'app-index',
    templateUrl: './app-index.component.html',
    styleUrls: ['./app-index.component.scss']
})
export class AppIndexComponent {

    private dataSource: MatTableDataSource<MhStatus> = new MatTableDataSource<MhStatus>([]);

    columnsToDisplay: string[] = ['stage', 'status'];
    mhStatusesAsMatTableDataSource$: Observable<MatTableDataSource<MhStatus>>;
    error: string = undefined;

    constructor(
        private settingsService: SettingsService,
        private runtimeService: RuntimeService,
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
}
