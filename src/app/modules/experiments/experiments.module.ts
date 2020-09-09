import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { ExperimentAddComponent } from './experiment-add/experiment-add.component';
import { ExperimentEditComponent } from './experiment-edit/experiment-edit.component';
import { ExperimentFeatureProgressComponent } from './experiment-feature-progress/experiment-feature-progress.component';
import { ExperimentInfoComponent } from './experiment-info/experiment-info.component';
import { ExperimentMetricsComponent } from './experiment-metrics/experiment-metrics.component';
import { ExperimentTasksComponent } from './experiment-tasks/experiment-tasks.component';
import { ExperimentsComponent } from './experiments/experiments.component';
import { CtModule } from '../ct/ct.module';


PlotlyModule.plotlyjs = PlotlyJS;

const routes: Routes = [
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
        path: ':experimentId/info',
        component: ExperimentInfoComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: ':experimentId/feature-progress/:featureId',
        component: ExperimentFeatureProgressComponent,
        data: {
            backConfig: ['../', '../', '../']
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExperimentsRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        ExperimentsRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        PlotlyModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        ExperimentsComponent,
        ExperimentAddComponent,
        ExperimentEditComponent,
        ExperimentInfoComponent,
        ExperimentFeatureProgressComponent,
        ExperimentMetricsComponent,
        ExperimentTasksComponent,
    ]
})
export class ExperimentsModule { }