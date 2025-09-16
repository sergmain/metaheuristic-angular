import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { EditProcessorComponent } from './edit-processor/edit-processor.component';
import { ProcessorsComponent } from './processors/processors.component';
// import { CtModule } from '../ct/ct.module';


export const PROCESSORS_ROUTES: Routes = [
    {
        path: '',
        component: ProcessorsComponent
    },
    {
        path: ':id/edit',
        component: EditProcessorComponent,
        data: {
            backConfig: ['../', '../']
        }
    }
];

/*

@NgModule({
    imports: [RouterModule.forChild(ProcessorsRoutes)],
    exports: [RouterModule]
})
export class ProcessorsRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    ProcessorsRoutingModule,
    CtModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    ProcessorsComponent,
    EditProcessorComponent
]
})
export class ProcessorsModule { }
*/
