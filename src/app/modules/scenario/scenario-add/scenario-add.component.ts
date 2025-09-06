import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadStates} from '@app/enums/LoadStates';
import {TranslateService} from '@ngx-translate/core';
import {UIStateComponent} from '@src/app/models/UIStateComponent';
import {AuthenticationService} from '@src/app/services/authentication';
import {SettingsService, SettingsServiceEventChange} from '@src/app/services/settings/settings.service';
import {OperationStatus} from '@app/enums/OperationStatus';
import {Subscription} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ScenarioService} from '@services/scenario/scenario.service';

@Component({
    selector: 'scenario-add',
    templateUrl: './scenario-add.component.html',
    styleUrls: ['./scenario-add.component.scss'],
    standalone: false
})

export class ScenarioAddComponent extends UIStateComponent implements OnInit, OnDestroy {
    readonly states = LoadStates;

    currentStates: Set<LoadStates> = new Set();
    scenarioGroupId: string;

    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        description: new FormControl('', [Validators.required, Validators.minLength(5)]),
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
    }

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.scenarioService
            .addScenarioFormCommit(
                this.scenarioGroupId,
                this.form.value.name,
                this.form.value.description
            )
            .subscribe(
                (response) => {
                    if (response.status === OperationStatus.OK) {
                        this.router.navigate(['../scenarios'], { relativeTo: this.activatedRoute });
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
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }

    notToCreate() {
        return this.form.invalid;
    }
}