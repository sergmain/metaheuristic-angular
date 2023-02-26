import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ct-wrap-block',
    templateUrl: './ct-wrap-block.component.html',
    styleUrls: ['./ct-wrap-block.component.scss']
})
export class CtWrapBlockComponent implements OnInit, OnDestroy {

    state = {
        wait: false
    };
    constructor(private changeDetector: ChangeDetectorRef) {}

    ngOnInit() {}

    ngOnDestroy() {
        this.changeDetector.detach();
    }


    wait() {
        this.state.wait = true;
        // eslint-disable-next-line @typescript-eslint/dot-notation
        if (!this.changeDetector['destroyed']) {
            this.changeDetector.detectChanges();
        }
    }
    show() {
        this.state.wait = false;
        // eslint-disable-next-line @typescript-eslint/dot-notation
        if (!this.changeDetector['destroyed']) {
            this.changeDetector.detectChanges();
        }
    }
}