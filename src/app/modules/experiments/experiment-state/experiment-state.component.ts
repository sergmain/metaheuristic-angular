import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CtStateOfTasksComponent } from '../../ct/ct-state-of-tasks/ct-state-of-tasks.component';

@Component({
    selector: 'experiment-state',
    templateUrl: './experiment-state.component.html',
    styleUrls: ['./experiment-state.component.sass'],
    imports: [CtStateOfTasksComponent]
})
export class ExperimentStateComponent implements OnInit {
    sourceCodeId: string;
    execContextId: string;

    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.sourceCodeId = this.activatedRoute.snapshot.paramMap.get('sourceCodeId');
        this.execContextId = this.activatedRoute.snapshot.paramMap.get('execContextId');
    }
}
