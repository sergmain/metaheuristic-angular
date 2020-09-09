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


const routes: Routes = [
    {
        path: '',
        component: BatchRootComponent,
        children: [
            {
                path: '',
                component: BatchComponent
            },
            {
                path: ':id/status',
                component: BatchStatusComponent,
                data: {
                    backConfig: ['../', '../']
                }
            },
            {
                path: 'add',
                component: BatchAddComponent,
                data: {
                    backConfig: ['../']
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
        BatchAddComponent
    ]
})
export class BatchModule { }