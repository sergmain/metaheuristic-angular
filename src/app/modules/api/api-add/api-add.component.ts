import {Component, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {LoadStates} from '@app/enums/LoadStates';
import {DefaultResponse} from '@app/models/DefaultResponse';
import {OperationStatus} from '@app/enums/OperationStatus';
import {Subscription} from 'rxjs';
import {MatButton} from "@angular/material/button";
import {ApiService} from "@services/api/api.service";
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'api-add',
    templateUrl: './api-add.component.html',
    styleUrls: ['./api-add.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, CdkTextareaAutosize, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, RouterLink, TranslateModule]
})

export class ApiAddComponent {
    readonly states = LoadStates;
    currentStates = new Set();
    response: DefaultResponse;
    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        code: new FormControl('', [Validators.required, Validators.minLength(3)]),
        scheme: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private apiService: ApiService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    @ViewChild(MatButton) button: MatButton;

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.apiService
            .addFormCommit(
                this.form.value.name,
                this.form.value.code,
                this.form.value.scheme
            )
            .subscribe(
                (response) => {
                    if (response.status === OperationStatus.OK) {
                        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
                    }
                },
                () => {},
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
    }
}