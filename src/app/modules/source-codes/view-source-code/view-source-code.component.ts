import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';
import { SourceCodeResult } from '@src/app/services/source-codes/SourceCodeResult';

@Component({
    selector: 'view-source-code',
    templateUrl: './view-source-code.component.html',
    styleUrls: ['./view-source-code.component.scss'],
    standalone: false
})
export class ViewSourceCodeComponent implements OnInit {

    sourceCode: SourceCode;
    sourceCodeResponse: SourceCodeResult;
    sourceCodeResponseForValidate: SourceCodeResult;


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
        this.sourceCodesService
            .edit(id)
            .subscribe(sourceCodeResult => {
                this.sourceCodeResponse = sourceCodeResult;
                this.sourceCode = sourceCodeResult;
            });
    }

    back(): void {
        this.router.navigate(['/dispatcher', 'source-codes']);
    }

    validate(): void {
        const id: string = this.route.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService
            .validate(id)
            .subscribe(sourceCodeResult => {
                this.sourceCodeResponse = sourceCodeResult;
                this.sourceCodeResponseForValidate = sourceCodeResult;
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
