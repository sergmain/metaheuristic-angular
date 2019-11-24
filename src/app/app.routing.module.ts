import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { BillingComponent } from './components/billing/billing.component';
import { PilotComponent } from './components/pilot/pilot.component';
import { LoremIndexComponent } from './components/lorem-index/lorem-index.component';
import { environment } from '@src/environments/environment';
const routes: Routes = [{
    path: '',
    component: LoremIndexComponent,
}, {
    path: 'launchpad',
    canActivate: [AuthGuard],
    loadChildren: 'src/app/modules/launchpad.module#LaunchpadModule',
    data: { sidenav: true }
}, {
    path: 'billing',
    canActivate: [AuthGuard],
    component: BillingComponent,
}, {
    path: 'pilot',
    component: PilotComponent,
}, {
    path: 'about',
    loadChildren: 'src/app/modules/about.module#AboutModule',
}, {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
}];

const extraOptions: ExtraOptions = {
    useHash: environment.hashLocationStrategy,
    onSameUrlNavigation: 'reload',

};

@NgModule({
    imports: [RouterModule.forRoot(routes, extraOptions)],
    exports: [RouterModule]
})

export class AppRoutingModule {}