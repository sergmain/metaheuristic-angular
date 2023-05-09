import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {KbsComponent} from './kbs/kbs.component';
import {KbEditComponent} from "@app/modules/kb/kb-edit/kb-edit.component";
import {KbAddComponent} from "@app/modules/kb/kb-add/kb-add.component";

export const KbRoutes: Routes = [
    {
        path: '',
        component: KbsComponent
    },
    {
        path: 'add',
        component: KbAddComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: 'edit',
        component: KbEditComponent,
        data: {
            backConfig: ['../']
        }
    },
];


@NgModule({
    imports: [RouterModule.forChild(KbRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class KbRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        KbRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        KbsComponent, KbAddComponent, KbEditComponent
    ]
})
export class KbModule { }