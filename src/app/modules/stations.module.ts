import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StationEditComponent } from '../components/station-edit/station-edit.component';
import { StationsComponent } from '../components/stations/stations.component';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';


const routes: Routes = [{
        path: '',
        component: StationsComponent
    },
    {
        path: 'l:id/edit',
        component: StationEditComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StationsRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        StationsRoutingModule,
        CtAppModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        StationsComponent,
        StationEditComponent
    ]
})
export class StationsModule {}