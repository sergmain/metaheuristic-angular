import { Component, Input, OnInit } from '@angular/core';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';

@Component({
  selector: 'ct-state-of-tasks',
  templateUrl: './ct-state-of-tasks.component.html',
  styleUrls: ['./ct-state-of-tasks.component.scss']
})
export class CtStateOfTasksComponent implements OnInit {
  @Input() sourceCodeId: string;
  @Input() execContextId: string;

  response: ExecContextStateResult;

  constructor(private sourceCodesService: SourceCodesService) { }

  ngOnInit(): void {
    if (this.sourceCodeId && this.execContextId) {
      this.sourceCodesService.execContext
        .execContextState(this.sourceCodeId, this.execContextId)
        .subscribe(response => {
          this.response = response;
        });
    }
  }
}
