import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AtlasService, Experiment, response, Task, Tasks } from '@services/atlas';
import { PlotComponent } from 'angular-plotly.js';
import { Subscription } from 'rxjs';
import { CtWrapBlockComponent } from '../../ct/ct-wrap-block/ct-wrap-block.component';


@Component({
    selector: 'atlas-experiment-feature-progress',
    templateUrl: './atlas-experiment-feature-progress.component.html',
    styleUrls: ['./atlas-experiment-feature-progress.component.scss']
})

export class AtlasExperimentFeatureProgressComponent implements OnInit {

    @ViewChild(PlotComponent)
    @ViewChild('consoleView') consoleView: CtWrapBlockComponent;

    plotly: PlotComponent;

    featureProgressResponse: response.experiment.FeatureProgress;

    consolePartResponse: response.experiment.FeatureProgressConsolePart;
    plotDataResponse: response.experiment.FeaturePlotDataPart;

    experiment: Experiment;

    //
    experimentId: string;
    atlasId: string;
    featureId: string;
    tasks: Tasks;
    metricsResult: any;
    lastParams: string = ',';
    canDraw: boolean = false;
    //
    pickedAxes: (boolean | any)[] = [false, false];
    currentTask: Task;

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
            this.dataGraph.data = [Object.assign({}, this.plotDataResponse || {}, {
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
        private atlasService: AtlasService,
    ) { }

    ngOnInit() {
        this.atlasId = this.route.snapshot.paramMap.get('atlasId');
        this.experimentId = this.route.snapshot.paramMap.get('experimentId');
        this.featureId = this.route.snapshot.paramMap.get('featureId');
        this.updateResponse();
    }

    updateResponse() {
        this.atlasService.experiment
            .featureProgress(this.atlasId, this.experimentId, this.featureId)
            .subscribe((response: response.experiment.FeatureProgress) => {
                this.featureProgressResponse = response;
                this.tables.features.table = Object
                    .keys(response.experimentFeature)
                    .filter(key => ['resourceCodes', 'id', 'execStatusAsString'].includes(key))
                    .map(key => [key, response.experimentFeature[key]]);
                this.tables.hyperParameters.table = new MatTableDataSource(response.hyperParamResult.elements || []);
                this.metricsResult = response.metricsResult;
                this.tasks = response.tasks;
            });
    }

    updateResponsePart(page: number) {
        this.atlasService.experiment
            .featureProgressPart(this.atlasId, this.experimentId, this.featureId, this.lastParams, page)
            .subscribe((response: response.experiment.FeatureProgressPart) => {
                this.tasks = response.tasks;
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
        this.featureProgressResponse.hyperParamResult
            .elements.forEach((elem) => {
                elem.list.forEach((item, i) => {
                    if (item.selected) {
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
        this.atlasService.experiment
            .featurePlotDataPart(this.atlasId, this.experimentId, this.featureId, params, paramsAxis)
            .subscribe((response) => {
                this.plotDataResponse = response;
                this.dataGraph.show = true;
                this.dataGraph.initData();
            });
    }

    nextPage() {
        this.updateResponsePart(this.tasks.number + 1);
    }

    prevPage() {
        this.updateResponsePart(this.tasks.number - 1);
    }
}