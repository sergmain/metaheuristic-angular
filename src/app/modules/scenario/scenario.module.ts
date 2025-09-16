import {Routes} from '@angular/router';
import {RoleRouteGuard} from '@app/guards/role-route.guard';
import {Role} from '@services/authentication/Role';
import {ScenarioGroupsComponent} from './scenario-groups/scenario-groups.component';
import {ScenariosComponent} from './scenarios/scenarios.component';
import {ScenarioGroupAddComponent} from './scenario-group-add/scenario-group-add.component';
import {ScenarioAddComponent} from '@app/modules/scenario/scenario-add/scenario-add.component';
import {ScenarioStepsComponent} from '@app/modules/scenario/steps/scenario-steps.component';
import {ScenarioStepAddComponent} from '@app/modules/scenario/step-add/scenario-step-add.component';
import {ScenarioDetailsComponent} from '@app/modules/scenario/scenario-details/scenario-details.component';
import {ScenarioMoveComponent} from '@app/modules/scenario/scenario-move/scenario-move.component';

export const SCENARIO_ROUTES: Routes = [
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
        path: ':scenarioGroupId/scenario/:scenarioId/move',
        component: ScenarioMoveComponent,
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

