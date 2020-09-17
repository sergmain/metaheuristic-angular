import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'batch-state',
  templateUrl: './batch-state.component.html',
  styleUrls: ['./batch-state.component.sass']
})
export class BatchStateComponent {
  sourceCodeId: string;
  execContextId: string;
  constructor(
    private route: ActivatedRoute,
  ) {
    this.sourceCodeId = this.route.snapshot.paramMap.get('sourceCodeId');
    this.execContextId = this.route.snapshot.paramMap.get('execContextId');
  }
}
