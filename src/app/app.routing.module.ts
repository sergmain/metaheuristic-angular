import {ExtraOptions, Routes} from '@angular/router';
import {AuthGuard} from '@app/guards/auth/auth.guard';
import {environment} from '@src/environments/environment';
import {AppIndexComponent} from './components/app-index/app-index.component';
import {ABOUT_ROUTES} from './modules/about/about.module';
import {DISPATCHER_ROUTES} from '@app/modules/dispatcher/dispatcher.module';
import {AI_ROUTES} from '@app/modules/ai/ai.module';
import {BATCH_ROUTES} from '@app/modules/batch/batch.module';
import {MHBP_ROUTES} from '@app/modules/mhbp/mhbp.module';
import {SETTINGS_ROUTES} from '@app/modules/settings/settings.module';
// // import { NgModule } from '@angular/core';


export const ROOT_ROUTES: Routes = [
    {
        path: '',
        component: AppIndexComponent,
    },
    {
        path: 'about',
        children: ABOUT_ROUTES
    },
    {
        path: 'dispatcher',
        canActivate: [AuthGuard],
        children: DISPATCHER_ROUTES,
        data: { sidenavExist: true }
    },
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
    {
        path: 'ai',
        children: AI_ROUTES,
        data: { sidenavExist: true }
    },
    {
        path: 'batch',
        children: BATCH_ROUTES
    },
    {
        path: 'mhbp',
        children: MHBP_ROUTES,
        data: { sidenavExist: true }
    },
    {
        path: 'settings',
        children: SETTINGS_ROUTES
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

export const extraOptions: ExtraOptions = {
    useHash: environment.hashLocationStrategy,
    onSameUrlNavigation: 'reload'
    // relativeLinkResolution: 'legacy'
};

/*
@NgModule({
    imports: [RouterModule.forRoot(ROOT_ROUTES, extraOptions)],
    exports: [RouterModule]
})

// export class AppRoutingModule { }

*/