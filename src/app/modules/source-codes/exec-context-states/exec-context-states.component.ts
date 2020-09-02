import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SourceCodesService } from '../../../services/source-codes/source-codes.service';

@Component({
    selector: 'exec-context-states',
    templateUrl: './exec-context-states.component.html',
    styleUrls: ['./exec-context-states.component.scss']
})
export class ExecContextStates implements OnInit {
    sourceCodeId: string;
    execContextId: string;
    stateId: string;

    constructor(
        private sourceCodesService: SourceCodesService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.execContextId = this.route.snapshot.paramMap.get('execContextId');
        this.stateId = this.route.snapshot.paramMap.get('stateId');


        this.sourceCodesService.execContext
            .targetExecState(this.sourceCodeId, this.stateId, this.execContextId)
            .subscribe(response => {
                console.log(response)
            })
    }
}