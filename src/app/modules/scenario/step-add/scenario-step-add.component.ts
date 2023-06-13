import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadStates} from '@app/enums/LoadStates';
import {TranslateService} from '@ngx-translate/core';
import {UIStateComponent} from '@src/app/models/UIStateComponent';
import {AuthenticationService} from '@src/app/services/authentication';
import {SettingsService, SettingsServiceEventChange} from '@src/app/services/settings/settings.service';
import {ApiUid} from '@services/evaluation/ApiUid';
import {OperationStatus} from '@app/enums/OperationStatus';
import {Subscription} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ScenarioService} from '@services/scenario/scenario.service';
import {ScenarioUidsForAccount} from '@services/scenario/ScenarioUidsForAccount';

@Component({
    selector: 'scenario-step-add',
    templateUrl: './scenario-step-add.component.html',
    styleUrls: ['./scenario-step-add.component.scss']
})

export class ScenarioStepAddComponent extends UIStateComponent implements OnInit, OnDestroy {
    readonly states = LoadStates;

    currentStates: Set<LoadStates> = new Set();
    response: ScenarioUidsForAccount;
    scenarioGroupId: string;
    scenarioId: string;

    apiUid: ApiUid;
    listOfApis: ApiUid[] = [];
    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        prompt: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    constructor(
        private scenarioService: ScenarioService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private settingsService: SettingsService,
        readonly authenticationService: AuthenticationService,
    ) {
        super(authenticationService);
    }

    @ViewChild(MatButton) button: MatButton;

    ngOnInit(): void {
        this.scenarioGroupId = this.activatedRoute.snapshot.paramMap.get('scenarioGroupId');
        this.scenarioId = this.activatedRoute.snapshot.paramMap.get('scenarioId');
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
        this.scenarioService
            .scenarioStepAdd()
            .subscribe((response) => {
                this.response = response;
                this.listOfApis = this.response.apis;
                this.isLoading = false;
            });
    }

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.scenarioService
            .addOrSaveScenarioStepFormCommit(
                this.scenarioGroupId,
                this.scenarioId,
                null,
                null,
                this.form.value.name,
                this.form.value.prompt,
                this.apiUid.id.toString(),
                'some code',
                null,
                null,
                'false',
                null
            )
            .subscribe(
                (response) => {
                    if (response.status === OperationStatus.OK) {
                        this.router.navigate(['../steps'], { relativeTo: this.activatedRoute });
                    }
                },
                () => {},
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
    }

    back(): void {
        this.router.navigate(['../steps'], { relativeTo: this.activatedRoute });
    }

    notToCreate() {
        return this.apiUid==null || this.form.invalid;
    }
}