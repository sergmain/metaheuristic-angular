import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
@Component({
    selector: 'add-source-code',
    templateUrl: './add-source-code.component.html',
    styleUrls: ['./add-source-code.component.scss']
})

export class AddSourceCodeComponent implements OnInit {
    response;
    @ViewChild('submitButton', { static: true }) submitButton: MatButton;

    form = new FormGroup({
        sourceCodeYaml: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    constructor(
        private sourceCodesService: SourceCodesService,
        private location: Location
    ) { }

    ngOnInit() { }

    cancel() {
        this.location.back();
    }

    create() {
        this.response = null;
        this.submitButton.disabled = true;
        this.sourceCodesService.sourceCode
            .add(this.form.value.sourceCodeYaml)
            .subscribe(
                (v) => {
                    this.response = v;
                    if (this.response.status.toLowerCase() === 'ok') { this.cancel(); }
                    this.submitButton.disabled = false;
                },
                () => { this.submitButton.disabled = false; }
            );
    }
}