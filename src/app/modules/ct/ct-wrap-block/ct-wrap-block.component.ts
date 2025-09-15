import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    standalone : true,
    selector: 'ct-wrap-block',
    templateUrl: './ct-wrap-block.component.html',
    styleUrls: ['./ct-wrap-block.component.scss'],
    imports: [MatProgressSpinner]
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