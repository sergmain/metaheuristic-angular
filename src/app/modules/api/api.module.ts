import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {ApisComponent} from './apis/apis.component';
import {ApiAddComponent} from "@app/modules/api/api-add/api-add.component";

export const ApiRoutes: Routes = [
    {
        path: '',
        component: ApisComponent
    },
    {
        path: 'add',
        component: ApiAddComponent,
        data: {
            backConfig: ['../']
        }
    },
];


@NgModule({
    imports: [RouterModule.forChild(ApiRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class ApiRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        ApiRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        ApisComponent, ApiAddComponent
    ]
})
export class ApiModule { }