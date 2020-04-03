import { Component, OnInit, Input, Output, SimpleChanges, ViewChild, OnChanges, EventEmitter } from '@angular/core';
import { AtlasService, Tasks, Task, response } from '@app/services/atlas/';
import { Subscription } from 'rxjs';
import { CtTableComponent } from '../../ct/ct-table/ct-table.component';
import { CtWrapBlockComponent } from '../../ct/ct-wrap-block/ct-wrap-block.component';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'atlas-experiment-tasks',
    templateUrl: './atlas-experiment-tasks.component.html',
    styleUrls: ['./atlas-experiment-tasks.component.scss']
})
export class AtlasExperimentTasksComponent implements OnInit, OnChanges {

    @Input() tasks: Tasks;
    @Input() atlasId: string;

    @Output() nextPage = new EventEmitter < string > ();
    @Output() prevPage = new EventEmitter < string > ();

    @ViewChild('nextTable', { static: true }) nextTable: MatButton;
    @ViewChild('prevTable', { static: true }) prevTable: MatButton;
    @ViewChild('table', { static: true }) table: CtTableComponent;
    @ViewChild('consoleView', { static: true }) consoleView: CtWrapBlockComponent;

    consolePartResponse: response.experiment.FeatureProgressConsolePart;
    featureProgressPartResponse: response.experiment.FeatureProgressPart;
    currentTask: Task;
    dataSource = new MatTableDataSource < any > ([]);
    columnsToDisplay: string[] = ['id', 'info', 'bts'];

    constructor(
        private atlasService: AtlasService
    ) {}

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
        const subscribe: Subscription = this.atlasService.experiment
            .featureProgressConsolePart(this.atlasId, taskId)
            .subscribe(
                (response: response.experiment.FeatureProgressConsolePart) => {
                    this.consolePartResponse = response;
                },
                () => {},
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