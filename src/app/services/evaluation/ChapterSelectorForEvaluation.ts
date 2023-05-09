import {EvaluationData} from "./EvaluationData";

export class ChapterSelectorForEvaluation {
    constructor() { }

    protected list: number[] = [];

    protected getId(evaluationInfo: EvaluationData.EvaluationInfo): number {
        return evaluationInfo.evaluationId;
    }

    toggle(batchData: EvaluationData.EvaluationInfo): void {
        if (this.isSelected(batchData)) {
            this.list.splice(this.list.indexOf(this.getId(batchData)), 1);
        } else {
            this.list.push(this.getId(batchData));
        }
        this.list.sort((a, z) => a - z);
    }

    isSelected(evaluationInfo: EvaluationData.EvaluationInfo): boolean {
        return this.list.indexOf(this.getId(evaluationInfo)) !== -1;
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
