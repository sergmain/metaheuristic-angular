import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadStates} from '@app/enums/LoadStates';
import {OperationStatusRest} from '@app/models/OperationStatusRest';
import {ApiUid} from '@services/evaluation/ApiUid';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {SettingsService, SettingsServiceEventChange} from '@services/settings/settings.service';
import {Subscription} from 'rxjs';
import {OperationStatus} from '@app/enums/OperationStatus';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '@services/authentication';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {ChatService} from '@app/modules/chat-new/chat-service';
import {ApiForCompany} from '@app/modules/chat-new/chat-data';
import {MhUtils} from '@services/mh-utils/mh-utils.service';

@Component({
    selector: 'chat-new-add',
    templateUrl: './chat-new-add.component.html',
    styleUrls: ['./chat-new-add.component.scss']
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