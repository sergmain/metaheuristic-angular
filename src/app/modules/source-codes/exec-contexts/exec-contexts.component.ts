import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CtExecContextsComponent } from '../../ct/ct-exec-contexts/ct-exec-contexts.component';


@Component({
    selector: 'exec-contexts',
    templateUrl: './exec-contexts.component.html',
    styleUrls: ['./exec-contexts.component.scss'],
    imports: [CtExecContextsComponent]
})
export class ExecContextsComponent {
    sourceCodeId: string;

    constructor(
        private route: ActivatedRoute,
    ) {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
    }

}
