import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { state } from '@app/helpers/state';
import { ExecContextService } from '@src/app/services/exec-context/exec-context.service';
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
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private sourceCodesService: SourceCodesService,
        private execContextService: ExecContextService
    ) { }

    ngOnInit(): void {
        this.sourceCodeId = this.activatedRoute.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService
            .edit(this.sourceCodeId)
            .subscribe(sourceCodeResult => {
                this.sourceCodeResponse = sourceCodeResult;
            });
    }

    ngOnDestroy(): void { }

    cancel(): void {
        this.router.navigate(['../../', 'exec-contexts'], { relativeTo: this.activatedRoute });
    }

    createWithVariable(): void {
        this.currentStates.add(this.states.loading);
        this.execContextService
            .execContextAddCommit(this.sourceCodeId, this.variable)
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