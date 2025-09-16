import {Routes} from '@angular/router';
import {SessionsComponent} from './sessions/sessions.component';
import {RoleRouteGuard} from '@app/guards/role-route.guard';
import {Role} from '@services/authentication/Role';
import {ErrorsComponent} from '@app/modules/session/errors/errors.component';

export const SESSION_ROUTES: Routes = [
    {
        path: '',
        component: SessionsComponent
    },
    {
        path: ':sessionId/errors',
        component: ErrorsComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', ''],
            requiredRoles: [Role.Admin]
        }
    },
];

