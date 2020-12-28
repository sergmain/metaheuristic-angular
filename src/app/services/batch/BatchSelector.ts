import { BatchData } from './BatchData';

export class BatchSelector {
    constructor() { }

    protected list: number[] = [];

    protected getId(batchData: BatchData.BatchExecInfo): number {
        return batchData.batch.id;
    }

    toggle(batchData: BatchData.BatchExecInfo): void {
        if (this.isSelected(batchData)) {
            this.list.splice(this.list.indexOf(this.getId(batchData)), 1);
        } else {
            this.list.push(this.getId(batchData));
        }
        this.list.sort((a, z) => a - z);
    }

    isSelected(batchData: BatchData.BatchExecInfo): boolean {
        if (this.list.indexOf(this.getId(batchData)) === -1) {
            return false;
        } else {
            return true;
        }
    }

    clear(): void {
        this.list = [];
    }

    get size(): number {
        return this.list.length;
    }

    getList(): number[] {
        return [...this.list];
    }
}
