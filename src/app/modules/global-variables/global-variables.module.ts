import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { GlobalVariablesComponent } from './global-variables/global-variables.component';
import { AddGlobalVariableComponent } from './add-global-variable/add-global-variable.component';
import { CtModule } from '../ct/ct.module';
import { CardFormAddVariableComponent } from './card-form-add-variable/card-form-add-variable.component';
import { CardFormAddVariableWithStorageComponent } from './card-form-add-variable-with-storage/card-form-add-variable-with-storage.component';


const routes: Routes = [{
    path: '',
    component: GlobalVariablesComponent
},
{
    path: 'add',
    component: AddGlobalVariableComponent
},
{
    path: ':id',
    component: GlobalVariablesComponent
},
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class GlobalVariablesRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        GlobalVariablesRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        GlobalVariablesComponent,
        AddGlobalVariableComponent,
        CardFormAddVariableComponent,
        CardFormAddVariableWithStorageComponent
    ]
})
export class GlobalVariablesModule { }