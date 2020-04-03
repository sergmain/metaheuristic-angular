import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountAddComponent } from './account-add/account-add.component';
import { AccountAccessComponent } from './account-access/account-access.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountEditPassComponent } from './account-edit-pass/account-edit-pass.component';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CtModule } from '../ct/ct.module';


const routes: Routes = [{
    path: '',
    component: AccountsComponent
}, {
    path: 'add',
    component: AccountAddComponent
}, {
    path: 'access/:accountId',
    component: AccountAccessComponent
}, {
    path: 'edit/:id',
    component: AccountEditComponent
}, {
    path: 'edit-password/:id',
    component: AccountEditPassComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountsRoutingModule {}


@NgModule({
    imports: [
        CommonModule,
        AccountsRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        AccountsComponent,
        AccountAddComponent,
        AccountAccessComponent,
        AccountEditComponent,
        AccountEditPassComponent
    ]
})
export class AccountsModule {}