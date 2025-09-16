import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsApiKeysIndexComponent } from './settings-api-keys-index/settings-api-keys-index.component';

// import {CtModule} from '@app/modules/ct/ct.module';


export const SETTINGS_API_KEYS_ROUTES: Routes = [
    {
        path: '',
        component: SettingsApiKeysIndexComponent,
    }
];

/*
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
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    SettingsApiKeysIndexComponent
]
})
export class SettingsApiKeysModule { }
*/
