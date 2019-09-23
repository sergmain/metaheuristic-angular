import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { AtlasExperimentExportImportComponent } from '../components/atlas-experiment-export-import/atlas-experiment-export-import.component';
import { AtlasExperimentFeatureProgressComponent } from '../components/atlas-experiment-feature-progress/atlas-experiment-feature-progress.component';
import { AtlasExperimentInfoComponent } from '../components/atlas-experiment-info/atlas-experiment-info.component';
import { AtlasExperimentMetricsComponent } from '../components/atlas-experiment-metrics/atlas-experiment-metrics.component';
import { AtlasExperimentTasksComponent } from '../components/atlas-experiment-tasks/atlas-experiment-tasks.component';
import { AtlasExperimentsComponent } from '../components/atlas-experiments/atlas-experiments.component';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';

PlotlyModule.plotlyjs = PlotlyJS;

const routes: Routes = [{
    path: 'experiments',
    component: AtlasExperimentsComponent,
}, {
    path: 'experiment-export-import/:atlasId',
    component: AtlasExperimentExportImportComponent,
}, {
    path: 'experiment-info/:id',
    component: AtlasExperimentInfoComponent,
}, {
    path: 'experiment-feature-progress/:atlasId/:experimentId/:featureId',
    component: AtlasExperimentFeatureProgressComponent,
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AtlasRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        AtlasRoutingModule,
        CtAppModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        PlotlyModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        AtlasExperimentsComponent,
        AtlasExperimentInfoComponent,
        AtlasExperimentFeatureProgressComponent,
        AtlasExperimentTasksComponent,
        AtlasExperimentMetricsComponent,
        AtlasExperimentExportImportComponent,
    ]
})
export class AtlasModule {}