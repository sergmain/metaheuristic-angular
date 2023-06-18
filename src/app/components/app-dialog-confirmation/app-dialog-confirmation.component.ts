import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import {MhUtils} from '@services/mh-utils/mh-utils.service';

export interface QuestionData {
    text: string;
    params: any;
}

export interface DialogData {
    resolveTitle: string;
    rejectTitle: string;
    question ?(...data: any[]) : QuestionData | string;
    theme?: string;
}

export interface ConfirmationDialogInterface {
    readonly dialog: MatDialog;
}


@Component({
    selector: 'app-dialog-confirmation',
    templateUrl: './app-dialog-confirmation.component.html',
    styleUrls: ['./app-dialog-confirmation.component.scss']
})


export class AppDialogConfirmationComponent {
    constructor(
        public dialogRef: MatDialogRef < AppDialogConfirmationComponent > ,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // console.log(data);
    }

    onNoClick(): void {
        this.dialogRef.close(0);
    }

    onYesClick(): void {
        this.dialogRef.close(1);
    }

    getTheme(theme:string): string {
        let actualTheme = MhUtils.isNull(theme) ? 'warn' : theme;
        console.log("theme, actualTheme: ", theme, actualTheme);
        return actualTheme;
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

            let questionData: QuestionData = {
                text: '',
                params: false
            };

            if (typeof dialogData.question(...args) === 'string') {
                questionData.text = dialogData.question(...args) as string;
            } else {
                questionData = dialogData.question(...args) as QuestionData;
            }

            if (!this.dialog) {
                dialogError();
            }
            if (questionData.params && !this.translate) {
                translateError();
            }

            let actualTheme = MhUtils.isNull(dialogData.theme) ? 'warn' : dialogData.theme;
            // console.log("ConfirmationDialogMethod, theme, actualTheme: ", dialogData.theme, actualTheme);

            if (this.translate) {
                forkJoin(
                        this.translate.get(questionData.text, questionData.params),
                        this.translate.get(dialogData.resolveTitle),
                        this.translate.get(dialogData.rejectTitle),
                        this.translate.get(actualTheme)
                    )
                    .subscribe(
                        (response: any) => {
                            this.dialog.open(AppDialogConfirmationComponent, {
                                    width: '500px',
                                    data: {
                                        question: response[0],
                                        resolveTitle: response[1],
                                        rejectTitle: response[2],
                                        theme: response[3]
                                    }
                                })
                                .afterClosed()
                                .subscribe((result: boolean) => {
                                    if (result) {
                                        method.apply(this, args);
                                    }
                                });
                        }
                    );
            } else {
                this.dialog.open(AppDialogConfirmationComponent, {
                        width: '500px',
                        data: {
                            question: questionData.text,
                            resolveTitle: dialogData.resolveTitle,
                            rejectTitle: dialogData.rejectTitle,
                            theme: actualTheme
                        }
                    })
                    .afterClosed()
                    .subscribe((result: boolean) => {
                        if (result) {
                            method.apply(this, args);
                        }
                    });
            }
        };

        return propertyDesciptor;
    };
}

function dialogError() {
    throw new Error(`
component require MatDialog

import {MatDialog} from '@angular/material/dialog';

...
constructor(
    ...
    private dialog: MatDialog
    ...
) {}
                `);
}

function translateError() {
    throw new Error(`
component require TranslateService

import { TranslateService } from '@ngx-translate/core';
...
constructor(
    ...
    private translate: TranslateService
    ...
) {}
                `);
}