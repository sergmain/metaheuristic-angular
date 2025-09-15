import {Component, OnDestroy, OnInit} from '@angular/core';
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
import { NgIf, NgFor } from '@angular/common';
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
    imports: [NgIf, CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, NgFor, MatOption, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton]
})
export class ScenarioMoveComponent extends UIStateComponent implements OnInit, OnDestroy {

    simpleScenarioGroupsAllResult: SimpleScenarioGroupsAllResult;
    scenarioGroupId: string;
    scenarioId: string;
    state: MoveState = MoveState.init;

    form: FormGroup;

    constructor(
        private router: Router,
        private scenarioService: ScenarioService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private settingsService: SettingsService,
        private dialog: MatDialog,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.scenarioGroupId = this.activatedRoute.snapshot.paramMap.get('scenarioGroupId');
        this.scenarioId = this.activatedRoute.snapshot.paramMap.get('scenarioId');
        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.scenarioService
            .getScenarioGroupsAll(this.scenarioGroupId.toString())
            .subscribe(v => {
                this.simpleScenarioGroupsAllResult = v;
                this.simpleScenarioGroupsAllResult.scenarioGroups.forEach((element,index)=>{
                    if(element.scenarioGroupId.toString()===this.scenarioGroupId) {
                        this.simpleScenarioGroupsAllResult.scenarioGroups.splice(index,1);
                    }
                });
                this.state = MoveState.select;
            });

        this.form = new FormGroup({
            group: new FormControl(null),
        });
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
        // console.log("ScenarioMoveComponent.moveScenarioCommit()", JSON.stringify(this.form.value.group));
        let groupId = this.form.value.group.scenarioGroupId.toString();
        this.scenarioService
            .moveScenario(this.scenarioGroupId, this.scenarioId, groupId)
            .subscribe(v => {
                this.state = MoveState.done;
            });
    }

    notToMoveScenario(): boolean {
        return  MhUtils.isNull(this.form.value.group);
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