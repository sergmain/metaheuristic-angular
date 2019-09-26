import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { TranslateModule } from '@ngx-translate/core';
import { LaunchpadIndexComponent } from '../components/launchpad-index/launchpad-index.component';
import { LaunchpadNavigationComponent } from '../components/launchpad-navigation/launchpad-navigation.component';
import { LaunchpadRootComponent } from '../components/launchpad-root/launchpad-root.component';
import { MaterialAppModule } from '../ngmaterial.module';
import { CopyRightModule } from './copy-right.module';
import { CtAppModule } from './ct.module';


const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    children: [{
        path: '',
        component: LaunchpadIndexComponent
    }]
}, {
    path: 'plans',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/plans.module#PlansModule',
    data: { section: 'plans' },
}, {
    path: 'experiments',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/experiments.module#ExperimentsModule',
    data: { section: 'experiments' }
}, {
    path: 'resources',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/resources.module#ResourcesModule',
    data: { section: 'resources' }
}, {
    path: 'snippets',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/snippets.module#SnippetsModule',
    data: { section: 'snippets' }
}, {
    path: 'stations',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/stations.module#StationsModule',
    data: { section: 'stations' }
}, {
    path: 'accounts',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/accounts.module#AccountsModule',
    data: { section: 'accounts' }
}, {
    path: 'batch',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/batch.module#BatchModule',
    data: { section: 'batch' }
}, {
    path: 'atlas',
    canActivate: [AuthGuard],
    component: LaunchpadRootComponent,
    loadChildren: 'src/app/modules/atlas.module#AtlasModule',
    data: { section: 'atlas' }
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LaunchpadRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        LaunchpadRoutingModule,
        CtAppModule,
        CopyRightModule,
        MaterialAppModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        LaunchpadRootComponent,
        LaunchpadIndexComponent,
        LaunchpadNavigationComponent,
    ]
})
export class LaunchpadModule {}