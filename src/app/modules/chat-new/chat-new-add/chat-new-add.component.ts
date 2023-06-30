import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AccountsService} from '@app/services/accounts/accounts.service';

@Component({
    selector: 'chat-new-add',
    templateUrl: './chat-new-add.component.html',
    styleUrls: ['./chat-new-add.component.scss']
})

export class ChatNewAddComponent {

    constructor(
        private accountsService: AccountsService,
        private router: Router,
    ) { }


}