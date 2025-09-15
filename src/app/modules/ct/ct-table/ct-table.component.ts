import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    Input,
    OnChanges
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    standalone : true,
    selector: 'ct-table',
    templateUrl: './ct-table.component.html',
    styleUrls: ['./ct-table.component.scss'],
    imports: [MatProgressSpinner]
})
export class CtTableComponent implements OnInit, OnDestroy, OnChanges {
    @Input() isWaiting: boolean;

    state = {
        wait: false
    };

    isFnMode: boolean;

    constructor(private changeDetector: ChangeDetectorRef) { }

    ngOnInit(): void {
        if (this.isWaiting === undefined) {
            this.isFnMode = true;
        } else {
            this.isFnMode = false;
            this.state.wait = this.isWaiting;
        }
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

    }

    ngOnChanges(): void {
        if (this.isFnMode) {

        } else {
            this.state.wait = this.isWaiting;
        }
    }

    wait(): void {
        if (this.isFnMode) {
            this.state.wait = true;
            // eslint-disable-next-line @typescript-eslint/dot-notation
            if (!this.changeDetector['destroyed']) {
                this.changeDetector.detectChanges();
            }
        }
    }
    show(): void {
        if (this.isFnMode) {
            this.state.wait = false;
            // eslint-disable-next-line @typescript-eslint/dot-notation
            if (!this.changeDetector['destroyed']) {
                this.changeDetector.detectChanges();
            }
        }
    }
}