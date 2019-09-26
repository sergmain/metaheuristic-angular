import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { TranslateModule } from '@ngx-translate/core';
import { AboutIndexComponent } from '../components/about-index/about-index.component';
import { AboutRootComponent } from '../components/about-root/about-root.component';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';
import { CopyRightModule } from './copy-right.module';


const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    component: AboutRootComponent,
    children: [{
        path: '',
        component: AboutIndexComponent
    }],
    data: {}
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AboutRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        AboutRoutingModule,
        CtAppModule,
        CopyRightModule,
        MaterialAppModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        AboutRootComponent,
        AboutIndexComponent
    ]
})
export class AboutModule {}