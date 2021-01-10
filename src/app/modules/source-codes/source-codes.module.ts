import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CtModule } from '../ct/ct.module';
import { AddExecContextComponent } from './add-exec-context/add-exec-context.component';
import { AddSourceCodeComponent } from './add-source-code/add-source-code.component';
import { EditExecContextComponent } from './edit-exec-context/edit-exec-context.component';
import { ExecContextStatesComponent } from './exec-context-states/exec-context-states.component';
import { ExecContextsComponent } from './exec-contexts/exec-contexts.component';
import { SourceCodesArchiveComponent } from './source-codes-archive/source-codes-archive.component';
import { SourceCodesComponent } from './source-codes/source-codes.component';
import { CardFormUploadSourceCodeComponent } from './card-form-upload-source-code/card-form-upload-source-code.component';
import { CardFormAddSourceCodeComponent } from './card-form-add-source-code/card-form-add-source-code.component';
import { ViewSourceCodeComponent } from './view-source-code/view-source-code.component';
import { StateOfTasksComponent } from './state-of-tasks/state-of-tasks.component';

export const SourceCodesRoutes: Routes = [
    {
        path: '',
        component: SourceCodesComponent,
    },
    {
        path: 'add',
        component: AddSourceCodeComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':sourceCodeId/view',
        component: ViewSourceCodeComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':sourceCodeId/exec-contexts',
        component: ExecContextsComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':sourceCodeId/exec-context/add',
        component: AddExecContextComponent,
    },
    {
        path: ':sourceCodeId/exec-context/:execContextId/edit',
        component: EditExecContextComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':sourceCodeId/exec-context/:execContextId/state',
        component: ExecContextStatesComponent,
        data: {
            backConfig: ['../', '../', '../', 'exec-contexts']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(SourceCodesRoutes)],
    exports: [RouterModule],
    declarations: [],
})
export class SourceCodeRoutingModule { }


@NgModule({
    declarations: [
        SourceCodesComponent,
        SourceCodesArchiveComponent,
        AddSourceCodeComponent,
        ViewSourceCodeComponent,
        ExecContextsComponent,
        AddExecContextComponent,
        EditExecContextComponent,
        ExecContextStatesComponent,
        CardFormAddSourceCodeComponent,
        CardFormUploadSourceCodeComponent,
        StateOfTasksComponent
    ],

    imports: [
        CommonModule,
        SourceCodeRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ]
})
export class SourceCodeModule { }
