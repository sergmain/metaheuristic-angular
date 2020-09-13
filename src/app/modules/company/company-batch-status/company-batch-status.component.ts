import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BatchData } from '@src/app/models/data/BatchData';
import { CompanyService } from '@src/app/services/company/company.service';

@Component({
    selector: 'company-batch-status',
    templateUrl: './company-batch-status.component.html',
    styleUrls: ['./company-batch-status.component.sass']
})
export class CompanyBatchStatusComponent implements OnInit {

    companyUniqueId: string;
    batchId: string;
    batchDataStatus: BatchData.Status;

    constructor(
        private companyService: CompanyService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.companyUniqueId = this.activatedRoute.snapshot.paramMap.get('companyUniqueId');
        this.batchId = this.activatedRoute.snapshot.paramMap.get('batchId');

        this.companyService
            .getProcessingResourceStatus(this.companyUniqueId, this.batchId)
            .subscribe(batchDataStatus => this.batchDataStatus = batchDataStatus);
    }
}
