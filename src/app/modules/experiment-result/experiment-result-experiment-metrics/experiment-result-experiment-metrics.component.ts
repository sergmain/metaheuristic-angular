import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';
@Component({
    selector: 'experiment-result-experiment-metrics',
    templateUrl: './experiment-result-experiment-metrics.component.html',
    styleUrls: ['./experiment-result-experiment-metrics.component.scss']
})
export class ExperimentResultExperimentMetricsComponent implements OnInit, OnChanges {
    @Output() draw = new EventEmitter<string>();

    @Input() metricsResult: ExperimentResultData.MetricsResult;
    @Input() dataGraph: any;
    @Input() canDraw: boolean;

    dataSource = new MatTableDataSource<any>([]);
    columnsToDisplay: string[] = [];

    constructor() { }

    ngOnInit() {
        if (this.metricsResult) { this.update(); }
    }

    ngOnChanges() {
        if (this.metricsResult) { this.update(); }
    }

    private update() {
        const newColumnsToDisplay: string[] = [].concat(this.metricsResult.metricNames, ['params']);
        const newDataSource: any = [];

        this.metricsResult.metrics.forEach((item: ExperimentResultData.MetricElement) => {
            const values: string[] = [].concat(item.values, [item.params]);
            const row: any = {};
            values.forEach((elem: string, index: number) => {
                row[newColumnsToDisplay[index]] = elem;
            });
            newDataSource.push(row);
        });

        this.columnsToDisplay = newColumnsToDisplay;
        this.dataSource = new MatTableDataSource(newDataSource);
    }

    drawPlot() {
        this.draw.emit('draw');
    }
}