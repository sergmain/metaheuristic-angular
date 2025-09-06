import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'experiment-state',
    templateUrl: './experiment-state.component.html',
    styleUrls: ['./experiment-state.component.sass'],
    standalone: false
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
