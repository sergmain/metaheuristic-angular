import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExecContextService } from '@src/app/services/exec-context/exec-context.service';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';

@Component({
    selector: 'experiment-task-states',
    templateUrl: './experiment-task-states.component.html',
    styleUrls: ['./experiment-task-states.component.sass']
})
export class ExperimentTaskStatesComponent implements OnInit {

    response: ExecContextStateResult;

    constructor(
        private execContextService: ExecContextService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.execContextService
            .execContextsState(
                this.route.snapshot.paramMap.get('sourceCodeId'),
                this.route.snapshot.paramMap.get('execContextId')
            )
            .subscribe(response => {
                this.response = response;
            });
    }
}
