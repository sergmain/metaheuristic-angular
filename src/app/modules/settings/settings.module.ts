import {Routes} from '@angular/router';
import {SettingsIndexComponent} from '@app/modules/settings/settings-index/settings-index.component';
import {SettingsRootComponent} from '@app/modules/settings/settings-root/settings-root.component';
import {RoleRouteGuard} from '@app/guards/role-route.guard';
import {Role} from '@app/services/authentication/Role';
import {SETTINGS_SECURITY_ROUTES} from '@app/modules/settings/settings-security/settings-security.module';
import {SETTINGS_API_KEYS_ROUTES} from '@app/modules/settings/settings-api-keys/settings-api-keys.module';
import {SETTINGS_LANGUAGES_ROUTES} from '@app/modules/settings/settings-languages/settings-languages.module';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager];

export const SETTINGS_ROUTES: Routes = [
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
        path: 'security',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        children: SETTINGS_SECURITY_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'security'
        }
    },
    {
        path: 'api-keys',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        children: SETTINGS_API_KEYS_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'api-keys'
        }
    },
    {
        path: 'languages',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        children: SETTINGS_LANGUAGES_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'languages'
        }
    }
];

