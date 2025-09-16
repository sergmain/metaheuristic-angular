import { Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { AboutRootComponent } from './about-root/about-root.component';
import { AboutIndexComponent } from './about-index/about-index.component';

export const ABOUT_ROUTES: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    component: AboutRootComponent,
    children: [{
        path: '',
        component: AboutIndexComponent
    }]
}];
