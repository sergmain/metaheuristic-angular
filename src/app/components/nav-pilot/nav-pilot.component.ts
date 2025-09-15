import { Component, OnInit } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
    selector: 'nav-pilot',
    templateUrl: './nav-pilot.component.html',
    styleUrls: ['./nav-pilot.component.scss'],
    imports: [MatList, MatListItem, MatButton, RouterLinkActive, RouterLink]
})
export class NavPilotComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
