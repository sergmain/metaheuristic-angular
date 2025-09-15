import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsLanguagesIndexComponent } from './settings-languages-index/settings-languages-index.component';

// import {CtModule} from '@app/modules/ct/ct.module';

export const SettingsLanguagesRoutes: Routes = [
    {
        path: '',
        component: SettingsLanguagesIndexComponent,
    }
];


/*
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
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    SettingsLanguagesIndexComponent
]
})
export class SettingsLanguagesModule { }
*/
