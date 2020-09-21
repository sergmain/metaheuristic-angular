import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { ExperimentResultExperimentExportImportComponent } from './experiment-result-experiment-export-import/experiment-result-experiment-export-import.component';
import { ExperimentResultExperimentFeatureProgressComponent } from './experiment-result-experiment-feature-progress/experiment-result-experiment-feature-progress.component';
import { ExperimentResultExperimentInfoComponent } from './experiment-result-experiment-info/experiment-result-experiment-info.component';
import { ExperimentResultExperimentMetricsComponent } from './experiment-result-experiment-metrics/experiment-result-experiment-metrics.component';
import { ExperimentResultExperimentTasksComponent } from './experiment-result-experiment-tasks/experiment-result-experiment-tasks.component';
import { ExperimentResultExperimentsComponent } from './experiment-result-experiments/experiment-result-experiments.component';
import { CtModule } from '../ct/ct.module';
import { ExperimentResultImportComponent } from './experiment-result-import/experiment-result-import.component';

PlotlyModule.plotlyjs = PlotlyJS;

const routes: Routes = [
    {
        path: 'experiments',
        component: ExperimentResultExperimentsComponent,
    },
    {
        path: 'experiment-export-import/:experimentResultId',
        component: ExperimentResultExperimentExportImportComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: 'experiment/import',
        component: ExperimentResultImportComponent,
        data: {
            backConfig: ['../', '../', 'experiments']
        }
    },
    {
        path: 'experiment-info/:id',
        component: ExperimentResultExperimentInfoComponent,
        data: {
            backConfig: ['../', '../']
        }
    },
    {
        path: 'experiment-feature-progress/:experimentResultId/:experimentId/:featureId',
        component: ExperimentResultExperimentFeatureProgressComponent,
        data: {
            backConfig: ['../', '../', '../', '../']
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
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
        ExperimentResultExperimentExportImportComponent,
        ExperimentResultImportComponent
    ]
})
export class ExperimentResultModule { }