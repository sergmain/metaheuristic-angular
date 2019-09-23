import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { BillingComponent } from './components/billing/billing.component';
import { PilotComponent } from './components/pilot/pilot.component';
import { LoremIndexComponent } from './components/lorem-index/lorem-index.component';

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

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}