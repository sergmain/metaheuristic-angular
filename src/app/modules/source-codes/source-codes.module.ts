import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CtModule } from '../ct/ct.module';
import { AddExecContextComponent } from './add-exec-context/add-exec-context.component';
import { AddSourceCodeComponent } from './add-source-code/add-source-code.component';
import { EditSourceCodeComponent } from './edit-source-code/edit-source-code.component';
import { ExecContextsComponent } from './exec-contexts/exec-contexts.component';
import { SourceCodesArchiveComponent } from './source-codes-archive/source-codes-archive.component';
import { SourceCodesComponent } from './source-codes/source-codes.component';
import { EditExecContextComponent } from './edit-exec-context/edit-exec-context.component';


const routes: Routes = [
    {
        path: '',
        component: SourceCodesComponent
    },
    {
        path: 'add',
        component: AddSourceCodeComponent,
    },
    {
        path: ':sourceCodeId/edit',
        component: EditSourceCodeComponent,
    },
    {
        path: ':sourceCodeId/exec-contexts',
        component: ExecContextsComponent,
    },
    {
        path: ':sourceCodeId/exec-context/add',
        component: AddExecContextComponent,
    },
    {
        path: ':sourceCodeId/exec-context/:execContextId/edit',
        component: EditExecContextComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class SourceCodeRoutingModule { }


@NgModule({
    declarations: [
        SourceCodesComponent,
        SourceCodesArchiveComponent,
        AddSourceCodeComponent,
        EditSourceCodeComponent,
        ExecContextsComponent,
        AddExecContextComponent,
        EditExecContextComponent
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