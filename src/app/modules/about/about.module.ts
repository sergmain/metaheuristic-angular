import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { TranslateModule } from '@ngx-translate/core';
import { AboutRootComponent } from './about-root/about-root.component';
import { AboutIndexComponent } from './about-index/about-index.component';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CopyRightModule } from '../copy-right/copy-right.module';


const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    component: AboutRootComponent,
    children: [{
        path: '',
        component: AboutIndexComponent
    }]
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AboutRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        AboutRoutingModule,
        CtModule,
        CopyRightModule,
        MaterialAppModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        AboutRootComponent,
        AboutIndexComponent
    ]
})
export class AboutModule { }