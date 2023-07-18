import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsApiKeysIndexComponent } from './settings-api-keys-index/settings-api-keys-index.component';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import {CtModule} from '@app/modules/ct/ct.module';


export const settingsApiKeysIndexRoutes: Routes = [
    {
        path: '',
        component: SettingsApiKeysIndexComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(settingsApiKeysIndexRoutes)],
    exports: [RouterModule]
})
export class SettingsApiKeysIndexRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        SettingsApiKeysIndexRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        SettingsApiKeysIndexComponent
    ]
})
export class SettingsApiKeysModule { }