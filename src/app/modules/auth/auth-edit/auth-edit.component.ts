import { Component, OnInit } from '@angular/core';
import { Location, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import {SimpleAuth} from "@services/auth/SimpleAuth";
import {AuthService} from "@services/auth/auth.service";
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MIN_PROMPT_LEN} from '@app/modules/mh-consts';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'auth-edit',
    templateUrl: './auth-edit.component.html',
    styleUrls: ['./auth-edit.component.scss'],
    imports: [CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, NgIf, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, CdkTextareaAutosize, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, NgFor, TranslateModule]
})

export class AuthEditComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    auth: SimpleAuth;
    authId: string;

    form = new FormGroup({
        params: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private location: Location
    ) { }

    ngOnInit() {
        this.authId = this.route.snapshot.paramMap.get('authId');
        this.currentStates.add(this.states.firstLoading);
        this.getApi();
    }

    getApi(): void {
        this.authService
            .getAuth(this.authId)
            .subscribe(
                (response) => {
                    this.auth = response.auth;
                    this.form = new FormGroup({
                        params: new FormControl(this.auth.params, [Validators.required, Validators.minLength(5)]),
                    });

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
        this.authService
            .editFormCommit(this.authId, this.form.value.params)
            .subscribe(
                (response) => {
                    this.router.navigate(['/mhbp', 'auth']);
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                }
            );
    }
}