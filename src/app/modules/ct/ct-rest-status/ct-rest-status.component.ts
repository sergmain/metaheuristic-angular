import { Component, OnInit, Input } from '@angular/core';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SourceCodeResult } from '@src/app/services/source-codes/SourceCodeResult';

@Component({
  selector: 'ct-rest-status',
  templateUrl: './ct-rest-status.component.html',
  styleUrls: ['./ct-rest-status.component.scss']
})
export class CtRestStatusComponent implements OnInit {
  @Input() content: SourceCodeResult;

  constructor() { }

  ngOnInit(): void {
  }

}
