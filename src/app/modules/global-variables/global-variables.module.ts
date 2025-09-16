import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { GlobalVariablesComponent } from './global-variables/global-variables.component';
import { AddGlobalVariableComponent } from './add-global-variable/add-global-variable.component';
// import { CtModule } from '../ct/ct.module';
import { CardFormAddVariableComponent } from './card-form-add-variable/card-form-add-variable.component';
import { CardFormAddVariableWithStorageComponent } from './card-form-add-variable-with-storage/card-form-add-variable-with-storage.component';


export const GLOBAL_VARIABLES_ROUTES: Routes = [
    {
        path: '',
        component: GlobalVariablesComponent
    },
    {
        path: 'add',
        component: AddGlobalVariableComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':id',
        component: GlobalVariablesComponent,
        data: {
            backConfig: ['../']
        }
    },
];


/*
@NgModule({
    imports: [RouterModule.forChild(GlobalVariablesRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class GlobalVariablesRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    GlobalVariablesRoutingModule,
    CtModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    GlobalVariablesComponent,
    AddGlobalVariableComponent,
    CardFormAddVariableComponent,
    CardFormAddVariableWithStorageComponent
]
})
export class GlobalVariablesModule { }
*/
