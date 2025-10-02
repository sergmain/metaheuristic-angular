import { Component, ElementRef, OnInit, OnChanges, input, output, viewChild } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone : true,
    selector: 'ct-file-upload',
    templateUrl: './ct-file-upload.component.html',
    styleUrls: ['./ct-file-upload.component.scss'],
    imports: [MatButton, MatIcon]
})
export class CtFileUploadComponent implements OnInit, OnChanges {
    changed = output<string>();

    fileInput = viewChild<ElementRef>('fileInput');
    buttonTitle = input<string>();
    acceptTypes = input<string>('');


    value: string = '';
    buttonTitleString: string;
    accept: string;

    ngOnInit(): void {
        this.buttonTitleString = this.buttonTitle() || 'Select File';
    }

    ngOnChanges(): void {
        this.buttonTitleString = this.buttonTitle() || 'Select File';
    }

    fileChanged(): void {
        this.value = this.fileInput().nativeElement.value;
        this.changed.emit('fileChanged');
    }

    removeFile(): void {
        this.fileInput().nativeElement.value = '';
        this.value = '';
        this.changed.emit('fileChanged');
    }
}