import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// import { CtModule } from '../ct/ct.module';

import { CompanyComponent } from './company/company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { AccountsComponent } from './accounts/accounts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyAddComponent } from './company-add/company-add.component';
import { AccountAddComponent } from './account-add/account-add.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountEditPasswordComponent } from './account-edit-password/account-edit-password.component';
import { AccountEditRolesComponent } from './account-edit-roles/account-edit-roles.component';
import { CompanyBatchStatusComponent } from './company-batch-status/company-batch-status.component';
import { CompanyBatchUploadComponent } from './company-batch-upload/company-batch-upload.component';
import { CompanyBatchListComponent } from './company-batches/company-batch-list.component';
import { Role } from '@app/services/authentication';
import { RoleRouteGuard } from '@app/guards/role-route.guard';


export const COMPANY_ROUTES: Routes = [
    {
        path: '',
        component: CompanyComponent,
    },
    {
        path: 'companies',
        component: CompaniesComponent
    },
    {
        path: ':companyUniqueId/edit',
        canActivate: [RoleRouteGuard],
        component: CompanyEditComponent,
        data: {
            backConfig: ['../', '../', 'companies'],
            requiredRoles: [Role.MainAdmin]
        }
    },
    {
        path: 'add',
        component: CompanyAddComponent,
        data: {
            backConfig: ['../', 'companies']
        }
    },
    {
        path: ':companyUniqueId/accounts',
        component: AccountsComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', 'companies'],
            requiredRoles: [Role.MainAdmin]
        }
    },
    {
        path: ':companyUniqueId/account/add',
        component: AccountAddComponent,
        data: {
            backConfig: ['../', '../', 'accounts']
        }
    },
    {
        path: ':companyUniqueId/account/:accountId/edit',
        component: AccountEditComponent,
        data: {
            backConfig: ['../', '../', '../', 'accounts']
        }
    },
    {
        path: ':companyUniqueId/account/:accountId/edit-roles',
        component: AccountEditRolesComponent,
        data: {
            backConfig: ['../', '../', '../', 'accounts']
        }
    },
    {
        path: ':companyUniqueId/account/:accountId/edit-password',
        component: AccountEditPasswordComponent,
        data: {
            backConfig: ['../', '../', '../', 'accounts']
        }
    },
    //
    //
    //
    {
        path: '1/batches',
        redirectTo: 'companies'
    },
    {
        path: ':companyUniqueId/batches',
        component: CompanyBatchListComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', 'companies'],
            requiredRoles: [Role.MainSupport, Role.MainOperator]
        }
    },
    {
        path: ':companyUniqueId/batches/upload',
        component: CompanyBatchUploadComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../'],
            requiredRoles: [Role.MainSupport, Role.MainOperator]
        }
    },
    {
        path: ':companyUniqueId/batch/:batchId',
        component: CompanyBatchStatusComponent,
        canActivate: [RoleRouteGuard],
        data: {
            backConfig: ['../', '../', 'batches'],
            requiredRoles: [Role.MainSupport, Role.MainOperator]
        }
    }
];
/*


@NgModule({
    imports: [RouterModule.forChild(CompanyRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class CompanyRoutingModule { }


@NgModule({
    imports: [
    CommonModule,
    CompanyRoutingModule,
    CtModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({}),
    CompanyComponent,
    CompaniesComponent,
    CompanyEditComponent,
    CompanyAddComponent,
    AccountsComponent,
    AccountAddComponent,
    AccountEditComponent,
    AccountEditPasswordComponent,
    AccountEditRolesComponent,
    CompanyBatchListComponent,
    CompanyBatchStatusComponent,
    CompanyBatchUploadComponent
]
})
export class CompnyModule { }
*/
