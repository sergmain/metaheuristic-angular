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
        path: 'security',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('@app/modules/settings/settings-security/settings-security.module').then(m => m.SettingsSecurityModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'security'
        }
    },
    {
        path: 'api-keys',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('@app/modules/settings/settings-api-keys/settings-api-keys.module').then(m => m.SettingsApiKeysModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'api-keys'
        }
    },
    {
        path: 'languages',
        canActivate: [RoleRouteGuard],
        component: SettingsRootComponent,
        loadChildren: () => import('@app/modules/settings/settings-languages/settings-languages.module').then(m => m.SettingsLanguagesModule),
        data: {
            requiredRoles: [Role.Admin, Role.Manager, Role.Operator],
            section: 'languages'
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