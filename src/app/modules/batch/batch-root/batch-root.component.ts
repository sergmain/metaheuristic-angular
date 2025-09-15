import { Component, OnInit } from '@angular/core';
import { CtContentComponent } from '../../ct/ct-content/ct-content.component';
import { RouterOutlet } from '@angular/router';
import { CtBackButtonComponent } from '../../ct/ct-back-button/ct-back-button.component';
import { CopyRightComponent } from '../../copy-right/copy-right/copy-right.component';

@Component({
    selector: 'batch-root',
    templateUrl: './batch-root.component.html',
    styleUrls: ['./batch-root.component.sass'],
    imports: [CtContentComponent, RouterOutlet, CtBackButtonComponent, CopyRightComponent]
})
export class BatchRootComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
