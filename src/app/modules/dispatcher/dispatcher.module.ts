import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherIndexComponent } from './dispatcher-index/dispatcher-index.component';
import { DispatcherRootComponent } from './dispatcher-root/dispatcher-root.component';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { CopyRightModule } from '../copy-right/copy-right.module';
import { Role } from '@src/app/services/authentication';
import { RoleRouteGuard } from '@src/app/guards/role-route.guard';


const commonRequiredRoles: Role[] = [
    Role.MainAssetManager,
    Role.MainAdmin,
    Role.MainOpertator,
    Role.MainSupport,
    Role.Admin,
    Role.Data,
    Role.Manager,
];



export const DispatcherRoutes: Routes = [
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
        loadChildren: () => import('@src/app/modules/source-codes/source-codes.module').then(m => m.SourceCodeModule),
        data: {
            requiredRoles: [Role.MainAssetManager, Role.Admin, Role.Data, Role.Manager],
            section: 'source-codes'
        },
    },
    {
        path: 'global-variables',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@src/app/modules/global-variables/global-variables.module').then(m => m.GlobalVariablesModule),
        data: {
            requiredRoles: [Role.Admin, Role.Data],
            section: 'global-variables'
        }
    },
    {
        path: 'functions',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@src/app/modules/functions/functions.module').then(m => m.FunctionsModule),
        data: {
            requiredRoles: [Role.MainAssetManager, Role.Admin, Role.Data],
            section: 'functions'
        }
    },
    {
        path: 'processors',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('src/app/modules/processors/processors.module').then(m => m.ProcessorsModule),
        data: {
            requiredRoles: [Role.Admin, Role.Data],
            section: 'processors'
        }
    },
    {
        path: 'accounts',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('src/app/modules/accounts/accounts.module').then(m => m.AccountsModule),
        data: {
            requiredRoles: [Role.Admin],
            section: 'accounts'
        }
    },
    {
        path: 'company',
        canActivate: [RoleRouteGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('src/app/modules/company/company.module').then(m => m.CompnyModule),
        data: {
            requiredRoles: [Role.MainAdmin, Role.MainOpertator, Role.MainSupport],
            section: 'company'
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(DispatcherRoutes)],
    exports: [RouterModule],
})
export class DispatcherRoutingModule { }


@NgModule({
    declarations: [
        DispatcherRootComponent,
        DispatcherIndexComponent
    ],
    imports: [
        CommonModule,
        DispatcherRoutingModule,

        CtModule,
        CopyRightModule,
        MaterialAppModule,
        TranslateModule.forChild({})
    ]
})
export class DispatcherModule { }
