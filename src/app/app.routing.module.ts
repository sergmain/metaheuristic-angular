import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { BillingComponent } from './components/billing/billing.component';
import { PilotComponent } from './components/pilot/pilot.component';
import { environment } from '@src/environments/environment';
import { AppIndexComponent } from './components/app-index/app-index.component';
// // import { NgModule } from '@angular/core';


export const ROOT_ROUTES: Routes = [
    {
        path: '',
        component: AppIndexComponent,
    },
    {
        path: 'about',
        loadChildren: () => import('@app/modules/about/about.module').then(m => m.ABOUT_ROUTES),
    },
/*
    {
        path: 'dispatcher',
        canActivate: [AuthGuard],
        loadChildren: () => {
            console.log('Loading dispatcher module...');
            return import('@app/modules/dispatcher/dispatcher.module').then(m => {
                console.log('Dispatcher module loaded:', m);
                return m.DispatcherRoutes;
            });
        },
        data: { sidenavExist: true }
    },
*/
/*
    {
        path: 'dispatcher',
        canActivate: [AuthGuard],
        loadChildren: () => import('@app/modules/dispatcher/dispatcher.module').then(m => m.DispatcherRoutes),
        data: { sidenavExist: true }
    },
*/
/*
    {
        path: 'billing',
        canActivate: [AuthGuard],
        component: BillingComponent,
    },
    {
        path: 'pilot',
        component: PilotComponent,
    },
*/
/*
    {
        path: 'ai',
        loadChildren: () => import('@app/modules/ai/ai.module').then(m => m.AiRoutes),
        data: { sidenavExist: true }
    },
    {
        path: 'batch',
        loadChildren: () => import('@app/modules/batch/batch.module').then(m => m.BatchRoutes),
    },
    {
        path: 'mhbp',
        loadChildren: () => import('@app/modules/mhbp/mhbp.module').then(m => m.MhbpRoutes),
        data: { sidenavExist: true }
    },
    {
        path: 'about',
        loadChildren: () => import('@app/modules/about/about.module').then(m => m.AboutRoutes),
    },
    {
        path: 'settings',
        loadChildren: () => import('@app/modules/settings/settings.module').then(m => m.SettingsRoutes),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
*/
];

export const extraOptions: ExtraOptions = {
    useHash: environment.hashLocationStrategy,
    onSameUrlNavigation: 'reload',
    // relativeLinkResolution: 'legacy'
};

/*
@NgModule({
    imports: [RouterModule.forRoot(ROOT_ROUTES, extraOptions)],
    exports: [RouterModule]
})
*/

// export class AppRoutingModule { }