import { Component, Input, OnInit } from '@angular/core';
import { ExecContextService } from '@src/app/services/exec-context/exec-context.service';
import { ExecContextStateResult } from '@src/app/services/source-codes/ExecContextStateResult';

@Component({
  selector: 'ct-state-of-tasks',
  templateUrl: './ct-state-of-tasks.component.html',
  styleUrls: ['./ct-state-of-tasks.component.scss']
})
export class CtStateOfTasksComponent implements OnInit {
  @Input() sourceCodeId: string;
  @Input() execContextId: string;

  response: ExecContextStateResult;

  constructor(
    private execContextService: ExecContextService
  ) { }

  ngOnInit(): void {
    if (this.sourceCodeId && this.execContextId) {
      this.execContextService
        .execContextsState(this.sourceCodeId, this.execContextId)
        .subscribe(response => {
          this.response = response;
        });
    }
  }
}
