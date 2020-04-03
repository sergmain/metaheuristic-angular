import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CtModule } from '../ct/ct.module';
import { ResourceAddComponent } from './resource-add/resource-add.component';
import { ResourcesComponent } from './resources/resources.component';


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
        CtModule,
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