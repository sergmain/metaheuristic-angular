import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ExperimentResultService } from '@src/app/services/experiment-result/experiment-result.service';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';
import { ExperimentResultTaskParamsYaml } from '@src/app/services/experiment-result/ExperimentResultTaskParamsYaml';
import { ExperimentApiData } from '@src/app/services/experiments/ExperimentApiData';
import { PlotComponent } from 'angular-plotly.js';
import { CtWrapBlockComponent } from '../../ct/ct-wrap-block/ct-wrap-block.component';


@Component({
    selector: 'experiment-result-experiment-feature-progress',
    templateUrl: './experiment-result-experiment-feature-progress.component.html',
    styleUrls: ['./experiment-result-experiment-feature-progress.component.scss']
})

export class ExperimentResultExperimentFeatureProgressComponent implements OnInit {

    @ViewChild(PlotComponent) plotComponent;
    @ViewChild('consoleView') consoleView: CtWrapBlockComponent;

    plotly: PlotComponent;
    experimentFeatureExtendedResult: ExperimentResultData.ExperimentFeatureExtendedResult;
    consolePartResponse: ExperimentResultData.ConsoleResult;
    plotData: ExperimentResultData.PlotData;
    experiment: ExperimentApiData.ExperimentData;

    //
    experimentId: string;
    experimentResultId: string;
    featureId: string;
    metricsResult: any;
    lastParams: string = ',';
    canDraw: boolean = false;
    //
    pickedAxes: (boolean | any)[] = [false, false];
    currentTask: ExperimentResultTaskParamsYaml;

    tables = {
        hyperParameters: {
            table: new MatTableDataSource([]),
            columnsToDisplay: ['key', 'values', 'axes']
        },
        features: {
            table: [],
            columnsToDisplay: ['key', 'value']
        }
    };

    dataGraph = {
        show: false,
        initData: (): void => {
            this.dataGraph.data = [Object.assign({}, this.plotData || {}, {
                type: 'surface'
            })];
        },
        data: [],
        config: {
            scrollZoom: false,
            displayModeBar: true
        },
        layout: {
            title: 'Metrics',
            showlegend: false,
            autosize: true,
            scene: {
                xaxis: {
                    type: 'category',
                    title: ''
                },
                yaxis: {
                    type: 'category',
                    title: ''
                },
                zaxis: {
                    title: '',
                }
            }
        }
    };


    constructor(
        private route: ActivatedRoute,
        private experimentResultService: ExperimentResultService,
    ) { }

    ngOnInit() {
        this.experimentResultId = this.route.snapshot.paramMap.get('experimentResultId');
        this.experimentId = this.route.snapshot.paramMap.get('experimentId');
        this.featureId = this.route.snapshot.paramMap.get('featureId');
        this.updateResponse();
    }

    updateResponse() {
        this.experimentResultService
            .getFeatures(this.experimentResultId, this.experimentId, this.featureId)
            .subscribe(experimentFeatureExtendedResult => {
                this.experimentFeatureExtendedResult = experimentFeatureExtendedResult;
                this.tables.features.table = Object
                    .keys(experimentFeatureExtendedResult.experimentFeature)
                    .filter(key => ['variables', 'id', 'execStatusAsString'].includes(key))
                    .map(key => [key, experimentFeatureExtendedResult.experimentFeature[key]]);
                this.tables.hyperParameters.table = new MatTableDataSource(experimentFeatureExtendedResult.hyperParamResult.elements || []);
                this.metricsResult = experimentFeatureExtendedResult.metricsResult;
            });
    }

    updateResponsePart(page: number) {
        this.experimentResultService
            .getFeatureProgressPart(this.experimentResultId, this.experimentId, this.featureId, this.lastParams, page.toString())
            .subscribe(experimentFeatureExtendedResult => {
                this.experimentFeatureExtendedResult.tasks = experimentFeatureExtendedResult.tasks;
            });
    }

    drawPlot() {
        const base = this;
        const params = initParams();
        const paramsAxis = initParamsAxis();

        function initParams() {
            const paramsArr: string[] = [];
            base.pickedAxes.forEach((elem) => {
                elem.list.forEach((item, i) => {
                    if (item.selected) {
                        paramsArr.push(`${elem.key}-${i}`);
                    }
                });
            });
            return paramsArr.join(',');
        }

        function initParamsAxis() {
            return base.pickedAxes.reduce((accm, elem) => {
                accm.push(elem.key);
                return accm;
            }, []).join(',');

        }
        this.featurePlotDataPart(params || ',', paramsAxis);
    }

    pickHyperParam(el) {
        el.selected = !el.selected;
        const paramsArr: string[] = [];
        this.experimentFeatureExtendedResult.hyperParamResult
            .elements.forEach((elem) => {
                elem.list.forEach((item, i) => {
                    if (item.isSelected) {
                        paramsArr.push(`${elem.key}-${i}`);
                    }
                });
            });
        this.lastParams = paramsArr.join(',') || ',';
        this.updateResponsePart(0);
    }

    pickAxis(el) {
        if (this.pickedAxes.includes(el)) {
            this.pickedAxes[this.pickedAxes.indexOf(el)] = false;
        } else {
            this.pickedAxes[this.pickedAxes.indexOf(false)] = el;
        }
        this.canDraw = !this.pickedAxes.includes(false);
    }

    featurePlotDataPart(params, paramsAxis) {
        this.experimentResultService
            .getPlotData(this.experimentResultId, this.experimentId, this.featureId, params, paramsAxis)
            .subscribe(plotData => {
                this.plotData = plotData;
                this.dataGraph.show = true;
                this.dataGraph.initData();
            });
    }

    nextPage() {
        this.updateResponsePart(this.experimentFeatureExtendedResult.tasks.number + 1);
    }

    prevPage() {
        this.updateResponsePart(this.experimentFeatureExtendedResult.tasks.number - 1);
    }
}