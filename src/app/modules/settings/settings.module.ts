import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '@app/modules/ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CopyRightModule } from '@app/modules/copy-right/copy-right.module';
import { SettingsIndexComponent } from '@app/modules/settings/settings-index/settings-index.component';
import { SettingsRootComponent } from '@app/modules/settings/settings-root/settings-root.component';
import { RoleRouteGuard } from '@src/app/guards/role-route.guard';
import { Role } from '@src/app/services/authentication';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager];

export const SettingsRoutes: Routes = [
    {
        path: '',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        data: {
            requiredRoles: commonRequiredRoles
        },
        children: [{
            path: '',
            component: SettingsIndexComponent,
            data: {
                requiredRoles: commonRequiredRoles
            },
        }]
    },
    {
        path: 'chat-new',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('@app/modules/chat-new/chat-new.module').then(m => m.ChatNewModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'chats-new'
        }
    },
    {
        path: 'scenario',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('@app/modules/scenario/scenario.module').then(m => m.ScenarioModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'scenario-groups'
        }
    },
    {
        path: 'session',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('@app/modules/session/session.module').then(m => m.SessionModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'sessions'
        }
    },
    {
        path: 'evaluation',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('@app/modules/evaluation/evaluation.module').then(m => m.EvaluationModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'evaluations'
        }
    },
    {
        path: 'kb',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('src/app/modules/kb/kb.module').then(m => m.KbModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'kbs'
        }
    },
    {
        path: 'auth',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('src/app/modules/auth/auth.module').then(m => m.AuthModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'auths'
        }
    },
    {
        path: 'api',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('src/app/modules/api/api.module').then(m => m.ApiModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'apis'
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(SettingsRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class SettingsRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        CtModule,
        CopyRightModule,
        MaterialAppModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        SettingsIndexComponent,
        SettingsRootComponent
    ]
})
export class SettingsModule { }