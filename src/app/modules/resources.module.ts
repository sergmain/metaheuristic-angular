import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceAddComponent } from '../components/resource-add/resource-add.component';
import { ResourcesComponent } from '../components/resources/resources.component';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';


const routes: Routes = [{
        path: '',
        component: ResourcesComponent
    },
    {
        path: 'add',
        component: ResourceAddComponent
    },
    {
        path: ':id',
        component: ResourcesComponent
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResourcesRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        ResourcesRoutingModule,
        CtAppModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        ResourcesComponent,
        ResourceAddComponent,
    ]
})
export class ResourcesModule {}