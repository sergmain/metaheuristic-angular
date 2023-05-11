import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { BillingComponent } from './components/billing/billing.component';
import { PilotComponent } from './components/pilot/pilot.component';
import { environment } from '@src/environments/environment';
import { AppIndexComponent } from './components/app-index/app-index.component';
const routes: Routes = [
    {
        path: '',
        component: AppIndexComponent,
    },
    {
        path: 'dispatcher',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/modules/dispatcher/dispatcher.module').then(m => m.DispatcherModule),
        data: { sidenavExist: true }
    },
    {
        path: 'billing',
        canActivate: [AuthGuard],
        component: BillingComponent,
    },
    {
        path: 'pilot',
        component: PilotComponent,
    },
    {
        path: 'ai',
        loadChildren: () => import('src/app/modules/ai/ai.module').then(m => m.AiModule),
        data: { sidenavExist: true }
    },
    {
        path: 'batch',
        loadChildren: () => import('src/app/modules/batch/batch.module').then(m => m.BatchModule),
    },
    {
        path: 'mhbp',
        loadChildren: () => import('src/app/modules/mhbp/mhbp.module').then(m => m.MhbpModule),
        data: { sidenavExist: true }
    },
    {
        path: 'about',
        loadChildren: () => import('src/app/modules/about/about.module').then(m => m.AboutModule),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

const extraOptions: ExtraOptions = {
    useHash: environment.hashLocationStrategy,
    onSameUrlNavigation: 'reload',
    // relativeLinkResolution: 'legacy'
};

@NgModule({
    imports: [RouterModule.forRoot(routes, extraOptions)],
    exports: [RouterModule]
})

export class AppRoutingModule { }