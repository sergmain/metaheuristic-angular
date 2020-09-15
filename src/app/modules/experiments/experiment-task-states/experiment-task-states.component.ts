import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';

@Component({
  selector: 'experiment-task-states',
  templateUrl: './experiment-task-states.component.html',
  styleUrls: ['./experiment-task-states.component.sass']
})
export class ExperimentTaskStatesComponent implements OnInit {

  response: ExecContextStateResult;

  constructor(
    private sourceCodesService: SourceCodesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.sourceCodesService.execContext
      .execContextState(
        this.route.snapshot.paramMap.get('sourceCodeId'),
        this.route.snapshot.paramMap.get('execContextId')
      )
      .subscribe(response => {
        this.response = response;
      });
  }
}
