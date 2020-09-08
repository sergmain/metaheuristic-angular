import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherIndexComponent } from './dispatcher-index/dispatcher-index.component';
import { DispatcherRootComponent } from './dispatcher-root/dispatcher-root.component';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from '@src/app/guards/auth/auth.guard';
import { CtModule } from '../ct/ct.module';
import { CopyRightModule } from '../copy-right/copy-right.module';





const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: DispatcherRootComponent,
        children: [
            {
                path: '',
                component: DispatcherIndexComponent
            }]
    },
    {
        path: 'source-codes',
        canActivate: [AuthGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@src/app/modules/source-codes/source-codes.module').then(m => m.SourceCodeModule),
        data: { section: 'source-codes' },
    },
    {
        path: 'global-variables',
        canActivate: [AuthGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@src/app/modules/global-variables/global-variables.module').then(m => m.GlobalVariablesModule),
        data: { section: 'global-variables' }
    },
    {
        path: 'functions',
        canActivate: [AuthGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('@src/app/modules/functions/functions.module').then(m => m.FunctionsModule),
        data: { section: 'functions' }
    },
    {
        path: 'processors',
        canActivate: [AuthGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('src/app/modules/processors/processors.module').then(m => m.ProcessorsModule),
        data: { section: 'processors' }
    },
    {
        path: 'accounts',
        canActivate: [AuthGuard],
        component: DispatcherRootComponent,
        loadChildren: () => import('src/app/modules/accounts/accounts.module').then(m => m.AccountsModule),
        data: { section: 'accounts' }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
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
