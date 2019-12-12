import { BatchExecStatus } from './BatchExecStatus';
import { BehaviorSubject } from 'rxjs';



export class BatchExexStatusComparer {
    private isFirstBacth = true;

    private list: BatchExecStatus[] = [];
    private statuses: number[] = [];

    notification: BehaviorSubject < boolean > = new BehaviorSubject(false);

    constructor(statuses: number[]) {
        this.statuses = statuses;
    }

    takeApart(newList: BatchExecStatus[]) {
        if (this.isFirstBacth) {
            this.isFirstBacth = false;
        } else {
            const differenceList: BatchExecStatus[] = [];

            newList.forEach(newElem => {
                let elem = this.list.find(elem => elem.id === newElem.id);
                if (elem) {
                    // find difference state
                    if (elem.state !== newElem.state) {
                        differenceList.push(newElem);
                    }
                } else {
                    //  new elem
                    differenceList.push(newElem);
                }
            });

            this.checkStatus(differenceList);
        }
        this.list = Array.from(newList);
    }

    private checkStatus(list: BatchExecStatus[]) {
        let exist = false;
        list.forEach(elem => {
            const index: number = this.statuses.findIndex(i => i === elem.state) + 1;
            if (index) {
                exist = true;
            }
        });
        this.notification.next(exist);
    }
}