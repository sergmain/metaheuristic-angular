import {FlatTreeControl} from '@angular/cdk/tree';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf, Subscription} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
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
        public mode: NodeMode
    ) {}
}

/**
 * @title Tree with flat nodes
 */
@Component({
    selector: 'scenario-details',
    templateUrl: 'scenario-details.component.html',
    styleUrls: ['scenario-details.component.css']
})
export class ScenarioDetailsComponent extends UIStateComponent implements OnInit, OnDestroy, AfterViewInit {
    treeControl: FlatTreeControl<StepFlatNode>;
    treeFlattener: MatTreeFlattener<SimpleScenarioStep, StepFlatNode>;
    dataSource: MatTreeFlatDataSource<SimpleScenarioStep, StepFlatNode>;
    // expansion model tracks expansion state
    expansionModel = new SelectionModel<string>(true);
    dragging = false;
    expandTimeout: any;
    expandDelay = 1000;
    validateDrop = false;
    processingFunction: InternalFunction;
    listOfApis: ApiUid[] = [];
    listOfFunctions: InternalFunction[] = [];
    response: ScenarioUidsForAccount;
    scenarioGroupId: string;
    scenarioId: string;
    needToExpandAll: boolean = true;

    // for fast hiding input form
    showMyContainer: boolean = true;
    isFormActive: boolean = false;

    allUuids: string[] = [];
    isApi: boolean = true;

    dataChange = new BehaviorSubject<SimpleScenarioStep[]>([]);
    dataTree :SimpleScenarioStep[]

    simpleScenarioSteps: SimpleScenarioSteps = null;

    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        prompt: new FormControl('', [Validators.required, Validators.minLength(5)]),
        resultCode: new FormControl('', [Validators.required, Validators.minLength(5)]),
        apiUid: new FormControl(null, [Validators.required]),
        expected: new FormControl(''),
    });

    scenarioForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        description: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    @ViewChild('formDirective') formDirective : FormGroupDirective;
    currentStates: Set<LoadStates> = new Set();
    readonly states = LoadStates;

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        this.scenarioGroupId = this.activatedRoute.snapshot.paramMap.get('scenarioGroupId');
        this.scenarioId = this.activatedRoute.snapshot.paramMap.get('scenarioId');
        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.loadAssetsForCreation();
        this.updateTree();
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
/*
        let b1 = MhUtils.isNull(this.apiUid) && MhUtils.isNull(this.processingFunction);
        let b2 = this.form.invalid;
        let b3 = !this.isApi && MhUtils.isNotNull(this.processingFunction) && this.processingFunction.code === 'mh.acceptance-test' && MhUtils.len(this.form.value.expected)===0;
        console.log("notToCreate() ", b1, b2, b3);
        return b1
            || b2
            || b3;
*/
        // return MhUtils.isNull(this.apiUid) && MhUtils.isNull(this.processingFunction)
        return MhUtils.isNull(this.form.value.apiUid) && MhUtils.isNull(this.processingFunction)
            || this.form.invalid
            || !this.isApi && MhUtils.isNotNull(this.processingFunction) && this.processingFunction.code === 'mh.acceptance-test' && MhUtils.len(this.form.value.expected) === 0;
    }

    isApiNeeded() {
        return this.isApi || MhUtils.isNotNull(this.processingFunction) && this.processingFunction.code === 'mh.acceptance-test';
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
            node.isNew, node.functionCode,
            MhUtils.isNull(node.mode) ? NodeMode.show : node.mode
        );
        this.allUuids.push(node.uuid);
        console.log("07.15 transformer(), stepFlatNode: ", stepFlatNode);
        return stepFlatNode;
    }

    private _getLevel = (node: StepFlatNode) => node.level;
    private _isExpandable = (node: StepFlatNode): boolean => node.expandable;
    private _getChildren = (node: SimpleScenarioStep): Observable<SimpleScenarioStep[]> => observableOf(node.steps);
    hasChild = (_: number, _nodeData: StepFlatNode) => _nodeData.expandable;
    hasNoContent = (_: number, _nodeData: StepFlatNode) => {
        console.log("hasNoContent()", JSON.stringify(_nodeData));
        return ScenarioDetailsComponent.anyMode(_nodeData.mode, [NodeMode.new, NodeMode.edit])
        // return _nodeData.uuid === '';
    };

    hasNewNodeAbsent = (_: number, _nodeData: StepFlatNode) => {
        // let b = !this.newNodePresent() && !this.isFormActive;
        let b = !this.hasNewNodePresent(_, _nodeData);
        //console.log("hasNewNodeAbsent()", b, _nodeData.nodeId);
        return b;
    };

    hasNewNodePresent = (_: number, _nodeData: StepFlatNode) => {
        let b = this.newNodePresent() || this.isFormActive;
        //console.log("hasNewNodePresent()", b, _nodeData.nodeId);
        return b;
    };

    isAcceptanceTestFunc() {
        let b= !this.isApi && MhUtils.isNotNull(this.processingFunction) && this.processingFunction.code==='mh.acceptance-test';
        //console.log("isAcceptanceTestFunc()", b, this.processingFunction);
        return b;
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
            prompt: new FormControl(detailNode.node.prompt, [Validators.required, Validators.minLength(5)]),
            resultCode: new FormControl(detailNode.node.resultCode, [Validators.required, Validators.minLength(5)]),
            apiUid: new FormControl(null, [Validators.required]),
            expected: new FormControl(detailNode.node.expected),
        });

        const apiUid = this.listOfApis.find((c) => c.uid == detailNode.node.apiCode);
        // const apiUid = new class implements ApiUid {
        //     id: number = detailNode.node.apiId;
        //     uid: string = detailNode.node.apiCode;
        // }
        this.form.get('apiUid').setValue(apiUid);

        if (MhUtils.isNull(detailNode.node.functionCode)) {
            this.isApi = true;
            // this.apiUid = new class implements ApiUid {
            // const toSelect = this.patientCategories.find(c => c.id == 3);
            // this.patientCategory.get('patientCategory').setValue(toSelect);

            this.processingFunction = null;
        }
        else {
            this.isApi = false;
            this.processingFunction = new class implements InternalFunction {
                code: string = detailNode.node.functionCode;
                translate: string = detailNode.node.functionCode;
            };
        }
        // console.log("50.20", this.isApi, this.apiUid, this.processingFunction);
        console.log("50.20", this.isApi, this.form.value.apiUid, this.processingFunction);

        this.dataChange.next(this.dataTree);
    }

    // Select the category so we can insert the new item.
    addNewStubItem(node: StepFlatNode) {
        this.showMyContainer = true;
        console.log("10.10", node);
        this.treeControl.expand(node);
        let detailNode = this.findInTree(node);
        console.log("10.11", detailNode)
        this.addNewNode(detailNode.node);
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

        let name = this.form.value.name;
        let prompt = this.form.value.prompt;
        let resultCode = this.form.value.resultCode;
        let functionCode = MhUtils.isNull(this.processingFunction) ? null : this.processingFunction.code;
        let expected = this.form.value.expected;
        let apiUid = this.isApiNeeded() ? this.form.value.apiUid.id.toString() : null;

        this.formDirective.resetForm();
        this.form.reset();

        const subscribe: Subscription = this.scenarioService
            .addOrSaveScenarioStepFormCommit(
                this.scenarioGroupId,
                this.scenarioId,
                uuid,
                parentUuid,
                name,
                prompt,
                apiUid,
                resultCode,
                functionCode,
                expected
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

    protected readonly MhUtils = MhUtils;

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

}