import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { BatchService } from '@services/batch/batch.service';
import { BatchesResult } from '@services/batch/BatchesResult';
import { ExecStatuses } from '@services/batch/ExecStatuses';

export interface BatchExecStatusChangesResult {
    isNew: boolean;
    isFinished: boolean;
    isError: boolean;
}

const FINISHED_STATE: number = 4;
const ERROR_STATE: number = -1;

class StatusChecker {
    private records: ExecStatuses[] = [];

    write(execStatuses: ExecStatuses): void {
        this.records.push(execStatuses);
    }

    masterCheck(callback: (result: BatchExecStatusChangesResult) => void): void {
        const next: ExecStatuses = this.records[this.records.length - 1];
        const prev: ExecStatuses = this.records[this.records.length - 2];
        if (next && prev) {
            const nextExecStatusMap: Map<number, number> = new Map(next.statuses.map(v => [v.id, v.state]));
            const prevExecStatusMap: Map<number, number> = new Map(prev.statuses.map(v => [v.id, v.state]));

            const isNew: boolean = this.isNew(prevExecStatusMap, nextExecStatusMap);
            const isFinished: boolean = this.checkState(prevExecStatusMap, nextExecStatusMap, FINISHED_STATE);
            const isError: boolean = this.checkState(prevExecStatusMap, nextExecStatusMap, ERROR_STATE);

            this.records = [next];
            if (callback) { callback({ isNew, isFinished, isError }); }
        }
    }

    private isNew(prevMap: Map<number, number>, nextMap: Map<number, number>): boolean {
        const checks: boolean[] = [];
        nextMap.forEach((value, key) => {
            if (prevMap.has(key)) {
                checks.push(false);
            } else {
                checks.push(true);
            }
        });
        return checks.indexOf(true) > -1;
    }

    checkState(
        prevMap: Map<number, number>,
        nextMap: Map<number, number>,
        state: number
    ): boolean {
        const checks: boolean[] = [];
        prevMap.forEach((value, key) => {
            if (prevMap.has(key) && nextMap.has(key)) {
                if (nextMap.get(key) === state) {
                    if (prevMap.get(key) !== state) {
                        checks.push(true);
                    } else {
                        checks.push(false);
                    }
                } else {
                    checks.push(false);
                }
            } else {
                checks.push(false);
            }
        });
        return checks.indexOf(true) > -1;
    }
}


@Injectable({ providedIn: 'root' })
export class BatchExecStatusService {
    private isIntervalStarted: boolean = false;
    private interval: number = environment.batchInterval || 15000;
    private statusChecker: StatusChecker = new StatusChecker();

    getStatuses: BehaviorSubject<ExecStatuses> = new BehaviorSubject(null);
    getChanges: BehaviorSubject<BatchExecStatusChangesResult> = new BehaviorSubject(null);

    constructor(private batchService: BatchService) { }

    stopIntervalRequset(): void {
        this.isIntervalStarted = false;
    }

    startIntervalRequset(): void {
        if (this.isIntervalStarted) { }
        else {
            this.isIntervalStarted = true;
            this.intervalRequset();
        }
    }

    private intervalRequset(): void {
        if (this.isIntervalStarted) {
            this.batchService.batchExecStatuses().subscribe({
                next: result => {
                    this.statusChecker.write(result);
                    this.statusChecker.masterCheck(r => this.getChanges.next(r));
                    this.getStatuses.next(result);
                    this.repeatRequest();
                },
                error: () => { }
            });
        }
    }

    private repeatRequest(): void {
        if (this.isIntervalStarted) {
            setTimeout(() => this.intervalRequset(), this.interval);
        }
    }

    updateBatchesResultByStatuses(batchesResult: BatchesResult, statuses: ExecStatuses): void {
        batchesResult?.batches.content.forEach(batch => {
            statuses?.statuses.forEach(status => {
                if (batch.batch.id === status.id) {
                    batch.execState = status.state;
                    batch.batch.execState = status.state;
                }
            });
        });
    }
}