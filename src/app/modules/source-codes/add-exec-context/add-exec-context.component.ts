import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { state } from '@app/helpers/state';
import { ExecContextResult } from '@src/app/services/source-codes/ExecContextResult';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCodeResult } from '@src/app/services/source-codes/SourceCodeResult';
@Component({
    selector: 'add-exec-context',
    templateUrl: './add-exec-context.component.html',
    styleUrls: ['./add-exec-context.component.scss']
})

export class AddExecContextComponent implements OnInit, OnDestroy {
    readonly states = LoadStates;
    currentStates: Set<LoadStates> = new Set();
    state: LoadStates = state;
    currentState: LoadStates = state.show;
    variable: string;
    responseSingle: ExecContextResult;
    sourceCodeId: string;
    sourceCodeResponse: SourceCodeResult;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sourceCodesService: SourceCodesService,
    ) { }

    ngOnInit(): void {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService.sourceCode.get(this.sourceCodeId).subscribe(v => {
            this.sourceCodeResponse = v;
        });
    }

    ngOnDestroy(): void { }

    cancel(): void {
        this.router.navigate(['/dispatcher', 'source-codes', this.route.snapshot.paramMap.get('sourceCodeId'), 'exec-contexts']);
    }

    createWithVariable(): void {
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