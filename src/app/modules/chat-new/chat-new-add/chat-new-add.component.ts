import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {LoadStates} from '@app/enums/LoadStates';
import {OperationStatusRest} from '@app/models/OperationStatusRest';
import {ApiUid} from '@services/evaluation/ApiUid';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {SettingsService, SettingsServiceEventChange} from '@services/settings/settings.service';
import {Subscription} from 'rxjs';
import {OperationStatus} from '@app/enums/OperationStatus';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {AuthenticationService} from '@services/authentication';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {ChatService} from '@app/modules/chat-new/chat-service';
import {ApiForCompany} from '@app/modules/chat-new/chat-data';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import { NgIf, NgFor } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatInput, MatHint } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'chat-new-add',
    templateUrl: './chat-new-add.component.html',
    styleUrls: ['./chat-new-add.component.scss'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, MatSelect, NgFor, MatOption, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, RouterLink, CtRestStatusComponent, TranslateModule]
})

export class ChatNewAddComponent extends UIStateComponent implements OnInit, OnDestroy {
    readonly states = LoadStates;

    currentStates: Set<LoadStates> = new Set();
    response: ApiForCompany;
    uploadResponse: OperationStatusRest;

    apiUid: ApiUid;
    listOfApis: ApiUid[] = [];
    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private chatService: ChatService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private settingsService: SettingsService,
        readonly authenticationService: AuthenticationService,
    ) {
        super(authenticationService);
    }

    @ViewChild(MatButton) button: MatButton;

    ngOnInit(): void {
        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.updateResponse();
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    updateResponse(): void {
        this.chatService
            .chatAdd()
            .subscribe((response) => {
                this.response = response;
                this.listOfApis = this.response.apis;
                this.isLoading = false;
            });
    }

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.chatService
            .chatAddCommit(
                this.form.value.name,
                this.apiUid.id.toString(),
            )
            .subscribe({
                    next: (response)=> {
                        if (response.status === OperationStatus.OK) {
                            this.router.navigate(['../'], {relativeTo: this.route});
                        }
                    },
                    complete: ()=> {
                        this.currentStates.delete(this.states.wait);
                        subscribe.unsubscribe();
                    }
                }
            );
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    notToCreate() {
        return MhUtils.isNull(this.apiUid) || this.form.invalid;
    }


}