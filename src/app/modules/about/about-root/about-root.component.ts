import { Component, OnInit } from '@angular/core';
import { AboutIndexComponent } from '../about-index/about-index.component';
import { CopyRightComponent } from '../../copy-right/copy-right/copy-right.component';

@Component({
    selector: 'about-root',
    templateUrl: './about-root.component.html',
    styleUrls: ['./about-root.component.sass'],
    imports: [AboutIndexComponent, CopyRightComponent]
})
export class AboutRootComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
