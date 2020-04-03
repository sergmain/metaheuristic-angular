import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { state } from '@app/helpers/state';
import { ExperimentsService } from '@app/services/experiments/experiments.service';
import { Subscription } from 'rxjs';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { ExperimentApiData } from '@src/app/services/experiments/ExperimentApiData';

@Component({
    selector: 'experiment-info',
    templateUrl: './experiment-info.component.html',
    styleUrls: ['./experiment-info.component.scss']
})

export class ExperimentInfoComponent implements OnInit {
    state = state;
    currentState = this.state.loading;

    response;
    experiment: ExperimentApiData.ExperimentData;
    experimentInfo: ExperimentApiData.ExperimentInfoResult;

    toAtlasResponse: DefaultResponse;

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
        private experimentsService: ExperimentsService,
        private location: Location
    ) { }

    ngOnInit() {
        this.load();
    }

    toAtlas() {
        this.experimentsService.experiment
            .toAtlas(this.experiment.id.toString())
            .subscribe(response => this.toAtlasResponse = response);
    }



    stop() {
        // TODO  experimentsService.stop notExist
    }

    load() {
        const id = this.route.snapshot.paramMap.get('experimentId');
        this.experimentsService.experiment
            .info(id)
            .subscribe(response => {
                this.response = response;
                this.experiment = response.experiment;
                this.experimentInfo = response.experimentInfo;
                this.tables.generalInfo.table = Object.keys(this.experiment).map(key => [key, this.experiment[key]]);
                this.tables.hyperParameters.table = new MatTableDataSource(this.experiment.hyperParams);
                this.tables.features.table = new MatTableDataSource(this.experimentInfo.features);
            });
    }
}