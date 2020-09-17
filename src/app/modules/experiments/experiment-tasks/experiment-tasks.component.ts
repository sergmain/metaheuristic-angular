import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtWrapBlockComponent } from '../../ct/ct-wrap-block/ct-wrap-block.component';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ExperimentsService } from '@src/app/services/experiments/experiments.service';
import { Task } from '@src/app/services/experiments/Task';
import { TasksResult } from '@src/app/services/experiments/TasksResult';
import { response } from '@src/app/services/experiments/response';

@Component({
    selector: 'experiment-tasks',
    templateUrl: './experiment-tasks.component.html',
    styleUrls: ['./experiment-tasks.component.scss']
})
export class ExperimentTasksComponent implements OnInit, OnChanges {

    @Input() tasks: TasksResult;
    @ViewChild('nextTable') nextTable: MatButton;
    @ViewChild('prevTable') prevTable: MatButton;
    @ViewChild('table') table: CtTableComponent;
    @ViewChild('consoleView', { static: true }) consoleView: CtWrapBlockComponent;

    consolePartResponse: response.experiment.FeatureProgressConsolePart;

    currentTask: Task;
    dataSource = new MatTableDataSource<any>([]);
    columnsToDisplay: string[] = ['id', 'col1', 'col2'];

    constructor(private experimentsService: ExperimentsService) { }

    ngOnInit() { }

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
        this.experimentsService.rerunTask(taskId);
    }
}