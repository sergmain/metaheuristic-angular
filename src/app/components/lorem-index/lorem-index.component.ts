import { Component, OnInit } from '@angular/core';
import { environment } from '@src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'lorem-index',
    templateUrl: './lorem-index.component.html',
    styleUrls: ['./lorem-index.component.sass']
})
export class LoremIndexComponent {
    content: SafeHtml;
    constructor(domSanitizer: DomSanitizer) {
        this.content = domSanitizer.bypassSecurityTrustHtml(environment.lorem);
    }
}