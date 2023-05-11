import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CopyRightModule } from '../copy-right/copy-right.module';
import { MhbpIndexComponent } from './mhbp-index/mhbp-index.component';
import { MhbpRootComponent } from './mhbp-root/mhbp-root.component';
import { RoleRouteGuard } from '@src/app/guards/role-route.guard';
import { Role } from '@src/app/services/authentication';
import {DispatcherRootComponent} from '@app/modules/dispatcher/dispatcher-root/dispatcher-root.component';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager];

export const MhbpRoutes: Routes = [
    {
        path: '',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        data: {
            requiredRoles: commonRequiredRoles
        },
        children: [{
            path: '',
            component: MhbpIndexComponent,
            data: {
                requiredRoles: commonRequiredRoles
            },
        }]
    },
    {
        path: 'scenario',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app/modules/scenario/scenario.module').then(m => m.ScenarioModule),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport, Role.Manager],
            section: 'scenario-groups'
        }
    },
    {
        path: 'session',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app/modules/session/session.module').then(m => m.SessionModule),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport, Role.Manager],
            section: 'sessions'
        }
    },
    {
        path: 'evaluation',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app/modules/evaluation/evaluation.module').then(m => m.EvaluationModule),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport, Role.Manager],
            section: 'evaluations'
        }
    },
    {
        path: 'kb',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('src/app/modules/kb/kb.module').then(m => m.KbModule),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport, Role.Manager],
            section: 'kbs'
        }
    },
    {
        path: 'auth',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('src/app/modules/auth/auth.module').then(m => m.AuthModule),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport, Role.Manager],
            section: 'auths'
        }
    },
    {
        path: 'api',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('src/app/modules/api/api.module').then(m => m.ApiModule),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport, Role.Manager],
            section: 'apis'
        }
    }

];


@NgModule({
    imports: [RouterModule.forChild(MhbpRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class MhbpRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        MhbpRoutingModule,
        CtModule,
        CopyRightModule,
        MaterialAppModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        MhbpIndexComponent,
        MhbpRootComponent
    ]
})
export class MhbpModule { }