import { Component, OnInit, input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '@src/environments/environment';

@Component({
    imports: [],
    standalone : true,
    selector: 'ct-env-msg-outer',
    templateUrl: './ct-env-msg-outer.component.html',
    styleUrls: ['./ct-env-msg-outer.component.sass']
})
export class CtEnvMsgOuterComponent implements OnInit {
      private domSanitizer = inject(DomSanitizer);
  propertyName = input<string>();
  content: SafeHtml;

  ngOnInit(): void {
    if (this.propertyName()) {
      this.content = this.domSanitizer.bypassSecurityTrustHtml(environment[this.propertyName()!]);
    }
  }
}
