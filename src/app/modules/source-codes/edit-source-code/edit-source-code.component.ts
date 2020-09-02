import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';
import { SourceCodeResult } from '@src/app/services/source-codes/SourceCodeResult';


@Component({
    selector: 'edit-source-code',
    templateUrl: './edit-source-code.component.html',
    styleUrls: ['./edit-source-code.component.scss']
})

export class EditSourceCodeComponent implements OnInit {

    sourceCode: SourceCode;
    sourceCodeResponse: SourceCodeResult;

    constructor(
        private route: ActivatedRoute,
        private sourceCodesService: SourceCodesService,
        private router: Router,
        private elRef: ElementRef
    ) { }

    ngOnInit(): void {
        this.updateResponse();
    }

    updateResponse(): void {
        const id: string | number = this.route.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService.sourceCode
            .get(id)
            .subscribe(response => {
                this.sourceCodeResponse = response;
                this.sourceCode = response;
            });
    }

    back(): void {
        this.router.navigate(['/dispatcher', 'source-codes']);
    }

    save(): void {
        this.sourceCodesService.sourceCode
            .edit(this.sourceCode.id.toString(), this.sourceCode.source)
            .subscribe((response) => {
                if (response.errorMessages) {
                    this.sourceCodeResponse = response;
                    this.scrollIntoView();
                } else {
                    this.back();
                }
            });
    }

    validate(): void {
        const id: string = this.route.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService.sourceCode
            .validate(id)
            .subscribe((response) => {
                this.sourceCodeResponse = response;
                this.scrollIntoView();
            });
    }

    scrollIntoView(): void {
        const node: HTMLElement = (this.elRef.nativeElement as HTMLElement).querySelector('ct-rest-status');
        if (node) {
            node.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }
    }
}