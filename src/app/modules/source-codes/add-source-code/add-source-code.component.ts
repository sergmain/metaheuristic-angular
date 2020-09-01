import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
@Component({
    selector: 'add-source-code',
    templateUrl: './add-source-code.component.html',
    styleUrls: ['./add-source-code.component.scss']
})

export class AddSourceCodeComponent {
    response;
    @ViewChild('submitButton', { static: true }) submitButton: MatButton;

    form = new FormGroup({
        source: new FormControl('', [
            Validators.required,
            Validators.minLength(1)
        ]),
    });

    constructor(
        private sourceCodesService: SourceCodesService,
        private location: Location
    ) { }

    cancel() {
        this.location.back();
    }

    create() {
        this.response = null;
        this.submitButton.disabled = true;
        this.sourceCodesService.sourceCode
            .add(this.form.value.source)
            .subscribe((v) => {
                this.response = v;
                if (this.response.status.toLowerCase() === 'ok') {
                    this.cancel();
                } else {
                    this.scrillToTop();
                }
                this.submitButton.disabled = false;
            });
    }

    scrillToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

}