import { Component, OnInit } from '@angular/core';
import { environment } from '@src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-index',
    templateUrl: './app-index.component.html',
    styleUrls: ['./app-index.component.scss']
})
export class AppIndexComponent {
    htmlContent: SafeHtml;
    constructor(private domSanitizer: DomSanitizer) {
        this.htmlContent = domSanitizer.bypassSecurityTrustHtml(environment.brandingMsgIndex);
    }
}