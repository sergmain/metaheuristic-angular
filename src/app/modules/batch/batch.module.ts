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


const routes: Routes = [{
    path: '',
    component: BatchComponent
}, {
    path: ':id/status',
    component: BatchStatusComponent
}, {
    path: 'add',
    component: BatchAddComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BatchRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        BatchRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        BatchComponent,
        BatchStatusComponent,
        BatchAddComponent
    ]
})
export class BatchModule {}