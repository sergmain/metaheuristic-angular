import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { Subscription } from 'rxjs';
import { ProcessorsService } from '@src/app/services/processors/processors.service';
import { Processor } from '@src/app/services/processors/Processor';
import { DefaultResponse } from '@src/app/models/DefaultResponse';

@Component({
    selector: 'edit-processor',
    templateUrl: './edit-processor.component.html',
    styleUrls: ['./edit-processor.component.scss']
})

export class EditProcessorComponent implements OnInit {
    readonly states = LoadStates;
    currentState: LoadStates = LoadStates.firstLoading;

    processor: Processor;
    // TODO: нетипичный ответ от сервера - нотификейшена не будет
    response;
    formResponse: DefaultResponse;
    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private processorsService: ProcessorsService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.processorsService.processor
            .get(this.route.snapshot.paramMap.get('id'))
            .subscribe(
                (data) => {
                    this.response = data;
                    this.processor = data.processor;
                    this.currentState = this.states.show;
                }
            );
    }

    save() {
        this.currentState = this.states.wait;
        this.processorsService.processor
            .form(this.processor)
            .subscribe((response: DefaultResponse) => {
                this.formResponse = response;
                this.router.navigate(['/dispatcher', 'processors']);
            });
    }

    cancel() {
        this.location.back();
    }
}