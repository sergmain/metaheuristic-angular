import {Routes} from '@angular/router';
import {AiIndexComponent} from './ai-index/ai-index.component';
import {AiRootComponent} from './ai-root/ai-root.component';
import {RoleRouteGuard} from '@app/guards/role-route.guard';
import {Role} from '@app/services/authentication/Role';
import {EXPERIMENTS_ROUTES} from '@app/modules/experiments/experiments.module';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager];

export const AI_ROUTES: Routes = [
    {
        path: '',
        canActivate: [RoleRouteGuard],
        component: AiRootComponent,
        data: {
            requiredRoles: commonRequiredRoles
        },
        children: [{
            path: '',
            component: AiIndexComponent,
            data: {
                requiredRoles: commonRequiredRoles
            },
        }]
    },
    {
        path: 'experiments',
        canActivate: [RoleRouteGuard],
        component: AiRootComponent,
        children: EXPERIMENTS_ROUTES,
        data: {
            section: 'experiments',
            requiredRoles: commonRequiredRoles
        }
    },

];

