import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'exec-contexts',
    templateUrl: './exec-contexts.component.html',
    styleUrls: ['./exec-contexts.component.scss']
})
export class ExecContextsComponent {
    sourceCodeId: string;

    constructor(
        private route: ActivatedRoute,
    ) {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
    }

}
