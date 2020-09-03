import { Component, Input } from '@angular/core';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

@Component({
  selector: 'ct-rest-status',
  templateUrl: './ct-rest-status.component.html',
  styleUrls: ['./ct-rest-status.component.scss']
})
export class CtRestStatusComponent {
  @Input() content: DefaultResponse;
}
