import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '@app/modules/ct/ct.module';
import { MaterialAppModule } from '@app/ngmaterial.module';
import { CopyRightModule } from '@app/modules/copy-right/copy-right.module';
import { MhbpIndexComponent } from '@app/modules/mhbp/mhbp-index/mhbp-index.component';
import { MhbpRootComponent } from '@app/modules/mhbp/mhbp-root/mhbp-root.component';
import { RoleRouteGuard } from '@app/guards/role-route.guard';
import { Role } from '@app/services/authentication';

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
        path: 'chat-new',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app/modules/chat-new/chat-new.module').then(m => m.ChatNewModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'chats-new'
        }
    },
    {
        path: 'scenario',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app/modules/scenario/scenario.module').then(m => m.ScenarioModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'scenario-groups'
        }
    },
    {
        path: 'session',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app/modules/session/session.module').then(m => m.SessionModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'sessions'
        }
    },
    {
        path: 'evaluation',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app/modules/evaluation/evaluation.module').then(m => m.EvaluationModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'evaluations'
        }
    },
    {
        path: 'kb',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app//modules/kb/kb.module').then(m => m.KbModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'kbs'
        }
    },
    {
        path: 'auth',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app//modules/auth/auth.module').then(m => m.AuthModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'auths'
        }
    },
    {
        path: 'api',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        loadChildren: () => import('@app//modules/api/api.module').then(m => m.ApiModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
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