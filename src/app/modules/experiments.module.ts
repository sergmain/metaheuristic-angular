import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { ExperimentsComponent } from '../components/experiments/experiments.component';
import { ExperimentAddComponent } from '../components/experiment-add/experiment-add.component';
import { ExperimentEditComponent } from '../components/experiment-edit/experiment-edit.component';
import { ExperimentInfoComponent } from '../components/experiment-info/experiment-info.component';
import { ExperimentFeatureProgressComponent } from '../components/experiment-feature-progress/experiment-feature-progress.component';
import { ExperimentMetricsComponent } from '../components/experiment-metrics/experiment-metrics.component';
import { ExperimentTasksComponent } from '../components/experiment-tasks/experiment-tasks.component';

PlotlyModule.plotlyjs = PlotlyJS;

const routes: Routes = [{
    path: '',
    component: ExperimentsComponent
}, {
    path: 'add',
    component: ExperimentAddComponent
}, {
    path: ':experimentId/edit',
    component: ExperimentEditComponent
}, {
    path: ':experimentId/info',
    component: ExperimentInfoComponent
}, {
    path: ':experimentId/feature-progress/:featureId',
    component: ExperimentFeatureProgressComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExperimentsRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        ExperimentsRoutingModule,
        CtAppModule,
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
export class ExperimentsModule {}