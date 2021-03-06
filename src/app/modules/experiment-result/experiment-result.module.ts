import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { ExperimentResultExperimentFeatureProgressComponent } from './experiment-result-experiment-feature-progress/experiment-result-experiment-feature-progress.component';
import { ExperimentResultExperimentInfoComponent } from './experiment-result-experiment-info/experiment-result-experiment-info.component';
import { ExperimentResultExperimentMetricsComponent } from './experiment-result-experiment-metrics/experiment-result-experiment-metrics.component';
import { ExperimentResultExperimentTasksComponent } from './experiment-result-experiment-tasks/experiment-result-experiment-tasks.component';
import { ExperimentResultExperimentsComponent } from './experiment-result-experiments/experiment-result-experiments.component';
import { CtModule } from '../ct/ct.module';
import { ExperimentResultImportComponent } from './experiment-result-import/experiment-result-import.component';

PlotlyModule.plotlyjs = PlotlyJS;

export const ExperimentResultRoutes: Routes = [
    {
        path: '',
        component: ExperimentResultExperimentsComponent,
    },
    {
        path: 'experiment/import',
        component: ExperimentResultImportComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: 'experiment/:id/info',
        component: ExperimentResultExperimentInfoComponent,
        data: {
            backConfig: ['../', '../', '../']
        }
    },
    {
        path: 'experiment/:experimentResultId/feature-progress/:experimentId/:featureId',
        component: ExperimentResultExperimentFeatureProgressComponent,
        data: {
            backConfig: ['../', '../', '../', 'info']
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(ExperimentResultRoutes)],
    exports: [RouterModule]
})
export class ExperimentResultRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        ExperimentResultRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        PlotlyModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        ExperimentResultExperimentsComponent,
        ExperimentResultExperimentInfoComponent,
        ExperimentResultExperimentFeatureProgressComponent,
        ExperimentResultExperimentTasksComponent,
        ExperimentResultExperimentMetricsComponent,
        ExperimentResultImportComponent
    ]
})
export class ExperimentResultModule { }