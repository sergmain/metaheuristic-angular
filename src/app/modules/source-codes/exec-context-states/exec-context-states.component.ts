import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SourceCodesService } from '../../../services/source-codes/source-codes.service';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';

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