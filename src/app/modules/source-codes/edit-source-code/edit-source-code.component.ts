import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { SourceCodesService } from '@src/app/services/source-codes/source-codes.service';
import { SourceCode } from '@src/app/services/source-codes/SourceCode';


@Component({
    selector: 'edit-source-code',
    templateUrl: './edit-source-code.component.html',
    styleUrls: ['./edit-source-code.component.scss']
})

export class EditSourceCodeComponent implements OnInit {
    readonly states = LoadStates;
    currentState: LoadStates = LoadStates.firstLoading;

    sourceCode: SourceCode;
    response;

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private sourceCodesService: SourceCodesService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.updateResponse();
    }

    updateResponse() {
        const id: string | number = this.route.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService.sourceCode
            .get(id)
            .subscribe(v => {
                this.response = v;
                this.sourceCode = v.sourceCode;
                this.currentState = this.states.show;
            }
            );
    }

    cancel() {
        this.router.navigate(['/dispatcher', 'source-codes']);
    }

    save() {
        this.currentState = this.states.wait;
        this.sourceCodesService.sourceCode
            .edit(this.sourceCode.id.toString(), this.sourceCode.source)
            .subscribe(
                (v) => {
                    if (v.errorMessages) {
                        this.currentState = this.states.show;
                        this.response = v;
                    } else {
                        this.cancel();
                    }
                },
                () => this.currentState = this.states.show
            );
    }

    validate() {
        this.currentState = this.states.wait;
        const id: string = this.route.snapshot.paramMap.get('sourceCodeId');
        this.sourceCodesService.sourceCode
            .validate(id)
            .subscribe(
                (v) => {
                    this.response = v;
                    this.currentState = this.states.show;
                },
                () => this.currentState = this.states.show
            );
    }
}