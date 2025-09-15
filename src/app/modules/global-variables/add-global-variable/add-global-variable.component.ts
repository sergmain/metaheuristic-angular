import { Component } from '@angular/core';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationStatus } from '@app/enums/OperationStatus';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CardFormAddVariableComponent } from '../card-form-add-variable/card-form-add-variable.component';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';
import { CardFormAddVariableWithStorageComponent } from '../card-form-add-variable-with-storage/card-form-add-variable-with-storage.component';

@Component({
    standalone : true,
    selector: 'add-global-variable',
    templateUrl: './add-global-variable.component.html',
    styleUrls: ['./add-global-variable.component.scss'],
    imports: [CtColsComponent, CtColComponent, CardFormAddVariableComponent, CtRestStatusComponent, CardFormAddVariableWithStorageComponent]
})

export class AddGlobalVariableComponent {
    addVariableResponse: OperationStatusRest;
    addVariableStorageResponse: OperationStatusRest;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    updateStatusAfterAddVarible(response: OperationStatusRest): void {
        if (response.status !== OperationStatus.OK) {
            this.addVariableResponse = response;
        } else {
            this.back();
        }
    }

    updateStatusAfterAddVaribleStorage(response: OperationStatusRest): void {
        if (response.status !== OperationStatus.OK) {
            this.addVariableStorageResponse = response;
        } else {
            this.back();
        }
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}