import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';
import { BatchComponent } from '../components/batch/batch.component';
import { BatchStatusComponent } from '../components/batch-status/batch-status.component';
import { BatchAddComponent } from '../components/batch-add/batch-add.component';


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
        CtAppModule,
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