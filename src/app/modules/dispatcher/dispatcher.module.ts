import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherIndexComponent } from './dispatcher-index/dispatcher-index.component';
import { DispatcherRootComponent } from './dispatcher-root/dispatcher-root.component';

import { TranslateModule } from '@ngx-translate/core';
// import { CtModule } from '../ct/ct.module';

import { Role } from '@app/services/authentication';
import { RoleRouteGuard } from '@app/guards/role-route.guard';


const commonRequiredRoles: Role[] = [
    Role.MainAssetManager,
    Role.MainAdmin,
    Role.MainOperator,
    Role.MainSupport,
    Role.Admin,
    Role.Data,
    Role.Manager,
];

export const DispatcherRoutes: Routes = [
/*
    {
        path: '',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        data: {
            requiredRoles: commonRequiredRoles
        },
        children: [
            {
                path: '',
                component: DispatcherIndexComponent
            }]
    },
*/
/*
    {
        path: 'source-codes',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@app/modules/source-codes/source-codes.module').then(m => m.SourceCodesRoutes),
        data: {
            requiredRoles: [Role.MainAssetManager, Role.Admin, Role.Data, Role.Manager],
            section: 'source-codes'
        },
    },
    {
        path: 'global-variables',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@app/modules/global-variables/global-variables.module').then(m => m.GlobalVariablesRoutes),
        data: {
            requiredRoles: [Role.Admin, Role.Data],
            section: 'global-variables'
        }
    },
    {
        path: 'functions',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@app/modules/functions/functions.module').then(m => m.FunctionsRoutes),
        data: {
            requiredRoles: [Role.MainAssetManager, Role.Admin, Role.Data],
            section: 'functions'
        }
    },
    {
        path: 'processors',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@app//modules/processors/processors.module').then(m => m.ProcessorsRoutes),
        data: {
            requiredRoles: [Role.Admin, Role.Data],
            section: 'processors'
        }
    },
    {
        path: 'accounts',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@app//modules/accounts/accounts.module').then(m => m.AccountsRoutes),
        data: {
            requiredRoles: [Role.Admin],
            section: 'accounts'
        }
    },
    {
        path: 'company',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@app//modules/company/company.module').then(m => m.CompanyRoutes),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport],
            section: 'company'
        }
    }
*/
];


/*
@NgModule({
    imports: [RouterModule.forChild(DispatcherRoutes)],
    exports: [RouterModule],
})
export class DispatcherRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    DispatcherRoutingModule,
    CtModule,
    TranslateModule.forChild({}),
    DispatcherRootComponent,
    DispatcherIndexComponent
]
})
export class DispatcherModule { }
*/

