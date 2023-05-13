import {FlatTreeControl} from '@angular/cdk/tree';
import {AfterViewInit, Component, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf, Subscription} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MhUtils} from '@services/mh-utils/mh-utils.service';
import {ApiUid} from '@services/evaluation/ApiUid';
import {ScenarioUidsForAccount} from '@services/scenario/ScenarioUidsForAccount';
import {SettingsService, SettingsServiceEventChange} from '@services/settings/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@services/authentication';
import {UIStateComponent} from '@app/models/UIStateComponent';
import {TranslateService} from '@ngx-translate/core';
import {ScenarioService} from '@services/scenario/scenario.service';
import {LoadStates} from '@app/enums/LoadStates';
import {MatTableDataSource} from '@angular/material/table';
import {SimpleScenarioStep} from '@services/scenario/SimpleScenarioStep';
import {SimpleScenarioSteps} from '@services/scenario/SimpleScenarioSteps';

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

        public isNew: boolean
    ) {}
}

/*
export class DetailFlatNode {
    constructor(
        public expandable: boolean,
        public filename: string,
        public level: number,
        public type: any,
        public nodeId: string,
        public isNew: boolean
    ) {}
}
*/

@Injectable()
export class ScenarioDetailsService {



    initialize() {
/*
        // Parse the string to json object.
        const dataObject = JSON.parse(TREE_DATA);

        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        this.dataTree = this.buildFileTree(dataObject, 0);
*/

        // Notify the change.
        this.dataChange.next(this.dataTree);


    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
/*
    buildFileTree(obj: {[key: string]: any}, level: number, parentId: string = '0'): SimpleScenarioStep[] {
        return Object.keys(obj).reduce<SimpleScenarioStep[]>((accumulator, key, idx) => {
            const value = obj[key];
            const node = new SimpleScenarioStep();
            node.filename = key;
            node.nodeId = MhUtils.randomIntAsStr(1000, 9999);

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1, node.nodeId);
                } else {
                    node.type = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }
*/

    /** Add an item to to-do list */
    addNewNode(parent: SimpleScenarioStep) {
        if (MhUtils.isNull(parent.steps)) {
            parent.steps = []
        }
        parent.steps.push({uuid: '', nodeId: MhUtils.randomIntAsStr(1000, 999999), isNew: true } as SimpleScenarioStep);
        this.dataChange.next(this.data);
    }

    updateNode(node: SimpleScenarioStep, filename: string) {
        node.filename = filename;
        node.isNew = false;
        this.dataChange.next(this.data);
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
        this.dataChange.next(this.data);
    }

    newNodePresent() : boolean {
        if (MhUtils.isNull(this.dataTree)) {
            return false;
        }
        for (const dataNode of this.dataTree) {
            let b = this.findInBranch(dataNode)
            if (b) {
                return true;
            }
        }
        return false;
    }

    private findInBranch(datum: SimpleScenarioStep) : boolean {
        console.log("31.10", datum)
        if (MhUtils.isTrue(datum.isNew)) {
            return true;
        }
        if (MhUtils.isNotNull(datum.steps)) {
            for (const child of datum.steps) {
                console.log("10.02", child);
                let b = this.findInBranch(child)
                if (b) {
                    return true;
                }
            }
            return false;
        }
    }

}

/**
 * @title Tree with flat nodes
 */
@Component({
    selector: 'scenario-details',
    templateUrl: 'scenario-details.component.html',
    styleUrls: ['scenario-details.component.css'],
    providers: [ScenarioDetailsService]
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
    database: ScenarioDetailsService;
    apiUid: ApiUid;
    listOfApis: ApiUid[] = [];
    response: ScenarioUidsForAccount;
    scenarioGroupId: string;
    scenarioId: string;

    dataChange = new BehaviorSubject<SimpleScenarioStep[]>([]);
    dataTree :SimpleScenarioStep[]

    simpleScenarioSteps: SimpleScenarioSteps;

    form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(5)]),
        prompt: new FormControl('', [Validators.required, Validators.minLength(5)]),
        resultCode: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    @ViewChild('tree') tree;
    @ViewChild('formDirective') formDirective : FormGroupDirective;
    currentStates: Set<LoadStates> = new Set();
    readonly states = LoadStates;

    ngAfterViewInit() {
        console.log("15.01 ngAfterViewInit()");
        this.tree.treeControl.dataNodes.forEach(n => {
            console.log("15.02 expansionModel.select({})", n.nodeId);
            this.expansionModel.select(n.nodeId);
        });
        this.tree.treeControl.expandAll();
        this.refreshTree();
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
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    constructor(database: ScenarioDetailsService,
                private router: Router,
                private scenarioService: ScenarioService,
                private activatedRoute: ActivatedRoute,
                private translate: TranslateService,
                private settingsService: SettingsService,
                readonly authenticationService: AuthenticationService
                ) {
        super(authenticationService);

        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl<StepFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.database = database;

        this.dataChange.subscribe(data => this.rebuildTreeForData(data));
    }

    @ViewChild(MatButton) button: MatButton;

    notToCreate() {
        return this.apiUid==null || this.form.invalid;
    }

    // load assets for creating a new step of scenario
    loadAssetsForCreation(): void {
        this.setIsLoadingStart();
        this.scenarioService
            .scenarioStepAdd()
            .subscribe((response) => {
                this.response = response;
                this.listOfApis = this.response.apis;
                this.isLoading = false;
            });
    }

    createFirstDetail(): void {
        console.log("27.10", this.apiUid)
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.scenarioService
            .addScenarioStepFormCommit(
                this.scenarioGroupId,
                this.scenarioId,
                this.form.value.name,
                this.form.value.prompt,
                this.apiUid.id.toString(),
                this.form.value.resultCode
            )
            .subscribe(
                (response) =>
                {},
                () => {},
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
        this.formDirective.resetForm();
        this.form.reset();
    }

    dataSourceEmpty() {
        return this.dataTree.length===0;
    }

    transformer = (node: SimpleScenarioStep, level: number) => {
/*
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
    public isNew: boolean
*/
        return new StepFlatNode(node.nodeId, MhUtils.len(node.steps)>0, level, node.uuid,
            node.apiId, node.apiCode, node.name, node.prompt, node.r, node.resultCode, node.isNew);
    }
    private _getLevel = (node: StepFlatNode) => node.level;
    private _isExpandable = (node: StepFlatNode) => node.expandable;
    private _getChildren = (node: SimpleScenarioStep): Observable<SimpleScenarioStep[]> => observableOf(node.steps);
    hasChild = (_: number, _nodeData: StepFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: StepFlatNode) => {
        console.log("hasNoContent()", JSON.stringify(_nodeData));
        return _nodeData.uuid === '';
    };

    hasNewNodeAbsent = (_: number, _nodeData: StepFlatNode) => {
        let b = !this.database.newNodePresent();
        console.log("hasNewNodeAbsent()", b, _nodeData.nodeId);
        return b;
    };

    hasNewNodePresent = (_: number, _nodeData: StepFlatNode)=> {
        let b = this.database.newNodePresent();
        console.log("hasNewNodePresent()", b, _nodeData.nodeId);
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
            if (expanded.includes(node.nodeId)) {
                if (MhUtils.isNotNull(node.steps)) {
                    node.steps.map((child) => addExpandedChildren(child, expanded));
                }
            }
        }
        this.dataSource.data.forEach((node) => {
            addExpandedChildren(node, this.expansionModel.selected);
        });
        return result;
    }

    /**
     * Handle the drop - here we rearrange the data based on the drop event,
     * then rebuild the tree.
     * */
    drop(event: CdkDragDrop<string[]>) {
        // console.log('origin/destination', event.previousIndex, event.currentIndex);

        // ignore drops outside of the tree
        if (!event.isPointerOverContainer) return;

        // construct a list of visible nodes, this will match the DOM.
        // the cdkDragDrop event.currentIndex jives with visible nodes.
        // it calls rememberExpandedTreeNodes to persist expand state
        const visibleNodes = this.visibleNodes();

        // deep clone the data source so we can mutate it
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

        // recursive find function to find siblings of node
        function findNodeSiblings(arr: Array<any>, nodeId: string): Array<any> {
            let result, subResult;
            arr.forEach((item, i) => {
                if (item.nodeId === nodeId) {
                    result = arr;
                } else if (item.children) {
                    subResult = findNodeSiblings(item.children, nodeId);
                    if (subResult) result = subResult;
                }
            });
            return result;

        }

        // determine where to insert the node
        const nodeAtDest = visibleNodes[event.currentIndex];
        const newSiblings = findNodeSiblings(changedData, nodeAtDest.nodeId);
        if (!newSiblings) return;
        const insertIndex = newSiblings.findIndex(s => s.nodeId === nodeAtDest.nodeId);

        // remove the node from its old place
        const node = event.item.data;
        const siblings = findNodeSiblings(changedData, node.nodeId);
        const siblingIndex = siblings.findIndex(n => n.nodeId === node.nodeId);
        const nodeToInsert: SimpleScenarioStep = siblings.splice(siblingIndex, 1)[0];
        if (nodeAtDest.nodeId === nodeToInsert.nodeId) return;

        // ensure validity of drop - must be same level
        const nodeAtDestFlatNode = this.treeControl.dataNodes.find((n) => nodeAtDest.nodeId === n.nodeId);
        if (this.validateDrop && nodeAtDestFlatNode.level !== node.level) {
            alert('Items can only be moved within the same level.');
            return;
        }

        // insert node
        newSiblings.splice(insertIndex, 0, nodeToInsert);

        // rebuild tree with mutated data
        this.rebuildTreeForData(changedData);
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
        console.log("21.01 rebuildTreeForData()")
        this.dataSource.data = data;
        this.refreshTree();
    }

    refreshTree() {
        this.expansionModel.selected.forEach((id) => {
            const node = this.treeControl.dataNodes.find((n) => n.nodeId === id);
            this.treeControl.expand(node);
        });
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
        for (let i = 0; i < this.database.data.length; i++){
            const datum = this.database.data[i];
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
                console.log("10.02", child);
                let n = this.findInBranch(detailFlatNode, child, datum)
                if (MhUtils.isNotNull(n)) {
                    return n;
                }
            }
            return null;
        }
    }

    // Select the category so we can insert the new item.
    addNewStubItem(node: StepFlatNode) {
        console.log("10.10", node);
        this.treeControl.expand(node);
        let detailNode = this.findInTree(node);
        console.log("10.11", detailNode)
        this.database.addNewNode(detailNode.node);
        this.dataChange.next(this.data);
        this.refreshTree();
    }

    // Save the node to database
    saveNode(node: StepFlatNode) {
        let itemValue = this.form.value.name;
        let len = MhUtils.len(itemValue);
        console.log("MhUtils.len(itemValue.length)", itemValue, len);
        if (len<5) {
            return;
        }
        console.log("10.20", node);
        let detailNode = this.findInTree(node);
        console.log("10.21", detailNode)
        this.database.updateNode(detailNode.node, itemValue);
        this.ngAfterViewInit();
        this.formDirective.resetForm();
        this.form.reset();

    }

    deleteNewNode(node: StepFlatNode) {
        console.log("10.20", node);
        let detailNode = this.findInTree(node);
        console.log("10.21", detailNode)
        this.database.deleteNode(detailNode);
        this.ngAfterViewInit();
        this.formDirective.resetForm();
        this.form.reset();
    }

}