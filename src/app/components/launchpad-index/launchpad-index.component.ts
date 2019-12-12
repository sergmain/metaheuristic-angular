import { Component, OnInit } from '@angular/core';
import { environment } from '@src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'launchpad-index',
    templateUrl: './launchpad-index.component.html',
    styleUrls: ['./launchpad-index.component.scss']
})
export class LaunchpadIndexComponent {
    htmlContent: SafeHtml;
    constructor(private domSanitizer: DomSanitizer) {
        this.htmlContent = domSanitizer.bypassSecurityTrustHtml(environment.brandingMsg);
    }
}