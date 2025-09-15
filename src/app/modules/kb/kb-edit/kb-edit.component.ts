import { Component, OnInit } from '@angular/core';
import { Location, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import {SimpleKb} from "@services/kb/SimpleKb";
import {KbService} from "@services/kb/kb.service";
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'kb-edit',
    templateUrl: './kb-edit.component.html',
    styleUrls: ['./kb-edit.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgIf, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionContentComponent, MatFormField, MatLabel, MatInput, FormsModule, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, NgFor, TranslateModule]
})

export class KbEditComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    kb: SimpleKb;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private kbService: KbService,
        private location: Location
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.getApi();
    }

    getApi(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.kbService
            .getKb(id)
            .subscribe(
                (response) => {
                    this.kb = response.kb;
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.firstLoading);
                }
            );
    }

    back() {
        this.location.back();
    }

    save() {
        this.currentStates.add(this.states.wait);
        this.kbService
            .editFormCommit(this.kb.id.toString(), this.kb.params)
            .subscribe(
                (response) => {
                    this.router.navigate(['/dispatcher', 'kbs']);
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                }
            );
    }
}