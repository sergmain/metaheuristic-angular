import { Injectable } from "@angular/core";
import { environment } from "@src/environments/environment";
import { BehaviorSubject } from "rxjs";
import { BatchService } from "./batch.service";
import { BatchesResult } from "./BatchesResult";
import { ExecStatuses } from "./ExecStatuses";

export interface BatchExexStatusChangesResult {
    isNew: boolean;
    isFinished: boolean;
    isError: boolean;
}

const FINISHED_STATE: number = 4;
const ERROR_STATE: number = -1;

class StatusChecker {
    private records: ExecStatuses[] = []
    write(execStatuses: ExecStatuses) {
        this.records.push(execStatuses)
    }
    masterCheck(callback: (result: BatchExexStatusChangesResult) => void) {
        const next = this.records[this.records.length - 1]
        const prev = this.records[this.records.length - 2]
        if (next && prev) {
            const nextExecStatusMap = new Map(next.statuses.map(v => [v.id, v.state]))
            const prevExecStatusMap = new Map(prev.statuses.map(v => [v.id, v.state]))

            const isNew = this.isNew(prevExecStatusMap, nextExecStatusMap)
            const isFinished = this.checkState(prevExecStatusMap, nextExecStatusMap, FINISHED_STATE)
            const isError = this.checkState(prevExecStatusMap, nextExecStatusMap, ERROR_STATE)

            this.records = [next]
            callback ? callback({ isNew, isFinished, isError }) : null
        }
    }

    private isNew(prevMap: Map<number, number>, nextMap: Map<number, number>): boolean {
        const checks = []
        nextMap.forEach((value, key) => {
            if (prevMap.has(key)) {
                checks.push(false)
            } else {
                checks.push(true)
            }
        })
        if (checks.indexOf(true) > -1) {
            return true
        }
        return false
    }

    checkState(
        prevMap: Map<number, number>,
        nextMap: Map<number, number>,
        state: number
    ) {
        let checks = []
        prevMap.forEach((value, key) => {
            if (prevMap.has(key) && nextMap.has(key)) {
                if (nextMap.get(key) === state) {
                    if (prevMap.get(key) !== state) {
                        checks.push(true)
                    } else {
                        checks.push(false)
                    }
                } else {
                    checks.push(false)
                }
            } else {
                checks.push(false)
            }
        })
        if (checks.indexOf(true) > -1) {
            return true
        }
        return false
    }
}


@Injectable({ providedIn: 'root' })
export class BatchExexStatusService {
    private isIntervalStarted: boolean = false;
    private interval: number = environment.batchInterval || 15000
    private statusChecker = new StatusChecker()

    getStatuses: BehaviorSubject<ExecStatuses> = new BehaviorSubject(null);
    getChanges: BehaviorSubject<BatchExexStatusChangesResult> = new BehaviorSubject(null);

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
                    this.statusChecker.write(result)
                    this.statusChecker.masterCheck(result => this.getChanges.next(result))
                    this.getStatuses.next(result)
                    this.repeatRequest()
                },
                error: () => { }
            });
        }
    }

    private repeatRequest() {
        if (this.isIntervalStarted) {
            setTimeout(() => this.intervalRequset(), this.interval)
        }
    }

    updateBatchesResultByStatuses(batchesResult: BatchesResult, statuses: ExecStatuses) {
        batchesResult?.batches.content.forEach(batch => {
            statuses?.statuses.forEach(status => {
                if (batch.batch.id === status.id) {
                    batch.execState = status.state
                    batch.batch.execState = status.state
                }
            })
        })
    }
}