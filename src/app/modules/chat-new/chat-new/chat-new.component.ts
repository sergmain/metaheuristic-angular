import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import {SettingsService, SettingsServiceEventChange} from '@services/settings/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@services/authentication';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {TranslateService} from '@ngx-translate/core';
import {LoadStates} from '@app/enums/LoadStates';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@app/modules/chat-new/chat-service';
import {ChatPrompt, FullChat} from '@app/modules/chat-new/chat-data';
import {MatTableDataSource} from '@angular/material/table';
import {MIN_PROMPT_LEN} from '@app/modules/mh-consts';

@Component({
    selector: 'chat-new',
    templateUrl: './chat-new.component.html',
    styleUrls: ['./chat-new.component.scss'],
})
// DO NOT REMOVE '-new' FROM NAME OF COMPONENT
export class ChatNewComponent extends UIStateComponent implements OnInit, OnDestroy {
    // for chat-new.component.html
    protected readonly MhUtils = MhUtils;

    @ViewChild(MatButton) button: MatButton;
    @ViewChild('formDirective') formDirective : FormGroupDirective;

    dataSource = new MatTableDataSource<ChatPrompt>([]);
    columnsToDisplay: string[] = ['chat'];

    fullChat: FullChat;
    chatId: string;
    apiUid: string;

    showRaw: boolean = false;

    chatForm = new FormGroup({
        prompt: new FormControl('', [Validators.required, Validators.minLength(MIN_PROMPT_LEN)]),
    });

    currentStates: Set<LoadStates> = new Set();
    readonly states = LoadStates;

    constructor(
        private router: Router,
        private chatService: ChatService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private settingsService: SettingsService,
        private dialog: MatDialog,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);

        //this.dataChange.subscribe(data => this.rebuildTreeForData(data));
    }

    ngOnInit(): void {
        console.log("ngOnInit() start");
        this.chatId = this.activatedRoute.snapshot.paramMap.get('chatId');

        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.loadAssetsForChatting();
        console.log("ngOnInit() end");
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    // load assets for creating a new step of scenario
    loadAssetsForChatting(): void {
        this.setIsLoadingStart();
        this.chatService
            .chat(this.chatId)
            .subscribe((response) => {
                this.fullChat = response;
                this.setIsLoadingEnd();
            });
    }

    resetEvalStepForm() {
        this.chatForm.reset();
    }

    dontDoStepEvaluation(): boolean {
        return this.chatForm.invalid;
    }

    bookmark() {
        //
    }

    postPrompt() {
        let prompt: string = this.chatForm.value.prompt;

        this.chatService
            .postPrompt(this.chatId.toString(), prompt)
            .subscribe({
                next: prompt => {
                    console.log("postPrompt(), response: ", JSON.stringify(prompt));
                    // console.log("getSourceCodeId(), sourceCodeId", this.sourceCodeId);
                    this.fullChat.prompts.push(prompt);
                    this.dataSource = new MatTableDataSource(this.fullChat.prompts);
                },
                complete: () => {
                    this.resetEvalStepForm()
                }
            });
    }
}