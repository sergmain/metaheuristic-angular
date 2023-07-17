import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsTokensIndexComponent } from './settings-tokens-index/settings-tokens-index.component';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import {CtModule} from '@app/modules/ct/ct.module';


export const SettingsTokensIndexRoutes: Routes = [
    {
        path: '',
        component: SettingsTokensIndexComponent,
    }
];


@NgModule({
    imports: [RouterModule.forChild(SettingsTokensIndexRoutes)],
    exports: [RouterModule]
})
export class SettingsTokensIndexRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        SettingsTokensIndexRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        SettingsTokensIndexComponent
    ]
})
export class SettingsTokensModule { }