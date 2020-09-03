import { Component } from '@angular/core';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { Router } from '@angular/router';
import { OperationStatus } from '@src/app/models/OperationStatus';

@Component({
    selector: 'add-global-variable',
    templateUrl: './add-global-variable.component.html',
    styleUrls: ['./add-global-variable.component.scss']
})

export class AddGlobalVariableComponent {
    addVariableResponse: OperationStatusRest;
    addVariableStorageResponse: OperationStatusRest;

    constructor(
        private router: Router
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
        this.router.navigate(['/dispatcher', 'global-variables']);
    }
}