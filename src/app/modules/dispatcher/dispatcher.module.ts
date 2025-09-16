import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherIndexComponent } from './dispatcher-index/dispatcher-index.component';
import { DispatcherRootComponent } from './dispatcher-root/dispatcher-root.component';

import { TranslateModule } from '@ngx-translate/core';
// import { CtModule } from '../ct/ct.module';

import { Role } from '@app/services/authentication';
import { RoleRouteGuard } from '@app/guards/role-route.guard';
import {SOURCE_CODES_ROUTES} from '@app/modules/source-codes/source-codes.module';
import {GLOBAL_VARIABLES_ROUTES} from '@app/modules/global-variables/global-variables.module';
import {FUNCTIONS_ROUTES} from '@app/modules/functions/functions.module';
import {PROCESSORS_ROUTES} from '@app/modules/processors/processors.module';
import {ACCOUNTS_ROUTES} from '@app/modules/accounts/accounts.module';
import {COMPANY_ROUTES} from '@app/modules/company/company.module';


const commonRequiredRoles: Role[] = [
    Role.MainAssetManager,
    Role.MainAdmin,
    Role.MainOperator,
    Role.MainSupport,
    Role.Admin,
    Role.Data,
    Role.Manager,
];

export const DISPATCHER_ROUTES: Routes = [
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
    {
        path: 'source-codes',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        children: SOURCE_CODES_ROUTES,
        data: {
            requiredRoles: [Role.MainAssetManager, Role.Admin, Role.Data, Role.Manager],
            section: 'source-codes'
        },
    },
    {
        path: 'global-variables',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        children: GLOBAL_VARIABLES_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Data],
            section: 'global-variables'
        }
    },
    {
        path: 'functions',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        children: FUNCTIONS_ROUTES,
        data: {
            requiredRoles: [Role.MainAssetManager, Role.Admin, Role.Data],
            section: 'functions'
        }
    },
    {
        path: 'processors',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        children: PROCESSORS_ROUTES,
        data: {
            requiredRoles: [Role.Admin, Role.Data],
            section: 'processors'
        }
    },
    {
        path: 'accounts',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        children: ACCOUNTS_ROUTES,
        data: {
            requiredRoles: [Role.Admin],
            section: 'accounts'
        }
    },
    {
        path: 'company',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        children: COMPANY_ROUTES,
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOperator, Role.MainSupport],
            section: 'company'
        }
    }
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

