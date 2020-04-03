import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { MatTableDataSource, MatButton } from '@angular/material';
import { TasksResult, Task, ExperimentsService, response } from '@app/services/experiments/';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtWrapBlockComponent } from '../../ct/ct-wrap-block/ct-wrap-block.component';

@Component({
    selector: 'experiment-tasks',
    templateUrl: './experiment-tasks.component.html',
    styleUrls: ['./experiment-tasks.component.scss']
})
export class ExperimentTasksComponent implements OnInit, OnChanges {

    @Input() tasks: TasksResult;
    @ViewChild('nextTable', { static: false }) nextTable: MatButton;
    @ViewChild('prevTable', { static: false }) prevTable: MatButton;
    @ViewChild('table', { static: false }) table: CtTableComponent;
    @ViewChild('consoleView', { static: true }) consoleView: CtWrapBlockComponent;

    consolePartResponse: response.experiment.FeatureProgressConsolePart;

    currentTask: Task;
    dataSource = new MatTableDataSource < any > ([]);
    columnsToDisplay: string[] = ['id', 'col1', 'col2'];

    constructor(private experimentsService: ExperimentsService) {}

    ngOnInit() {}

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(this.tasks.items.content || []);
    }

    featureProgressConsolePart(taskId: string) {
        this.consoleView.wait();
        this.experimentsService.experiment
            .featureProgressConsolePart(taskId)
            .subscribe(
                (res: response.experiment.FeatureProgressConsolePart) => {
                    this.consolePartResponse = res;
                    this.consoleView.show();
                }
            );
    }

    taskRerun(taskId: string) {
        this.experimentsService.experiment.taskRerun(taskId)
    }
}