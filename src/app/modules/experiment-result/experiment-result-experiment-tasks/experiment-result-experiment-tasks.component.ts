import { Component, OnInit, Input, Output, SimpleChanges, ViewChild, OnChanges, EventEmitter } from '@angular/core';
import { ExperimentResultService } from '@src/app/services/experiment-result/experiment-result.service';
import { Subscription } from 'rxjs';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtWrapBlockComponent } from '../../ct/ct-wrap-block/ct-wrap-block.component';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ExperimentResultTaskParamsYaml } from '@src/app/services/experiment-result/ExperimentResultTaskParamsYaml';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { ExperimentResultData } from '@src/app/services/experiment-result/ExperimentResultData';

@Component({
    selector: 'experiment-result-experiment-tasks',
    templateUrl: './experiment-result-experiment-tasks.component.html',
    styleUrls: ['./experiment-result-experiment-tasks.component.scss']
})
export class ExperimentResultExperimentTasksComponent implements OnInit, OnChanges {

    @Input() tasks: {
        content: ExperimentResultTaskParamsYaml[]
    } & PageableDefault;

    @Input() atlasId: string;

    @Output() nextPage = new EventEmitter<string>();
    @Output() prevPage = new EventEmitter<string>();

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;
    @ViewChild('consoleView', { static: true }) consoleView: CtWrapBlockComponent;

    consolePartResponse: ExperimentResultData.ConsoleResult;
    featureProgressPartResponse: ExperimentResultData.ExperimentFeatureExtendedResult;
    currentTask: ExperimentResultTaskParamsYaml;
    dataSource = new MatTableDataSource<any>([]);
    columnsToDisplay: string[] = ['id', 'info', 'bts'];

    constructor(
        private experimentResultService: ExperimentResultService
    ) { }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.tasks.content || []);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.dataSource = new MatTableDataSource(this.tasks.content || []);

        this.prevTable.disabled = this.tasks.first;
        this.nextTable.disabled = this.tasks.last;
    }

    featureProgressConsolePart(taskId: string) {
        this.consoleView.wait();
        const subscribe: Subscription = this.experimentResultService
            .getTasksConsolePart(this.atlasId, taskId)
            .subscribe(
                (response) => {
                    this.consolePartResponse = response;
                },
                () => { },
                () => {
                    this.consoleView.show();
                    subscribe.unsubscribe();
                },
            );
    }

    next() {
        this.nextPage.emit('next');
    }

    prev() {
        this.prevPage.emit('prev');
    }
}