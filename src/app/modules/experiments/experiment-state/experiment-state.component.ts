import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CtStateOfTasksComponent } from '../../ct/ct-state-of-tasks/ct-state-of-tasks.component';

@Component({
    standalone : true,
    selector: 'experiment-state',
    templateUrl: './experiment-state.component.html',
    styleUrls: ['./experiment-state.component.sass'],
    imports: [CtStateOfTasksComponent]
})
export class ExperimentStateComponent implements OnInit {
      private activatedRoute = inject(ActivatedRoute);
    sourceCodeId = signal<string | undefined>(undefined);
    execContextId = signal<string | undefined>(undefined);

    ngOnInit(): void {
        this.sourceCodeId.set(this.activatedRoute.snapshot.paramMap.get('sourceCodeId'));
        this.execContextId.set(this.activatedRoute.snapshot.paramMap.get('execContextId'));
    }
}
