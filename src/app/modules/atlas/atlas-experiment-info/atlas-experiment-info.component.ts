import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { state } from '@app/helpers/state';
import { AtlasService, Experiment, Atlas, response } from '@services/atlas';
import { Subscription } from 'rxjs';
import { ExperimentInfo } from '@src/app/services/experiments/ExperimentInfo';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'atlas-experiment-info',
    templateUrl: './atlas-experiment-info.component.html',
    styleUrls: ['./atlas-experiment-info.component.scss']
})
export class AtlasExperimentInfoComponent implements OnInit {
    state = state;
    currentState = this.state.loading;
    experiment: Experiment;
    experimentInfo: ExperimentInfo;
    atlas: Atlas;

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
        private atlasService: AtlasService,
        private location: Location
    ) {}

    ngOnInit() {
        this.load();
    }

    load() {
        const id: string = this.route.snapshot.paramMap.get('id');
        const subscribe: Subscription = this.atlasService.experiment.info(id)
            .subscribe(
                (response: response.experiment.Info) => {
                    this.experiment = response.experiment;
                    this.experimentInfo = response.experimentInfo;
                    this.atlas = response.atlas;
                    this.tables.generalInfo.table = Object.keys(this.experiment).map(key => [key, this.experiment[key]]);
                    this.tables.hyperParameters.table = new MatTableDataSource(this.experiment.hyperParams);
                    this.tables.features.table = new MatTableDataSource(this.experimentInfo.features);
                },
                () => {},
                () => subscribe.unsubscribe()
            );
    }
}