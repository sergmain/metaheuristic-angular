import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AddFunctionComponent } from './add-function/add-function.component';
import { FunctionsComponent } from './functions/functions.component';

// import { NgModule } from '@angular/core';


export const FUNCTIONS_ROUTES: Routes = [
    {
        path: '',
        component: FunctionsComponent,
    }, {
        path: 'add',
        component: AddFunctionComponent,
        data: {
            backConfig: ['../']
        }
    }
];


/*
@NgModule({
    imports: [RouterModule.forChild(FunctionsRoutes)],
    exports: [RouterModule]
})
export class FunctionsRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    FunctionsRoutingModule,
    CtModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    AddFunctionComponent,
    FunctionsComponent
]
})
export class FunctionsModule { }
*/
