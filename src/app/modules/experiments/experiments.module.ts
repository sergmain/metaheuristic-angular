import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ExperimentAddComponent } from './experiment-add/experiment-add.component';
import { ExperimentEditComponent } from './experiment-edit/experiment-edit.component';
import { ExperimentsComponent } from './experiments/experiments.component';
// import { CtModule } from '../ct/ct.module';
import { ExperimentStateComponent } from './experiment-state/experiment-state.component';



export const ExperimentsRoutes: Routes = [
    {
        path: '',
        component: ExperimentsComponent
    },
    {
        path: 'add',
        component: ExperimentAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':experimentId/edit',
        component: ExperimentEditComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':experimentId/source-code/:sourceCodeId/exec-context/:execContextId/state',
        component: ExperimentStateComponent,
        data: {
            backConfig: ['../', '../', '../', '../', '../', '../']
        }
    }
];

/*
@NgModule({
    imports: [RouterModule.forChild(ExperimentsRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class ExperimentsRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    ExperimentsRoutingModule,
    CtModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    ExperimentsComponent,
    ExperimentAddComponent,
    ExperimentEditComponent,
    ExperimentStateComponent
]
})
export class ExperimentsModule { }
*/
