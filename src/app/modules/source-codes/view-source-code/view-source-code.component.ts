import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SourceCodesService } from '@app/services/source-codes/source-codes.service';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodeResult } from '@app/services/source-codes/SourceCodeResult';
import { NgIf } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
import { CtPreComponent } from '../../ct/ct-pre/ct-pre.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'view-source-code',
    templateUrl: './view-source-code.component.html',
    styleUrls: ['./view-source-code.component.scss'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionContentComponent, CtPreComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent]
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
