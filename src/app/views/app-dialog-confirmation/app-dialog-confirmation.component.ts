import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
    resolveTitle: string;
    rejectTitle: string;
}

@Component({
    selector: 'app-dialog-confirmation',
    templateUrl: './app-dialog-confirmation.component.pug',
    styleUrls: ['./app-dialog-confirmation.component.scss']
})
export class AppDialogConfirmationComponent {
    constructor(
        public dialogRef: MatDialogRef < AppDialogConfirmationComponent > ,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(data);
    }

    onNoClick(): void {
        this.dialogRef.close(0);
    }

    onYesClick(): void {
        this.dialogRef.close(1);
    }
}



/**
 * require MatDialog
 *
 * constructor(
 *     private dialog: MatDialog
 * ) {}
 *
 */
export function ConfirmationDialogMethod(dialogData: DialogData) {
    return function fn(
        target: object,
        propertyName: string,
        propertyDesciptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const method: any = propertyDesciptor.value;
        propertyDesciptor.value = function(...args: any[]) {
            const params: any = JSON.parse(args.map((a: any) => JSON.stringify(a)).join());
            const dialogRef: MatDialogRef < any > = this.dialog.open(AppDialogConfirmationComponent, {
                width: '250px',
                data: { dialogData }
            });
            dialogRef.afterClosed().subscribe((result: boolean) => {
                if (result) {
                    method.apply(this, args);
                }
            });
        };

        return propertyDesciptor;
    };
}