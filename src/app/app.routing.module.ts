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
        data: { sidenav: true }
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

};

@NgModule({
    imports: [RouterModule.forRoot(routes, extraOptions)],
    exports: [RouterModule]
})

export class AppRoutingModule { }