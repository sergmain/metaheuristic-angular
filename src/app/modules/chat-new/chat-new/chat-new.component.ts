import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormArray, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import {SettingsService, SettingsServiceEventChange} from '@services/settings/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@services/authentication';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {TranslateService} from '@ngx-translate/core';
import {LoadStates} from '@app/enums/LoadStates';
import {SimpleScenarioStep} from '@services/scenario/SimpleScenarioStep';
import {MatDialog} from '@angular/material/dialog';
import {StepEvaluation} from '@services/scenario/StepEvaluation';
import {StepVariable} from '@services/scenario/StepVariable';
import {ChatService} from '@app/modules/chat-new/chat-service';
import {FullChat} from '@app/modules/chat-new/chat-data';

const MIN_PROMPT_LEN: number = 3;

export class StepEvaluationState {
    // for step evaluating
    activeNode: StepFlatNode = null;
    prompt: string = null;
    result: string = null;
    rawResult: string = null;
    error: string = null;
    previousPrompt: string = null;
}

@Component({
    selector: 'chat-new',
    templateUrl: './chat-new.component.html',
    styleUrls: ['./chat-new.component.scss'],
})
export class ChatNewComponent extends UIStateComponent implements OnInit, OnDestroy {
    // for scenario-details.component.html
    protected readonly MhUtils = MhUtils;

    @ViewChild(MatButton) button: MatButton;
    @ViewChild('formDirective') formDirective : FormGroupDirective;

    response: FullChat;
    chatId: string;
    apiUid: string;

    dataChange = new BehaviorSubject<SimpleScenarioStep[]>([]);

    readonly stepEvaluationState: StepEvaluationState = new StepEvaluationState();

    evalStepForm = new FormGroup({
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
                this.response = response;
                this.setIsLoadingEnd();
            });
    }

    resetEvalStepForm() {
        this.evalStepForm.reset();
    }

    startStepEvaluation(node: StepFlatNode): void {
        this.resetEvalStepForm();
        this.scenarioService
            .prepareStepForEvaluation(this.scenarioId.toString(), node.uuid)
            .subscribe(o => {
                console.log("startStepEvaluation(), response: ", JSON.stringify(o));
                // console.log("getSourceCodeId(), sourceCodeId", this.sourceCodeId);
                this.preparedStep = o;
                if (MhUtils.isNull(o.errorMessagesAsStr)) {
                    this.isStepEvaluation = true;
                    this.stepEvaluationState.activeNode = node;

                    this.evalStepForm.patchValue({prompt:node.prompt});

                    const form = this.getVariables();
                    for (const input of o.inputs) {
                        const variableForm = new FormGroup({
                            name: new FormControl(input, [Validators.required, Validators.minLength(1)]),
                            value: new FormControl('', [Validators.required, Validators.minLength(1)])
                        });
                        form.push(variableForm);
                    }
                    console.log("startStepEvaluation(), form length: ", form.length);

                    this.dataChange.next(this.dataTree);
                }
            });

    }

    runStepEvaluation() {
        let se: StepEvaluation =  new StepEvaluation();
        se.uuid = this.stepEvaluationState.activeNode.uuid;
        se.prompt = this.evalStepForm.value.prompt;
        se.variables = [];

        let formArray: FormArray = this.getVariables();

        for (let i = 0; i < formArray.length; i++) {
            let sv = new StepVariable();
            sv.name = formArray.at(i).value.name;
            sv.value = formArray.at(i).value.value;
            se.variables.push(sv);
        }

        this.scenarioService
            .runStepEvaluation(this.scenarioId.toString(), se)
            .subscribe(o => {
                console.log("runStepEvaluation(), response: ", JSON.stringify(o));
                // console.log("getSourceCodeId(), sourceCodeId", this.sourceCodeId);

                this.stepEvaluationState.prompt = o.prompt;
                this.stepEvaluationState.result = o.result;
                this.stepEvaluationState.rawResult = o.rawrResult;
                this.stepEvaluationState.error = o.error;
                this.stepEvaluationState.previousPrompt = se.prompt;
            });
    }

    acceptStepEvaluation() {
        let node = this.stepEvaluationState.activeNode;
        let newPrompt = this.evalStepForm.value.prompt;

        console.log("10.20", node);
        let detailNode = this.findInTree(node);

        this.resetStepEvaluation();

        this.scenarioService
            .acceptNewPromptForStep(this.scenarioId.toString(), node.uuid, newPrompt)
            .subscribe({
                next: status => this.updateTree(),
                complete: () => this.setIsLoadingEnd()
            });
    }

    dontDoStepEvaluation(): boolean {
        return this.evalStepForm.invalid;
    }

    resetStepEvaluation(): void {
        this.stepEvaluationState.activeNode = null;
        this.stepEvaluationState.prompt = null;
        this.stepEvaluationState.result = null;
        this.stepEvaluationState.rawResult = null;
        this.stepEvaluationState.error = null;
        this.stepEvaluationState.previousPrompt = null;
    }

    bookmark() {
        //
    }

    postPrompt() {
        return false;
    }
}