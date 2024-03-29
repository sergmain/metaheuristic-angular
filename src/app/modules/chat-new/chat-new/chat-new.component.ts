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
import {ChatPrompt, ChatsAllResult, ChatsResult, FullChat, SimpleChat} from '@app/modules/chat-new/chat-data';
import {MatTableDataSource} from '@angular/material/table';
import {MIN_PROMPT_LEN} from '@app/modules/mh-consts';
import {Subscription} from 'rxjs';

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

    chatsDataSource: MatTableDataSource<SimpleChat> = new MatTableDataSource<SimpleChat>([]);
    chatListColsToDisplay: string[] = ['name'];
    chats: ChatsAllResult;

    dataSource = new MatTableDataSource<ChatPrompt>([]);
    columnsToDisplay: string[] = ['chat'];

    fullChat: FullChat;
    chatId: string;
    apiUid: string;

    isShowRaw: boolean = false;
    isNotPosting: boolean = true;
    isTextareaBased: boolean = false;

    chatForm = new FormGroup({
        prompt: new FormControl('', [Validators.required, Validators.minLength(MIN_PROMPT_LEN)]),
    });

    charInfoForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)])
    });
    isFormActive: boolean = false;

    currentStates: Set<LoadStates> = new Set();
    readonly states = LoadStates;

    isListLoading: boolean = false;
    isChatLoading: boolean = false;

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
        this.chatId = this.activatedRoute.snapshot.paramMap.get('chatId');
        this.loadAssetsForChatting();
    }

    updateTable(): void {
        this.isListLoading = true;
        this.chatService
            .chatsAll()
            .subscribe({
                next: chats => {
                    //console.log("ChatsNewComponent.updateTable() #1", JSON.stringify(chats));
                    this.chats = chats;
                    this.chatsDataSource = new MatTableDataSource(this.chats.chats || []);
                },
                complete: () => {
                    this.isListLoading = false;
                }
            });
    }

    ngOnInit(): void {
        console.log("ngOnInit() start");
        // this.chatId = this.activatedRoute.snapshot.paramMap.get('chatId');

        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.updateTable();
        console.log("ngOnInit() end");
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    // load assets for creating a new step of scenario
    loadAssetsForChatting(): void {
        this.isChatLoading = true;
        this.chatService
            .chat(this.chatId)
            .subscribe((response) => {
                this.fullChat = response;
                // console.log("loadAssetsForChatting() ", this.fullChat.prompts || []);
                // for (const prompt of response.prompts) {
                //     console.log("\tloadAssetsForChatting.prompt ", prompt.prompt);
                // }
                this.dataSource = new MatTableDataSource(this.fullChat.prompts || []);
                this.isChatLoading = false;
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

    notPosting() {
        return this.isNotPosting;
    }

    postPrompt() {
        let prompt: string = this.chatForm.value.prompt;
        this.isNotPosting = false;
        this.chatService
            .postPrompt(this.chatId.toString(), prompt)
            .subscribe({
                next: prompt => {
                    // console.log("postPrompt(), response: ", JSON.stringify(prompt));
                    // console.log("getSourceCodeId(), sourceCodeId", this.sourceCodeId);
                    this.fullChat.prompts.push(prompt);
                    const myClonedArray = [];
                    this.fullChat.prompts.forEach(val => myClonedArray.push(val));
                    this.dataSource.data = myClonedArray;
                },
                complete: () => {
                    this.isNotPosting = true;
                    this.resetEvalStepForm()
                }
            });
    }

    back() {
    }

    updateChatInfo() {
        this.currentStates.add(this.states.wait);
        this.isFormActive = false;

        const subscribe: Subscription = this.chatService
            .updateChatInfoFormCommit(
                this.chatId.toString(),
                this.charInfoForm.value.name
            )
            .subscribe( {
                next: prompt => {
                    this.fullChat.chatName = this.charInfoForm.value.name;
                    //this.updateTree();
                },
                complete: () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            });
    }

    notToUpdateChatInfo() : boolean  {
        return this.charInfoForm.invalid;
    }

    cancelUpdatingChatInfo() {
        this.isFormActive = false;
    }

    startEditingChatDescription() {
        let name: string = this.fullChat ? this.fullChat.chatName : '#'+this.chatId;

        this.charInfoForm = new FormGroup({
            name: new FormControl(name, [Validators.required, Validators.minLength(5)]),
        });
        this.isFormActive = true;
    }

    toChat(chat: SimpleChat) {
        // console.log('switch to chat #', chat.chatId);
        this.router.navigate(['..', chat.chatId.toString()], {relativeTo: this.activatedRoute});
    }
}