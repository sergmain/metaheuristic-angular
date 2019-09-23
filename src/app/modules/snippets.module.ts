import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SnippetAddComponent } from '../components/snippet-add/snippet-add.component';
import { SnippetsComponent } from '../components/snippets/snippets.component';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';


const routes: Routes = [{
    path: '',
    component: SnippetsComponent,
}, {
    path: 'add',
    component: SnippetAddComponent,
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SnippetsRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        SnippetsRoutingModule,
        CtAppModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        SnippetsComponent,
        SnippetAddComponent
    ]
})
export class SnippetsModule {}