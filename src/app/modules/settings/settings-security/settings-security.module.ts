import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsSecurityIndexComponent } from './settings-security-index/settings-security-index.component';

// import {CtModule} from '@app/modules/ct/ct.module';


export const SETTINGS_SECURITY_ROUTES: Routes = [
    {
        path: '',
        component: SettingsSecurityIndexComponent,
    }
];


/*
@NgModule({
    imports: [RouterModule.forChild(SettingsSecurityIndexRoutes)],
    exports: [RouterModule]
})
export class SettingsSecurityIndexRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    SettingsSecurityIndexRoutingModule,
    CtModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    SettingsSecurityIndexComponent
]
})
export class SettingsSecurityModule { }
*/
