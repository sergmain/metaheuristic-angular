import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { SourceCodeResult } from '@src/app/services/source-codes/SourceCodeResult';
import { CardFormAddSourceCodeComponent } from '../card-form-add-source-code/card-form-add-source-code.component';
import { CardFormUploadSourceCodeComponent } from '../card-form-upload-source-code/card-form-upload-source-code.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'add-source-code',
    templateUrl: './add-source-code.component.html',
    styleUrls: ['./add-source-code.component.scss']
})

export class AddSourceCodeComponent {
    @ViewChild(CardFormAddSourceCodeComponent) cardFormAddSourceCode: CardFormAddSourceCodeComponent;
    @ViewChild(CardFormUploadSourceCodeComponent) cardFormUploadSourceCode: CardFormUploadSourceCodeComponent;

    newSourceCodeResponse: SourceCodeResult;
    uploadSourceCodeResponse: SourceCodeResult;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private elRef: ElementRef
    ) { }

    afterNewSourceCode(response: SourceCodeResult): void {
        this.newSourceCodeResponse = response;
        if (response.status === OperationStatus.OK) {
            this.back();
        } else {
            this.scrollIntoView('.addRestStatus');

        }
    }

    afterUploadSourceCode(response: SourceCodeResult): void {
        this.uploadSourceCodeResponse = response;
        if (response.status === OperationStatus.OK) {
            this.back();
        } else {
            this.scrollIntoView('.uploadRestStatus');
        }
    }

    scrollIntoView(selector: string): void {
        const node: HTMLElement = (this.elRef.nativeElement as HTMLElement).querySelector(selector);
        if (node) {
            node.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
}