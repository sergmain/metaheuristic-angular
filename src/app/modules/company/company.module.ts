import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CtModule } from '../ct/ct.module';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
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
import { CompanyBatchesComponent } from './company-batches/company-batches.component';
import { CompanyBatchStatusComponent } from './company-batch-status/company-batch-status.component';
import { CompanyBatchUploadComponent } from './company-batch-upload/company-batch-upload.component';


const routes: Routes = [
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
        component: CompanyEditComponent,
        data: {
            backConfig: ['../', '../', 'companies']
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
        data: {
            backConfig: ['../', '../', 'companies']
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
        path: ':companyUniqueId/batches',
        component: CompanyBatchesComponent,
        data: {
            backConfig: ['../', '../', 'companies']
        }
    },
    {
        path: ':companyUniqueId/batches/upload',
        component: CompanyBatchUploadComponent,
        data: {
            backConfig: ['../']
        }
    },
    {
        path: ':companyUniqueId/batch/:batchId',
        component: CompanyBatchStatusComponent,
        data: {
            backConfig: ['../', '../', 'batches']
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class CompanyRoutingModule { }


@NgModule({
    imports: [
        CommonModule,
        CompanyRoutingModule,
        CtModule,
        MaterialAppModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({})
    ],
    declarations: [
        CompanyComponent,
        CompaniesComponent,
        CompanyEditComponent,
        CompanyAddComponent,
        AccountsComponent,
        AccountAddComponent,
        AccountEditComponent,
        AccountEditPasswordComponent,
        AccountEditRolesComponent,
        CompanyBatchesComponent,
        CompanyBatchStatusComponent,
        CompanyBatchUploadComponent
    ]
})
export class CompnyModule { }