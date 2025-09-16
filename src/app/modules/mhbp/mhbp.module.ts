import {Routes} from '@angular/router';
import {MhbpIndexComponent} from '@app/modules/mhbp/mhbp-index/mhbp-index.component';
import {MhbpRootComponent} from '@app/modules/mhbp/mhbp-root/mhbp-root.component';
import {RoleRouteGuard} from '@app/guards/role-route.guard';
import {Role} from '@app/services/authentication';
import {CHAT_NEW_ROUTES} from '@app/modules/chat-new/chat-new.module';
import {SCENARIO_ROUTES} from '@app/modules/scenario/scenario.module';
import {SESSION_ROUTES} from '@app/modules/session/session.module';
import {EVALUATION_ROUTES} from '@app/modules/evaluation/evaluation.module';
import {KB_ROUTES} from '@app/modules/kb/kb.module';
import {AUTH_ROUTES} from '@app/modules/auth/auth.module';
import {API_ROUTES} from '@app/modules/api/api.module';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager];

export const MHBP_ROUTES: Routes = [
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
        children: CHAT_NEW_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'chats-new'
        }
    },
    {
        path: 'scenario',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        children: SCENARIO_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'scenario-groups'
        }
    },
    {
        path: 'session',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        children: SESSION_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'sessions'
        }
    },
    {
        path: 'evaluation',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        children: EVALUATION_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'evaluations'
        }
    },
    {
        path: 'kb',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        children: KB_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'kbs'
        }
    },
    {
        path: 'auth',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        children: AUTH_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'auths'
        }
    },
    {
        path: 'api',
        canActivate: [RoleRouteGuard],
        component: MhbpRootComponent,
        children: API_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager],
            section: 'apis'
        }
    }
];

