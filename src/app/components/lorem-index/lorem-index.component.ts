import { Component, OnInit } from '@angular/core';
import { environment } from '@src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'lorem-index',
    templateUrl: './lorem-index.component.html',
    styleUrls: ['./lorem-index.component.sass'],
    standalone: false
})
export class LoremIndexComponent {
    content: SafeHtml;
    constructor(private domSanitizer: DomSanitizer) {
        this.content = domSanitizer.bypassSecurityTrustHtml(environment.brandingMsg);
    }
}