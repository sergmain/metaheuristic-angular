import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// import { CtModule } from '../ct/ct.module';


import { AiIndexComponent } from './ai-index/ai-index.component';
import { AiRootComponent } from './ai-root/ai-root.component';
import { RoleRouteGuard } from '@app/guards/role-route.guard';
import { Role } from '@app/services/authentication';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager];

export const AiRoutes: Routes = [
    {
        path: '',
        canActivate: [RoleRouteGuard],
        component: AiRootComponent,
        data: {
            requiredRoles: commonRequiredRoles
        },
        children: [{
            path: '',
            component: AiIndexComponent,
            data: {
                requiredRoles: commonRequiredRoles
            },
        }]
    },
    {
        path: 'experiments',
        canActivate: [RoleRouteGuard],
        component: AiRootComponent,
        loadChildren: () => import('@app//modules/experiments/experiments.module').then(m => m.ExperimentsRoutes),
        data: {
            section: 'experiments',
            requiredRoles: commonRequiredRoles
        }
    },

];

/*

@NgModule({
    imports: [RouterModule.forChild(AiRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class AiRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    AiRoutingModule,
    CtModule,
    TranslateModule.forChild({}),
    AiIndexComponent,
    AiRootComponent
]
})
export class AiModule { }
*/

