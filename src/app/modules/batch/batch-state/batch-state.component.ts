import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';

@Component({
  selector: 'batch-state',
  templateUrl: './batch-state.component.html',
  styleUrls: ['./batch-state.component.sass']
})
export class BatchStateComponent implements OnInit {

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
