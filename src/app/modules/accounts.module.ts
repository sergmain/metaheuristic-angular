import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StationEditComponent } from '../components/station-edit/station-edit.component';
import { StationsComponent } from '../components/stations/stations.component';
import { CtAppModule } from './ct.module';
import { MaterialAppModule } from '../ngmaterial.module';
import { AccountsComponent } from '../components/accounts/accounts.component';
import { AccountAddComponent } from '../components/account-add/account-add.component';
import { AccountAccessComponent } from '../components/account-access/account-access.component';
import { AccountEditComponent } from '../components/account-edit/account-edit.component';
import { AccountEditPassComponent } from '../components/account-edit-pass/account-edit-pass.component';


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
        CtAppModule,
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