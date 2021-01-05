import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '../../ngmaterial.module';
import { BatchComponent } from './batch/batch.component';
import { BatchStatusComponent } from './batch-status/batch-status.component';
import { BatchAddComponent } from './batch-add/batch-add.component';
import { CtModule } from '../ct/ct.module';
import { BatchRootComponent } from './batch-root/batch-root.component';
import { CopyRightModule } from '../copy-right/copy-right.module';
import { BatchStateComponent } from './batch-state/batch-state.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { RoleRouteGuard } from '@src/app/guards/role-route.guard';
import { Role } from '@src/app/services/authentication';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager, Role.Operator];

const routes: Routes = [
    {
        path: '',
        component: BatchRootComponent,
        canActivate: [RoleRouteGuard],
        data: { requiredRoles: commonRequiredRoles },
        children: [
            {
                path: 'old-list',
                component: BatchComponent,
                canActivate: [RoleRouteGuard],
                data: { requiredRoles: commonRequiredRoles },
            },
            {
                path: '',
                component: BatchListComponent,
                canActivate: [RoleRouteGuard],
                data: { requiredRoles: commonRequiredRoles },
            },
            {
                path: ':batchId/status',
                component: BatchStatusComponent,
                canActivate: [RoleRouteGuard],
                data: {
                    backConfig: ['../', '../'],
                    requiredRoles: commonRequiredRoles
                }
            },
            {
                path: 'add',
                component: BatchAddComponent,
                canActivate: [RoleRouteGuard],
                data: {
                    backConfig: ['../'],
                    requiredRoles: commonRequiredRoles
                }
            },
            {
                path: ':batchId/source-code/:sourceCodeId/exec-context/:execContextId/state',
                component: BatchStateComponent,
                canActivate: [RoleRouteGuard],
                data: {
                    backConfig: ['../', '../', '../', '../', '../', '../'],
                    requiredRoles: commonRequiredRoles
                }
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class BatchRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        BatchRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        CopyRightModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        BatchRootComponent,
        BatchComponent,
        BatchStatusComponent,
        BatchAddComponent,
        BatchStateComponent,
        BatchListComponent
    ]
})
export class BatchModule { }