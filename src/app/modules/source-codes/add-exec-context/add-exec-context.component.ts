import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { state } from '@app/helpers/state';
import { ExecContextService } from '@app/services/exec-context/exec-context.service';
import { ExecContextResult } from '@app/services/source-codes/ExecContextResult';
import { SourceCodesService } from '@app/services/source-codes/source-codes.service';
import { SourceCodeResult } from '@app/services/source-codes/SourceCodeResult';
import { NgIf, NgFor } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
@Component({
    standalone : true,
    selector: 'add-exec-context',
    templateUrl: './add-exec-context.component.html',
    styleUrls: ['./add-exec-context.component.scss'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtSectionContentComponent, NgFor]
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