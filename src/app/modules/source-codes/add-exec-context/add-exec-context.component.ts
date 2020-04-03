import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { state } from '@app/helpers/state';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
@Component({
    selector: 'add-exec-context',
    templateUrl: './add-exec-context.component.html',
    styleUrls: ['./add-exec-context.component.scss']
})

export class AddExecContextComponent implements OnInit, OnDestroy {
    readonly states = LoadStates;
    currentStates = new Set();
    state = state;
    currentState = state.show;
    variable: string;
    responseSingle;
    sourceCodeId: string;
    sourceCodeResponse;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sourceCodesService: SourceCodesService,
    ) { }

    ngOnInit() {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService.sourceCode.get(this.sourceCodeId).subscribe(v => {
            this.sourceCodeResponse = v;
        });
    }

    ngOnDestroy() { }

    cancel() {
        this.router.navigate(['/dispatcher', 'source-codes', this.route.snapshot.paramMap.get('sourceCodeId'), 'exec-contexts']);
    }

    createWithVariable() {
        this.currentStates.add(this.states.loading);
        this.sourceCodesService.execContext
            .addCommit(this.sourceCodeId, this.variable)
            .subscribe(response => {
                if (response.errorMessages) {
                    this.responseSingle = response;
                } else {
                    this.cancel();
                }
                this.currentStates.delete(this.states.loading);
            });
    }
}