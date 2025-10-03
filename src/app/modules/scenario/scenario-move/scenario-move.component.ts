import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SettingsService, SettingsServiceEventChange} from '@services/settings/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@services/authentication';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {TranslateService} from '@ngx-translate/core';
import {ScenarioService} from '@services/scenario/scenario.service';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import {SimpleScenarioGroupsAllResult} from '@services/scenario/ScenarioData';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import {MatDialog} from '@angular/material/dialog';

import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';

export enum MoveState {
    init,
    select,
    done
}

/**
 * @title Tree with flat nodes
 */
@Component({
    standalone : true,
    selector: 'scenario-move',
    templateUrl: 'scenario-move.component.html',
    styleUrls: ['scenario-move.component.scss'],
    imports: [CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
})
export class ScenarioMoveComponent extends UIStateComponent implements OnInit, OnDestroy {
      private router = inject(Router);
      private scenarioService = inject(ScenarioService);
      private activatedRoute = inject(ActivatedRoute);
      private translate = inject(TranslateService);
      private settingsService = inject(SettingsService);
      private dialog = inject(MatDialog);
    simpleScenarioGroupsAllResult = signal<SimpleScenarioGroupsAllResult | undefined>(undefined);
    scenarioGroupId = signal<string | undefined>(undefined);
    scenarioId: string;
    state: MoveState = MoveState.init;

    form = signal<FormGroup | undefined>(undefined);

    constructor(public readonly authenticationService: AuthenticationService = inject(AuthenticationService)) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.scenarioGroupId.set(this.activatedRoute.snapshot.paramMap.get('scenarioGroupId'));
        this.scenarioId = this.activatedRoute.snapshot.paramMap.get('scenarioId');
        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.scenarioService
            .getScenarioGroupsAll(this.scenarioGroupId().toString())
            .subscribe(v => {
                this.simpleScenarioGroupsAllResult.set(v);
                this.simpleScenarioGroupsAllResult().scenarioGroups.forEach((element,index)=>{
                    if(element.scenarioGroupId.toString()===this.scenarioGroupId()) {
                        this.simpleScenarioGroupsAllResult().scenarioGroups.splice(index,1);
                    }
                });
                this.state = MoveState.select;
            });

        this.form.set(new FormGroup({
            group: new FormControl(null),
        }));
    }



    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    @ConfirmationDialogMethod({
        question: (): string =>
            `Do you want to move Scenario to another group?`,
        resolveTitle: 'Move',
        rejectTitle: 'Cancel',
        theme: 'primary'
    })
    moveScenarioCommit(): void {
        // console.log("ScenarioMoveComponent.moveScenarioCommit()", JSON.stringify(this.form().value.group));
        let groupId = this.form().value.group.scenarioGroupId.toString();
        this.scenarioService
            .moveScenario(this.scenarioGroupId(), this.scenarioId, groupId)
            .subscribe(v => {
                this.state = MoveState.done;
            });
    }

    notToMoveScenario(): boolean {
        return  MhUtils.isNull(this.form().value.group);
    }

    isInit() {
        return this.state===MoveState.init;
    }
    isSelect() {
        return this.state===MoveState.select;
    }
    isDone() {
        return this.state===MoveState.done;
    }
}