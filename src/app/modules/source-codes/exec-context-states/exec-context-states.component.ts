import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtStateOfTasksComponent } from '../../ct/ct-state-of-tasks/ct-state-of-tasks.component';

@Component({
    selector: 'exec-context-states',
    templateUrl: './exec-context-states.component.html',
    styleUrls: ['./exec-context-states.component.scss'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtStateOfTasksComponent]
})
export class ExecContextStatesComponent implements OnInit {

    sourceCodeId: string;
    execContextId: string;

    constructor(
        private route: ActivatedRoute,
    ) {
        this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
        this.execContextId = this.route.snapshot.paramMap.get('execContextId');
    }

    ngOnInit(): void { }
}