import { Component } from '@angular/core';
import { CompanyService } from '@src/app/services/company/company.service';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationStatus } from '@src/app/enums/OperationStatus';

@Component({
    selector: 'company-add',
    templateUrl: './company-add.component.html',
    styleUrls: ['./company-add.component.sass']
})
export class CompanyAddComponent {
    operationStatusRest: OperationStatusRest;

    form: FormGroup = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(1)
        ]),
    });

    constructor(
        private companyService: CompanyService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    createCompany(): void {
        this.companyService
            .addFormCommitCompany(this.form.value.name)
            .subscribe((operationStatusRest) => {
                if (operationStatusRest.status === OperationStatus.OK) {
                    this.back();
                } else {
                    this.operationStatusRest = operationStatusRest;
                }
            });
    }
    back(): void {
        this.router.navigate(['../', 'companies'], { relativeTo: this.activatedRoute });
    }
}
