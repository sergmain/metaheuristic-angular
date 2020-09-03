import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessorsService } from '@src/app/services/processors/processors.service';
import { Processor } from '@src/app/services/processors/Processor';
import { ProcessorResult } from '@src/app/services/processors/ProcessorResult';

@Component({
    selector: 'edit-processor',
    templateUrl: './edit-processor.component.html',
    styleUrls: ['./edit-processor.component.scss']
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
        this.processorsService.processor
            .get(this.route.snapshot.paramMap.get('id'))
            .subscribe((response) => {
                this.processorResponse = response;
                this.processor = response.processor;
            });
    }

    save(): void {
        this.processorsService.processor
            .form(this.processor)
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