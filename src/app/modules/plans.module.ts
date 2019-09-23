import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EditWorkbookComponent } from '../components/edit-workbook/edit-workbook.component';
import { PlanAddComponent } from '../components/plan-add/plan-add.component';
import { PlanEditComponent } from '../components/plan-edit/plan-edit.component';
import { PlansArchiveComponent } from '../components/plans-archive/plans-archive.component';
import { PlansComponent } from '../components/plans/plans.component';
import { WorkbookAddComponent } from '../components/workbook-add/workbook-add.component';
import { WorkbooksComponent } from '../components/workbooks/workbooks.component';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';



const routes: Routes = [{
    path: '',
    component: PlansComponent
}, {
    path: 'add',
    component: PlanAddComponent,
}, {
    path: ':planId/edit',
    component: PlanEditComponent,
}, {
    path: ':planId/workbooks',
    component: WorkbooksComponent,
}, {
    path: ':planId/workbooks/add',
    component: WorkbookAddComponent,
}, {
    path: ':planId/workbooks/:workbookId/edit',
    component: WorkbookAddComponent,
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlansRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        PlansRoutingModule,
        CtAppModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        PlansComponent,
        PlanAddComponent,
        PlanEditComponent,
        PlansArchiveComponent,
        WorkbooksComponent,
        WorkbookAddComponent,
        EditWorkbookComponent
    ]
})
export class PlansModule {}