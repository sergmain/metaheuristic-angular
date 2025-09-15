import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@app/ngmaterial.module';
import { BatchStatusComponent } from './batch-status/batch-status.component';
import { BatchAddComponent } from './batch-add/batch-add.component';
import { CtModule } from '@app/modules/ct/ct.module';
import { BatchRootComponent } from './batch-root/batch-root.component';
import { CopyRightModule } from '@app/modules/copy-right/copy-right.module';
import { BatchStateComponent } from './batch-state/batch-state.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { RoleRouteGuard } from '@app/guards/role-route.guard';
import { Role } from '@app/services/authentication';

const commonRequiredRoles: Role[] = [Role.Admin, Role.Data, Role.Manager, Role.Operator];

export const BatchRoutes: Routes = [
    {
        path: '',
        component: BatchRootComponent,
        canActivate: [RoleRouteGuard],
        data: { requiredRoles: commonRequiredRoles },
        children: [
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
    imports: [RouterModule.forChild(BatchRoutes)],
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
        BatchStatusComponent,
        BatchAddComponent,
        BatchStateComponent,
        BatchListComponent
    ]
})
export class BatchModule { }