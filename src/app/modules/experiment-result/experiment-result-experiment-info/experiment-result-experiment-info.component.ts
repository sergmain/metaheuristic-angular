import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { state } from '@app/helpers/state';
import { ExperimentResult } from '@src/app/models/beans/ExperimentResult';
import { ExperimentResultService } from '@src/app/services/experiment-result/experiment-result.service';
import { ExperimentResultApiData } from '@src/app/services/experiment-result/ExperimentResultApiData';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';
import { Subscription } from 'rxjs';

@Component({
    selector: 'experiment-result-experiment-info',
    templateUrl: './experiment-result-experiment-info.component.html',
    styleUrls: ['./experiment-result-experiment-info.component.scss']
})
export class ExperimentResultExperimentInfoComponent implements OnInit {
    state = state;
    currentState = this.state.loading;

    experimentInfoExtended: ExperimentResultData.ExperimentInfoExtended;
    experiment: ExperimentResultApiData.ExperimentResultData;
    experimentInfo: ExperimentResultData.ExperimentInfo;
    experimentResult: ExperimentResult;

    tables = {
        generalInfo: {
            table: [],
            columnsToDisplay: ['key', 'value'],
        },
        hyperParameters: {
            table: new MatTableDataSource([]),
            columnsToDisplay: ['key', 'value', 'variants'],
        },
        features: {
            table: new MatTableDataSource([]),
            columnsToDisplay: ['id', 'resourceCodes', 'execStatus', 'maxValue', 'bts'],
        },
    };

    columnsToDisplay = ['id', 'name', 'createdOn', 'bts'];

    constructor(
        private route: ActivatedRoute,
        private experimentResultService: ExperimentResultService,
        private location: Location
    ) { }

    ngOnInit() {
        this.load();
    }

    load(): void {
        this.experimentResultService
            .info(this.route.snapshot.paramMap.get('id'))
            .subscribe(experimentInfoExtended => {
                this.experimentInfoExtended = experimentInfoExtended;
                this.experiment = experimentInfoExtended.experiment;
                this.experimentInfo = experimentInfoExtended.experimentInfo;
                this.experimentResult = experimentInfoExtended.experimentResult;
                this.tables.generalInfo.table = Object
                    .keys(this.experiment)
                    .map(key => [key, this.experiment[key]])
                    .filter(o => ['id', 'createdOn', 'name', 'description', 'numberOfTask'].includes(o[0]));

                this.tables.hyperParameters.table = new MatTableDataSource(this.experiment.hyperParams);
                this.tables.features.table = new MatTableDataSource(this.experimentInfo.features);
            });
    }
}