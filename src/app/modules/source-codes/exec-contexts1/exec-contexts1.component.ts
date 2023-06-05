import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'exec-contexts1',
    templateUrl: './exec-contexts1.component.html',
    styleUrls: ['./exec-contexts1.component.scss']
})
export class ExecContexts1Component {
    sourceCodeId: string;

    constructor(
        private route: ActivatedRoute,
    ) {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
    }

}
