import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SourceCodesService } from '../../../services/source-codes/source-codes.service';

@Component({
    selector: 'exec-context-states',
    templateUrl: './exec-context-states.component.html',
    styleUrls: ['./exec-context-states.component.scss']
})
export class ExecContextStatesComponent implements OnInit {
    constructor(
        private sourceCodesService: SourceCodesService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.sourceCodesService.execContext
            .targetExecState(
                this.route.snapshot.paramMap.get('sourceCodeId'),
                this.route.snapshot.paramMap.get('state'),
                this.route.snapshot.paramMap.get('id')
            )
            .subscribe(response => {
                console.log(response);
            });
    }
}