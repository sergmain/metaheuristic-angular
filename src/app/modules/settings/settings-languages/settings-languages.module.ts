import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsLanguagesIndexComponent } from './settings-languages-index/settings-languages-index.component';
import { MaterialAppModule } from '@app/ngmaterial.module';
import {CtModule} from '@app/modules/ct/ct.module';

export const SettingsLanguagesIndexRoutes: Routes = [
    {
        path: '',
        component: SettingsLanguagesIndexComponent,
    }
];


@NgModule({
    imports: [RouterModule.forChild(SettingsLanguagesIndexRoutes)],
    exports: [RouterModule]
})
export class SettingsLanguagesIndexRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        SettingsLanguagesIndexRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        SettingsLanguagesIndexComponent
    ]
})
export class SettingsLanguagesModule { }