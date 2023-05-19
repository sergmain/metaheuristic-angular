import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RoleRouteGuard} from "@app/guards/role-route.guard";
import {Role} from "@services/authentication";
import {ScenarioGroupsComponent} from "./scenario-groups/scenario-groups.component";
import {ScenariosComponent} from "./scenarios/scenarios.component";
import {ScenarioGroupAddComponent} from "./scenario-group-add/scenario-group-add.component";
import {ScenarioAddComponent} from "@app/modules/scenario/scenario-add/scenario-add.component";
import {ScenarioStepsComponent} from "@app/modules/scenario/steps/scenario-steps.component";
import {ScenarioStepAddComponent} from "@app/modules/scenario/step-add/scenario-step-add.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatTableModule} from "@angular/material/table";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ScenarioDetailsComponent} from '@app/modules/scenario/scenario-details/scenario-details.component';

export const ScenarioRoutes: Routes = [
    {
        path: '',
        component: ScenarioGroupsComponent
    },
    {
        path: 'scenario-group-add',
        component: ScenarioGroupAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':scenarioGroupId/scenario-add',
        component: ScenarioAddComponent,
        data: {
            backConfig: ['../', 'scenarios']
        }
    },
    {
        path: ':scenarioGroupId/scenarios',
        component: ScenariosComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', ''],
            requiredRoles: [Role.Admin]
        }
    },
    {
        path: ':scenarioGroupId/scenario/:scenarioId/steps',
        component: ScenarioStepsComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', '../', 'scenarios'],
            requiredRoles: [Role.Admin]
        }
    },
    {
        path: ':scenarioGroupId/scenario/:scenarioId/details',
        component: ScenarioDetailsComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', '../', 'scenarios'],
            requiredRoles: [Role.Admin]
        }
    },
    {
        path: ':scenarioGroupId/scenario/:scenarioId/scenario-step-add',
        component: ScenarioStepAddComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', 'steps'],
            requiredRoles: [Role.Admin]
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(ScenarioRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class ScenarioGroupRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        ScenarioGroupRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({}),
        DragDropModule,
        MatTableModule,
        FlexLayoutModule
    ],
    declarations: [
        ScenarioGroupsComponent, ScenariosComponent,
        ScenarioGroupAddComponent, ScenarioAddComponent,
        ScenarioStepsComponent, ScenarioStepAddComponent,
        ScenarioDetailsComponent
    ]
})
export class ScenarioModule { }