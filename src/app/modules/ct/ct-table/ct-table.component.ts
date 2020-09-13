import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    Input,
    OnChanges
} from '@angular/core';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'ct-table',
    templateUrl: './ct-table.component.html',
    styleUrls: ['./ct-table.component.scss']
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
            // tslint:disable-next-line: no-string-literal
            if (!this.changeDetector['destroyed']) {
                this.changeDetector.detectChanges();
            }
        }
    }
    show(): void {
        if (this.isFnMode) {
            this.state.wait = false;
            // tslint:disable-next-line: no-string-literal
            if (!this.changeDetector['destroyed']) {
                this.changeDetector.detectChanges();
            }
        }
    }
}