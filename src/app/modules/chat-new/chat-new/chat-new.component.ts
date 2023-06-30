import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService, Authority, SimpleAccount } from '@app/services/accounts';
import { Role } from '@app/services/authentication';
import { AccountResult } from '@src/app/services/accounts/AccountResult';

@Component({
    selector: 'chat-new',
    templateUrl: './chat-new.component.html',
    styleUrls: ['./chat-new.component.scss'],
})
export class ChatNewComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private accountsService: AccountsService
    ) { }

    ngOnInit(): void {
    }
}
