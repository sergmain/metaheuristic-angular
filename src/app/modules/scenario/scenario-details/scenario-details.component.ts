import {FlatTreeControl} from '@angular/cdk/tree';
import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf, Subscription} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import {FormArray, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import {ScenarioUidsForAccount} from '@services/scenario/ScenarioUidsForAccount';
import {SettingsService, SettingsServiceEventChange} from '@services/settings/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@services/authentication';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {TranslateService} from '@ngx-translate/core';
import {ScenarioService} from '@services/scenario/scenario.service';
import {LoadStates} from '@app/enums/LoadStates';
import {SimpleScenarioStep} from '@services/scenario/SimpleScenarioStep';
import {SimpleScenarioSteps} from '@services/scenario/SimpleScenarioSteps';
import {ApiUid} from '@services/scenario/ApiUid';
import {InternalFunction} from '@services/scenario/InternalFunction';
import {ConfirmationDialogMethod} from '@app/components/app-dialog-confirmation/app-dialog-confirmation.component';
import {MatDialog} from '@angular/material/dialog';
import {StepEvaluationPrepareResult} from '@services/scenario/StepEvaluationPrepareResult';
import {StepEvaluation} from '@services/scenario/StepEvaluation';
import {StepVariable} from '@services/scenario/StepVariable';

const MH_ACCEPTANCE_TEST = 'mh.acceptance-test';
const MH_AGGREGATE = 'mh.aggregate';
const MH_ENHANCE_TEXT = 'mh.enhance-text';
const MIN_PROMPT_LEN: number = 3;


export enum NodeMode {
    new = 'new',
    edit = 'edit',
    show = 'show'
}

export class SimpleScenarioStepWithParent {
    constructor(node: SimpleScenarioStep, parent: SimpleScenarioStep) {
        this.node = node;
        this.parent = parent;
    }
    node: SimpleScenarioStep;
    parent: SimpleScenarioStep;
}

/** Flat node with expandable and level information */
export class StepFlatNode {
    constructor(
        public nodeId: string,
        public expandable: boolean,
        public level: number,

        public uuid: string,
        public apiId: number,
        public apiCode: string,
        public name: string,
        public prompt: string,
        public r: string,
        public resultCode: string,
        public expected: string,

        public isNew: boolean,
        public functionCode: string,
        public aggregateType: string,
        public isCachable: boolean,
        public mode: NodeMode
    ) {}
}

export class StepEvaluationState {
    // for step evaluating
    activeNode: StepFlatNode = null;
    prompt: string = null;
    result: string = null;
    rawResult: string = null;
    error: string = null;
    previousPrompt: string = null;
}

/**
 * @title Tree with flat nodes
 */
@Component({
    selector: 'scenario-details',
    templateUrl: 'scenario-details.component.html',
    styleUrls: ['scenario-details.component.scss']
})
export class ScenarioDetailsComponent extends UIStateComponent implements OnInit, OnDestroy, AfterViewInit {
    // for scenario-details.component.html
    protected readonly MhUtils = MhUtils;

    @ViewChild('execContexts') execContexts: TemplateRef<any>;

    treeControl: FlatTreeControl<StepFlatNode>;
    treeFlattener: MatTreeFlattener<SimpleScenarioStep, StepFlatNode>;
    dataSource: MatTreeFlatDataSource<SimpleScenarioStep, StepFlatNode>;
    // expansion model tracks expansion state
    expansionModel = new SelectionModel<string>(true);
    dragging = false;
    expandTimeout: any;
    expandDelay = 1000;
    validateDrop = false;

    listOfApis: ApiUid[] = [];
    listOfFunctions: InternalFunction[] = [];
    listOfAggregateTypes: string[] = [];

    response: ScenarioUidsForAccount;
    scenarioGroupId: string;
    scenarioId: string;
    sourceCodeId: string;
    needToExpandAll: boolean = true;

    // for fast hiding input form
    showMyContainer: boolean = true;
    isFormActive: boolean = false;
    isStepEvaluation: boolean = false;

    allUuids: string[] = [];
    isApi: boolean = true;

    dataChange = new BehaviorSubject<SimpleScenarioStep[]>([]);
    dataTree :SimpleScenarioStep[]

    simpleScenarioSteps: SimpleScenarioSteps = null;

    readonly stepEvaluationState: StepEvaluationState = new StepEvaluationState();

    preparedStep: StepEvaluationPrepareResult = null;

    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        prompt: new FormControl('', [Validators.required, Validators.minLength(MIN_PROMPT_LEN)]),
        resultCode: new FormControl('', [Validators.required, Validators.minLength(3)]),
        apiUid: new FormControl(null),
        aggregateType: new FormControl(null),
        processingFunction: new FormControl(null),
        expected: new FormControl(''),
        cachable: new FormControl(false)
    });

    scenarioForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        description: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    variableForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(1)]),
        value: new FormControl('', [Validators.required, Validators.minLength(1)])
    });

    evalStepForm = new FormGroup({
        prompt: new FormControl('', [Validators.required, Validators.minLength(MIN_PROMPT_LEN)]),
        variables: new FormArray([])
    });

    get variables() {
        return this.getVariables();
    }

    getVariables(): FormArray {
        //(this.invoiceForm.controls['other_Partners'] as FormArray).clear();
        let control = this.evalStepForm.controls["variables"] as FormArray;
        return control;
        // return this.evalStepForm.controls.variables["variables"] as FormArray;
        // return this.evalStepForm.get('variables') as FormArray
        // return this.evalStepForm.value.variables as FormArray
    }

    @ViewChild('formDirective') formDirective : FormGroupDirective;
    currentStates: Set<LoadStates> = new Set();
    readonly states = LoadStates;

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        console.log("ngOnInit() start");
        this.scenarioGroupId = this.activatedRoute.snapshot.paramMap.get('scenarioGroupId');
        this.scenarioId = this.activatedRoute.snapshot.paramMap.get('scenarioId');
        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.loadAssetsForCreation();
        this.updateTree();
        this.getSourceCodeId();
        console.log("ngOnInit() end");
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    constructor(
                private router: Router,
                private scenarioService: ScenarioService,
                private activatedRoute: ActivatedRoute,
                private translate: TranslateService,
                private settingsService: SettingsService,
                private dialog: MatDialog,
                readonly authenticationService: AuthenticationService
                ) {
        super(authenticationService);

        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl<StepFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        this.dataChange.subscribe(data => this.rebuildTreeForData(data));
    }

    @ViewChild(MatButton) button: MatButton;

    notToCreate() {
        let b1 = MhUtils.isNull(this.form.value.apiUid) && MhUtils.isNull(this.form.value.processingFunction)
        let b2 = this.form.invalid;
        let b3 = !this.isApi && this.isMhAcceptanceTest() && (MhUtils.len(this.form.value.expected) === 0 || MhUtils.isNull(this.form.value.apiUid));
        console.log("notToCreate() ", b1, b2, b3);
        return b1
            || b2
            || b3;
        // return MhUtils.isNull(this.form.value.apiUid) && MhUtils.isNull(this.form.value.processingFunction)
        //     || this.form.invalid
        //     || !this.isApi && this.isMhAcceptanceTest() && (MhUtils.len(this.form.value.expected) === 0 || MhUtils.isNull(this.form.value.apiUid));
    }

    isApiNeeded() {
        return this.isApi || this.isMhAcceptanceTest();
    }

    // load assets for creating a new step of scenario
    loadAssetsForCreation(): void {
        this.setIsLoadingStart();
        this.scenarioService
            .scenarioStepAdd()
            .subscribe((response) => {
                this.response = response;
                this.listOfApis = this.response.apis;
                this.listOfFunctions = this.response.functions;
                this.listOfAggregateTypes = this.response.aggregateTypes;
                this.isLoading = false;
            });
    }

    dataSourceEmpty() {
        return MhUtils.len(this.dataTree)===0;
    }

    transformer = (node: SimpleScenarioStep, level: number) => {
        let numberOfSubSteps = MhUtils.len(node.steps);
        //console.log("07.10 transformer(), numberOfSubSteps: ", numberOfSubSteps);
        let nodeId = MhUtils.randomIntAsStr(1000, 999999);
        node.nodeId = nodeId;
        let stepFlatNode = new StepFlatNode(nodeId, numberOfSubSteps>0, level, node.uuid,
            node.apiId, node.apiCode, node.name, node.prompt, node.r, node.resultCode, node.expected,
            node.isNew, node.functionCode, node.aggregateType, node.isCachable,
            MhUtils.isNull(node.mode) ? NodeMode.show : node.mode
        );
        this.allUuids.push(node.uuid);
        //console.log("07.15 transformer(), stepFlatNode: ", stepFlatNode);
        return stepFlatNode;
    }

    private _getLevel = (node: StepFlatNode) => node.level;
    private _isExpandable = (node: StepFlatNode): boolean => node.expandable;
    private _getChildren = (node: SimpleScenarioStep): Observable<SimpleScenarioStep[]> => observableOf(node.steps);
    hasChild = (_: number, _nodeData: StepFlatNode) => _nodeData.expandable;
    hasNoContent = (_: number, _nodeData: StepFlatNode) => {
        console.log("hasNoContent()", JSON.stringify(_nodeData));
        return ScenarioDetailsComponent.anyMode(_nodeData.mode, [NodeMode.new, NodeMode.edit])
    };

    hasNewNodeAbsentAndNotEvaluation = (_: number, _nodeData: StepFlatNode) => {
        let b = !this.hasNewNodePresent(_, _nodeData);
        //console.log("hasNewNodeAbsent()", b, _nodeData.nodeId);
        return b;
    };

    hasNewNodePresent = (_: number, _nodeData: StepFlatNode) => {
        let b = this.newNodePresent() || this.isFormActive;
        //console.log("hasNewNodePresent()", b, _nodeData.nodeId);
        return b;
    };

    canBeEvaluated(node: StepFlatNode) {
        let b = MhUtils.isNull(node.functionCode)
            || MhUtils.anyStr(node.functionCode, ['mh.acceptance-test', 'mh.enhance-text']);
        return b;
    }

    isMhAggregate() {
        let b = MhUtils.isNotNull(this.form.value.processingFunction) && this.form.value.processingFunction.code===MH_AGGREGATE;
        return b;
    }

    isMhAggregateFunc() {
        let b= !this.isApi && this.isMhAggregate();
        // console.log("isMhAggregateFunc()", b, this.isApi, this.isMhAggregate());
        return b;
    }

    isAcceptanceTestFunc() {
        let b= !this.isApi && this.isMhAcceptanceTest();
        //console.log("isAcceptanceTestFunc()", b, this.processingFunction);
        return b;
    }

    isMhAcceptanceTest() {
        return MhUtils.isNotNull(this.form.value.processingFunction) && this.form.value.processingFunction.code===MH_ACCEPTANCE_TEST;
    }

    isMhAcceptanceTestNode(flatNode: StepFlatNode) {
        return MhUtils.isNotNull(flatNode.functionCode) && flatNode.functionCode===MH_ACCEPTANCE_TEST;
    }

    modeEditOrNewNode = (_: number, _nodeData: StepFlatNode) => {
        //console.log("hasNoContent()", JSON.stringify(_nodeData));
        return ScenarioDetailsComponent.anyMode(_nodeData.mode, [NodeMode.new, NodeMode.edit])
        //return _nodeData.uuid === '';
    };

    modeEditNode = (node: StepFlatNode) => {
        let b = ScenarioDetailsComponent.anyMode(node.mode, [NodeMode.edit]);
        //console.log("modeEditNode()", JSON.stringify(node), b);
        return b
    };

    modeNewNode = (node: StepFlatNode) => {
        let b = ScenarioDetailsComponent.anyMode(node.mode, [NodeMode.new]);
        //console.log("modeNewNode()", JSON.stringify(node), b);
        return b
    };

    modeShowAllNode = (_: number, _nodeData: StepFlatNode) => {
        let b = !this.nodeWithModePresent([NodeMode.new, NodeMode.edit]);
        //console.log("hasNewNodeAbsent()", b, _nodeData.nodeId);
        return b;
    };

    modeEditSomeNode = (_: number, _nodeData: StepFlatNode) => {
        let b = this.nodeWithModePresent([NodeMode.edit]);
        //console.log("hasNewNodeAbsent()", b, _nodeData.nodeId);
        return b;
    };

    modeNewSomeNode = (_: number, _nodeData: StepFlatNode)=> {
        let b = this.nodeWithModePresent([NodeMode.new]);
        //console.log("hasNewNodePresent()", b, _nodeData.nodeId);
        return b;
    };


    // DRAG AND DROP METHODS

    shouldValidate(event: MatCheckboxChange): void {
        this.validateDrop = event.checked;
    }

    /**
     * This constructs an array of nodes that matches the DOM
     */
    visibleNodes(): SimpleScenarioStep[] {
        const result = [];

        function addExpandedChildren(node: SimpleScenarioStep, expanded: string[]) {
            result.push(node);
            if (expanded.includes(node.uuid)) {
                if (MhUtils.isNotNull(node.steps)) {
                    node.steps.map((child) => addExpandedChildren(child, expanded));
                }
            }
        }
        this.dataSource.data.forEach((node) => {
            addExpandedChildren(node, this.expansionModel.selected);
        });

        // this.treeControl.dataNodes.forEach(n=>{
        //     console.log("35.45 refreshTree(), expanded: ", n.uuid, this.treeControl.isExpanded(n));
        // });


        return result;
    }

    /**
     * Handle the drop - here we rearrange the data based on the drop event,
     * then rebuild the tree.
     * */
    drop(event: CdkDragDrop<String>) {
        console.log('37.10 origin/destination', event.previousIndex, event.currentIndex);

        // ignore drops outside of the tree or the same position
        if (event.previousIndex===event.currentIndex || !event.isPointerOverContainer) {
            return;
        }

        console.log('37.20 drop()');

        // determine where to insert the node
        let currVisibleNodes = this.visibleNodes();
        console.log('37.23 drop(), currVisibleNodes: ', currVisibleNodes);
        const currNode = currVisibleNodes[event.currentIndex];
        const prevNode = currVisibleNodes[event.previousIndex];

        console.log('37.25 drop(), prev -->, curr: ', prevNode.uuid, currNode.uuid);
        console.log('37.25 drop(), prev -->, curr: ', prevNode, currNode);

        // ensure validity of drop - must be same level
        console.log('37.50 drop()');

        this.scenarioService
            .scenarioStepRearrangeTable(this.scenarioId.toString(), prevNode.uuid, currNode.uuid)
            .subscribe({
                next: simpleScenarioSteps => this.updateTree(),
                complete: () => this.setIsLoadingEnd()
            });
    }

    updateTree(): void {
        this.setIsLoadingStart();
        this.scenarioService
            .scenarioSteps(this.scenarioGroupId, this.scenarioId)
            .subscribe({
                next: simpleScenarioSteps => {
                    this.simpleScenarioSteps = simpleScenarioSteps;
                    this.dataTree = simpleScenarioSteps.steps;
                    // console.log('ScenarioStepsComponent.simpleScenarioSteps: ' + JSON.stringify(this.simpleScenarioSteps));
                    this.dataChange.next(this.dataTree);
                    // console.log('ScenarioStepsComponent.simpleScenarioSteps: #3');
                },
                complete: () => {
                    this.setIsLoadingEnd();
                }
            });
    }

    /**
     * Experimental - opening tree nodes as you drag over them
     */
    dragStart() {
        this.dragging = true;
    }
    dragEnd() {
        this.dragging = false;
    }
    dragHover(node: StepFlatNode) {
        if (this.dragging) {
            clearTimeout(this.expandTimeout);
            this.expandTimeout = setTimeout(() => {
                this.treeControl.expand(node);
            }, this.expandDelay);
        }
    }
    dragHoverEnd() {
        if (this.dragging) {
            clearTimeout(this.expandTimeout);
        }
    }

    /**
     * The following methods are for persisting the tree expand state
     * after being rebuilt
     */
    rebuildTreeForData(data: any) {
        //console.log("21.01 rebuildTreeForData()")
        this.dataSource.data = data;
        this.refreshTree();
    }

    refreshTree() {
        if (this.needToExpandAll && MhUtils.isNotNull(this.simpleScenarioSteps)) {
            this.needToExpandAll = false;
            this.treeControl.expandAll();
            this.allUuids.forEach(uuid=>this.expansionModel.select(uuid));
        }
        else {
            this.treeControl.collapseAll();
        }
        // console.log("35.10 refreshTree(), expansionModel.selected: ", this.expansionModel.selected)

        this.expansionModel.selected.forEach((id) => {
            const node = this.treeControl.dataNodes.find((n) => {
                // console.log("35.25 n.nodeId: {}, id: {}", n.uuid, id)
                return n.uuid === id;
            });
            // console.log("35.35 refreshTree(), node: ", node)
            if (MhUtils.isNotNull(node)) {
                this.treeControl.expand(node);
            }
        });
        // this.treeControl.dataNodes.forEach(n=>{
        //     console.log("35.45 refreshTree(), expanded: ", n.uuid, this.treeControl.isExpanded(n));
        // });
    }

    // Not used but you might need this to programmatically expand nodes
    // to reveal a particular node
    private expandNodesById(flatNodes: StepFlatNode[], ids: string[]) {
        if (MhUtils.isNull(flatNodes) || flatNodes.length === 0) return;
        const idSet = new Set(ids);
        return flatNodes.forEach((node) => {
            if (idSet.has(node.nodeId)) {
                this.treeControl.expand(node);
                let parent = this.getParentNode(node);
                while (parent) {
                    this.treeControl.expand(parent);
                    parent = this.getParentNode(parent);
                }
            }
        });
    }

    private getParentNode(node: StepFlatNode): StepFlatNode | null {
        const currentLevel = node.level;
        if (currentLevel < 1) {
            return null;
        }
        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];
            if (currentNode.level < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    findInTree(detailFlatNode : StepFlatNode ) : SimpleScenarioStepWithParent | null {
        return this.findInTreeWithParent(detailFlatNode, null);
    }

    findInTreeWithParent(detailFlatNode : StepFlatNode, parent: SimpleScenarioStep) : SimpleScenarioStepWithParent | null {
        if (MhUtils.isNull(detailFlatNode)) {
            return null;
        }
        for (let i = 0; i < this.dataTree.length; i++){
            const datum = this.dataTree[i];
            console.log("10.01", datum);
            let n = this.findInBranch(detailFlatNode, datum, parent);
            if (MhUtils.isNotNull(n)) {
                return n;
            }
        }
        return null;
    }

    private findInBranch(detailFlatNode: StepFlatNode, datum: SimpleScenarioStep, parent: SimpleScenarioStep) : SimpleScenarioStepWithParent | null {
        if (datum.nodeId===detailFlatNode.nodeId) {
            return new SimpleScenarioStepWithParent(datum, parent);
        }
        if (MhUtils.isNotNull(datum.steps)) {
            for (const child of datum.steps) {
                // console.log("10.02", child);
                let n = this.findInBranch(detailFlatNode, child, datum)
                if (MhUtils.isNotNull(n)) {
                    return n;
                }
            }
            return null;
        }
    }

    updateScenarioInfo() {
        this.currentStates.add(this.states.wait);

        this.isFormActive = false;

        const subscribe: Subscription = this.scenarioService
            .updateScenarioInfoFormCommit(
                this.scenarioGroupId,
                this.scenarioId,
                this.scenarioForm.value.name,
                this.scenarioForm.value.description
            )
            .subscribe(
                (response) => {
                    this.updateTree();
                },
                () => {
                },
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
    }

    notToUpdateScenarioInfo() : boolean  {
        return this.scenarioForm.invalid;
    }

    cancelUpdatingScenarioInfo() {
        this.isFormActive = false;
        this.dataChange.next(this.dataTree);
    }

    startEditingScenarioInfo() {
        this.scenarioForm = new FormGroup({
            name: new FormControl(this.simpleScenarioSteps.scenarioInfo.name, [Validators.required, Validators.minLength(5)]),
            description: new FormControl(this.simpleScenarioSteps.scenarioInfo.description, [Validators.required, Validators.minLength(5)]),
        });
        this.isFormActive = true;
        this.dataChange.next(this.dataTree);
    }

    startEditingNode(node: StepFlatNode) {
        this.showMyContainer = true;
        let detailNode = this.findInTree(node);
        console.log("50.10", JSON.stringify(detailNode));
        detailNode.node.isNew = true;
        detailNode.node.mode = NodeMode.edit;

        this.form = new FormGroup({
            name: new FormControl(detailNode.node.name, [Validators.required, Validators.minLength(5)]),
            prompt: new FormControl(detailNode.node.prompt, [Validators.required, Validators.minLength(3)]),
            resultCode: new FormControl(detailNode.node.resultCode, [Validators.required, Validators.minLength(3)]),
            apiUid: new FormControl(null),
            aggregateType: new FormControl(null),
            processingFunction: new FormControl(null),
            expected: new FormControl(detailNode.node.expected),
            cachable: new FormControl(detailNode.node.isCachable)
        });

        // noinspection UnnecessaryLocalVariableJS
        const apiUid = this.listOfApis.find((c) => c.uid == detailNode.node.apiCode);
        // const apiUid = new class implements ApiUid {
        //     id: number = detailNode.node.apiId;
        //     uid: string = detailNode.node.apiCode;
        // }
        this.form.get('apiUid').setValue(apiUid);

        if (MhUtils.isNull(detailNode.node.functionCode)) {
            this.isApi = true;
        }
        else {
            this.isApi = false;
            // this.processingFunction = new class implements InternalFunction {
            //     code: string = detailNode.node.functionCode;
            //     translate: string = detailNode.node.functionCode;
            // };
            // noinspection UnnecessaryLocalVariableJS
            const processingFunction = this.listOfFunctions.find((c) => c.code == detailNode.node.functionCode);
            // const apiUid = new class implements ApiUid {
            //     id: number = detailNode.node.apiId;
            //     uid: string = detailNode.node.apiCode;
            // }
            // this.form.value.processingFunction = processingFunction;
            this.form.get('processingFunction').setValue(processingFunction);

            this.form.get('aggregateType').setValue(detailNode.node.aggregateType);

        }
        console.log("50.20", this.isApi, this.form.value.apiUid, this.form.value.processingFunction, this.form.value.aggregateType);

        this.dataChange.next(this.dataTree);
    }

    addNewStubItem(node: StepFlatNode) {
        this.showMyContainer = true;
        console.log("10.10", node);
        this.treeControl.expand(node);
        let detailNode = this.findInTree(node);
        console.log("10.11", detailNode)
        this.addNewNode(detailNode.node);
        this.dataChange.next(this.dataTree);
    }

    stepEvaluation() :boolean {
        return this.isStepEvaluation;
    }

    trackByFn(index: any, item: any) {
        return index;
    }

    getNameOfField(i: number): string {
        let formArray: FormArray = this.getVariables();

        if (MhUtils.isNotNull(formArray) && formArray.length>i) {
            return formArray.at(i).value.name;
        }
        return '[not found]';
    }

    resetEvalStepForm() {
        let formArray: FormArray = this.getVariables();

        if (MhUtils.isNotNull(formArray) && formArray.length>0) {
            formArray.clear();
        }
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
        return this.evalStepForm.invalid || this.getVariables().invalid;
    }

    dontAcceptStepEvaluation(): boolean {
        return this.evalStepForm.value.prompt===this.stepEvaluationState.activeNode.prompt
            || (this.evalStepForm.value.prompt!==this.stepEvaluationState.previousPrompt && MhUtils.isNotNull(this.stepEvaluationState.result))
            || MhUtils.isNull(this.stepEvaluationState.result)
            ;
/*
        let b1 = this.evalStepForm.value.prompt===this.activeNode.prompt;
        let b2 = (this.evalStepForm.value.prompt!==this.previousPrompt && MhUtils.isNotNull(this.resultOfEvaluatingStep));
        let b3 = MhUtils.isNull(this.resultOfEvaluatingStep);
        console.log("dontAcceptStepEvaluation()", b1, b2, b3);
        return b1
            || b2
            || b3
            ;
*/
    }

    resetStepEvaluation(): void {
        this.isStepEvaluation = false;
        this.stepEvaluationState.activeNode = null;
        this.stepEvaluationState.prompt = null;
        this.stepEvaluationState.result = null;
        this.stepEvaluationState.rawResult = null;
        this.stepEvaluationState.error = null;
        this.stepEvaluationState.previousPrompt = null;
    }

    cancelStepEvaluation(): void {
        this.resetStepEvaluation();
        this.dataChange.next(this.dataTree);
    }

    createFirstDetail(): void {
        // console.log("27.10", this.apiUid)
        console.log("27.10", this.form.value.apiUid)
        this.saveStepInternal(null, null);
    }

    // Save the node to database
    saveNode(node: StepFlatNode){
        let itemValue = this.form.value.name;
        let len = MhUtils.len(itemValue);
        console.log("MhUtils.len(itemValue.length)", itemValue, len);
        if (len<5) {
            return;
        }
        console.log("10.20", node);
        let detailNode = this.findInTree(node);
        console.log("10.21", detailNode)
        console.log("10.22", this.form.value.apiUid)
        this.saveStepInternal(
            MhUtils.isNull(node.uuid) ? null : node.uuid,
            MhUtils.isNull(detailNode.parent) ? null : detailNode.parent.uuid
        );
    }

    private saveStepInternal(uuid:string, parentUuid: string) {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);

        // console.log("saveStepInternal() #1");
        let name = this.form.value.name;
        let prompt = this.form.value.prompt;
        let resultCode = this.form.value.resultCode;
        let functionCode = MhUtils.isNull(this.form.value.processingFunction) ? null : this.form.value.processingFunction.code;
        let aggregateType = MhUtils.isNull(this.form.value.aggregateType) ? null : this.form.value.aggregateType;
        let expected = this.form.value.expected;
        let apiId = this.isApiNeeded() ? this.form.value.apiUid.id.toString() : null;
        let isCachable=  MhUtils.isNull(this.form.value.cachable) ? false : this.form.value.cachable;

        // console.log("saveStepInternal() #2");
        this.formDirective.resetForm();
        // console.log("saveStepInternal() #3");
        this.form.reset();

        // console.log("saveStepInternal(), : ", JSON.stringify(this.form.value));
        // console.log("saveStepInternal() #4", isCachable);

        const subscribe: Subscription = this.scenarioService
            .addOrSaveScenarioStepFormCommit(
                this.scenarioGroupId,
                this.scenarioId,
                uuid,
                parentUuid,
                name,
                prompt,
                apiId,
                resultCode,
                functionCode,
                aggregateType,
                isCachable.toString(),
                expected
            )
            .subscribe(
                (response) => {
                    // console.log("saveStepInternal() #4.1");
                    this.updateTree();
                },
                () => {
                },
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
        // console.log("saveStepInternal() #5");
    }

    isActiveNode(node: StepFlatNode) {
        let b = MhUtils.isNotNull(this.stepEvaluationState.activeNode) && node.uuid===this.stepEvaluationState.activeNode.uuid;
        //console.log("60.21 ", b)
        return b;
    }

    @ConfirmationDialogMethod({
        question: (flatNode: StepFlatNode): string =>
            `Do you want to delete Step #${flatNode.name}`,

        resolveTitle: 'Delete',
        rejectTitle: 'Cancel'
    })
    delete(flatNode: StepFlatNode): void {
        this.scenarioService
            .scenarioStepDeleteCommit(this.scenarioId.toString(), flatNode.uuid)
            .subscribe(v => this.updateTree());
    }

    deleteNewNode(node: StepFlatNode) {
        console.log("10.20", node);
        let detailNode = this.findInTree(node);
        console.log("10.21", detailNode)
        this.deleteNode(detailNode);
        this.formDirective.resetForm();
        this.form.reset();
    }

    deleteNode(node: SimpleScenarioStepWithParent) {
        let nodes: SimpleScenarioStep[];
        if (MhUtils.isNull(node.parent)) {
            nodes = this.dataTree;
        }
        else {
            nodes = node.parent.steps;
        }
        for (let i = 0; i < nodes.length; i++) {
            let n = nodes[i];
            if (n.nodeId===node.node.nodeId) {
                nodes.splice(i, 1);
            }
        }
        this.dataChange.next(this.dataTree);
    }

    addNewNode(parent: SimpleScenarioStep) {
        if (MhUtils.isNull(parent.steps)) {
            parent.steps = []
        }
        parent.steps.push({uuid: '', nodeId: MhUtils.randomIntAsStr(1000, 999999), isNew: true, mode: NodeMode.new } as SimpleScenarioStep);
        this.dataChange.next(this.dataTree);
    }

    updateNode(node: SimpleScenarioStep, filename: string) {
        node.name = filename;
        node.isNew = false;
        node.mode = NodeMode.show;

        this.dataChange.next(this.dataTree);
    }

    newNodePresent() : boolean {
        if (MhUtils.isNull(this.dataTree)) {
            return false;
        }
        for (const dataNode of this.dataTree) {
            let b = this.findNewStubNodeInBranch(dataNode)
            if (b) {
                return true;
            }
        }
        return false;
    }

    private findNewStubNodeInBranch(datum: SimpleScenarioStep) : boolean {
        // console.log("31.10", datum)
        if (MhUtils.isTrue(datum.isNew)) {
            return true;
        }
        if (MhUtils.isNotNull(datum.steps)) {
            for (const child of datum.steps) {
                // console.log("40.02", child);
                let b = this.findNewStubNodeInBranch(child)
                if (b) {
                    return true;
                }
            }
            return false;
        }
    }

    nodeWithModePresent(modes: NodeMode[]): boolean {
        if (MhUtils.isNull(this.dataTree)) {
            return false;
        }
        for (const dataNode of this.dataTree) {
            let b = this.findNodeWithModeInBranch(dataNode, modes)
            if (b) {
                return true;
            }
        }
        return false;
    }

    private findNodeWithModeInBranch(datum: SimpleScenarioStep, modes: NodeMode[]) : boolean {
        // console.log("31.10", datum)
        if (ScenarioDetailsComponent.anyMode(datum.mode, modes)) {
            return true;
        }
        if (MhUtils.isNotNull(datum.steps)) {
            for (const child of datum.steps) {
                // console.log("40.02", child);
                let b = this.findNodeWithModeInBranch(child, modes)
                if (b) {
                    return true;
                }
            }
            return false;
        }
    }

    public static anyMode(m: NodeMode, modes: NodeMode[]): boolean {
        if (MhUtils.isNull(m)) {
            return false;
        }
        for (const nodeMode of modes) {
            if (nodeMode === m) {
                return true;
            }
        }
        return false;
    }

    setModeToShow(node) {
        node.mode = NodeMode.show;
        node.isNew = false;
        console.log("40.20", node);
        let detailNode = this.findInTree(node);
        detailNode.node.mode = NodeMode.show;
        detailNode.node.isNew = false;
        this.formDirective.resetForm();
        this.form.reset();
        this.dataChange.next(this.dataTree);
    }

    @ConfirmationDialogMethod({
        question: (): string => `Do you want to exec Scenario`,
        resolveTitle: 'Run scenario',
        rejectTitle: 'Cancel',
        theme: 'primary'
    })
    runScenario(): void {
        this.scenarioService
            .runScenario(this.scenarioGroupId.toString(), this.scenarioId.toString())
            .subscribe(v => {
                this.getSourceCodeId();
            });
    }

    getSourceCodeId() {
        this.scenarioService
            .querySourceCodeId(this.scenarioGroupId.toString(), this.scenarioId.toString())
            .subscribe(o => {
                // console.log("getSourceCodeId(), response: ", JSON.stringify(o));
                this.sourceCodeId = MhUtils.isNotNull(o) && MhUtils.isNotNull(o.simpleSourceCode)
                    ? o.simpleSourceCode.id.toString()
                    : null;
                // console.log("getSourceCodeId(), sourceCodeId", this.sourceCodeId);
            });
    }

    stateOfTasks() {
        this.dialog.open(this.execContexts, {
            width: '100%'
        });
    }

    isSourceCodeId() {
        return MhUtils.isNotNull(this.sourceCodeId);
    }

    isEnhanceText(node: StepFlatNode): boolean {
        return node.functionCode===MH_ENHANCE_TEXT;
    }
}