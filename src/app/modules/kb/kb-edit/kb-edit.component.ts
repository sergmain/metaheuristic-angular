import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import {SimpleKb} from "@services/kb/SimpleKb";
import {KbService} from "@services/kb/kb.service";

@Component({
    selector: 'kb-edit',
    templateUrl: './kb-edit.component.html',
    styleUrls: ['./kb-edit.component.scss'],
    standalone: false
})

export class KbEditComponent implements OnInit {
    readonly states = LoadStates;
    currentStates = new Set();
    response;
    kb: SimpleKb;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private kbService: KbService,
        private location: Location
    ) { }

    ngOnInit() {
        this.currentStates.add(this.states.firstLoading);
        this.getApi();
    }

    getApi(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.kbService
            .getKb(id)
            .subscribe(
                (response) => {
                    this.kb = response.kb;
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.firstLoading);
                }
            );
    }

    back() {
        this.location.back();
    }

    save() {
        this.currentStates.add(this.states.wait);
        this.kbService
            .editFormCommit(this.kb.id.toString(), this.kb.params)
            .subscribe(
                (response) => {
                    this.router.navigate(['/dispatcher', 'kbs']);
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.wait);
                }
            );
    }
}