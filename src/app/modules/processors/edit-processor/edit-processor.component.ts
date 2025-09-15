import { Location, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessorsService } from '@app/services/processors/processors.service';
import { Processor } from '@app/services/processors/Processor';
import { ProcessorResult } from '@app/services/processors/ProcessorResult';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtSectionContentComponent } from '../../ct/ct-section-content/ct-section-content.component';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'edit-processor',
    templateUrl: './edit-processor.component.html',
    styleUrls: ['./edit-processor.component.scss'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtSectionContentComponent, MatFormField, MatLabel, MatInput, CdkTextareaAutosize, FormsModule, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent]
})

export class EditProcessorComponent implements OnInit {
    processor: Processor;
    processorResponse: ProcessorResult;
    constructor(
        private route: ActivatedRoute,
        private processorsService: ProcessorsService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.processorsService
            .getProcessor(this.route.snapshot.paramMap.get('id'))
            .subscribe((response) => {
                this.processorResponse = response;
                this.processor = response.processor;
            });
    }

    save(): void {
        this.processorsService
            .formCommit(this.processor)
            .subscribe((response) => {
                if (response.errorMessages?.length) {
                    this.processorResponse = response;
                } else {
                    this.back();
                }
            });
    }

    back(): void {
        this.router.navigate(['/dispatcher', 'processors']);
    }
}