import { Component, inject, signal } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CtExecContextsComponent } from '../../ct/ct-exec-contexts/ct-exec-contexts.component';


@Component({
    standalone : true,
    selector: 'exec-contexts',
    templateUrl: './exec-contexts.component.html',
    styleUrls: ['./exec-contexts.component.scss'],
    imports: [CtExecContextsComponent]
})
export class ExecContextsComponent {
      private route = inject(ActivatedRoute);
    sourceCodeId = signal<string | undefined>(undefined);

    constructor(
) {
        this.sourceCodeId.set(this.route.snapshot.paramMap.get('sourceCodeId'));
    }

}
