import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'ct-env-msg-outer',
  templateUrl: './ct-env-msg-outer.component.html',
  styleUrls: ['./ct-env-msg-outer.component.sass']
})
export class CtEnvMsgOuterComponent implements OnInit {
  @Input() propertyName: string;
  content: SafeHtml;

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.propertyName) {
      this.content = this.domSanitizer.bypassSecurityTrustHtml(environment[this.propertyName]);
    }
  }
}
