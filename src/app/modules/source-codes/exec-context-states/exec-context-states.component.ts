import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'exec-context-states',
    templateUrl: './exec-context-states.component.html',
    styleUrls: ['./exec-context-states.component.scss']
})
export class ExecContextStatesComponent implements OnInit {

    sourceCodeId: string;
    execContextId: string;

    constructor(
        private route: ActivatedRoute,
    ) {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.execContextId = this.route.snapshot.paramMap.get('execContextId');
    }

    ngOnInit(): void { }
}