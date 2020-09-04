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

    response: ExecContextStateResult;

    constructor(
        private sourceCodesService: SourceCodesService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.sourceCodesService.execContext
            .execContextState(
                this.route.snapshot.paramMap.get('sourceCodeId'),
                this.route.snapshot.paramMap.get('execContextId')
            )
            .subscribe(response => {
                this.response = response;
            });
    }
}