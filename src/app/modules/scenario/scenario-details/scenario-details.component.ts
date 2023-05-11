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
import {OperationStatus} from '@app/enums/OperationStatus';
import {ScenarioService} from '@services/scenario/scenario.service';
import {LoadStates} from '@app/enums/LoadStates';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class DetailNode {
    nodeId: string;
    children: DetailNode[];
    filename: string;
    type: any;
    isNew: boolean;
}

export class DetailNodeWithParent {
    constructor(node: DetailNode, parent: DetailNode) {
        this.node = node;
        this.parent = parent;
    }
    node: DetailNode;
    parent: DetailNode;
}

/** Flat node with expandable and level information */
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

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
const TREE_DATA = JSON.stringify({

});
/*
Applications: {
    Webstorm: 'app'
}
*/
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class ScenarioDetailsService {
    dataChange = new BehaviorSubject<DetailNode[]>([]);

    static randomIntAsStr(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min).toString()
    }

    // get data(): DetailNode[] { return this.dataChange.value; }
    get data(): DetailNode[] { return this.dataTree; }

    dataTree :DetailNode[]

    constructor() {
        this.initialize();
    }

    initialize() {
        // Parse the string to json object.
        const dataObject = JSON.parse(TREE_DATA);

        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        this.dataTree = this.buildFileTree(dataObject, 0);

        // Notify the change.
        this.dataChange.next(this.dataTree);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(obj: {[key: string]: any}, level: number, parentId: string = '0'): DetailNode[] {
        return Object.keys(obj).reduce<DetailNode[]>((accumulator, key, idx) => {
            const value = obj[key];
            const node = new DetailNode();
            node.filename = key;
            /**
             * Make sure your node has an id so we can properly rearrange the tree during drag'n'drop.
             * By passing parentId to buildFileTree, it constructs a path of indexes which make
             * it possible find the exact sub-array that the node was grabbed from when dropped.
             */
            // node.id = `${parentId}/${idx}`;
            node.nodeId = ScenarioDetailsService.randomIntAsStr(1000, 9999);

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

    /** Add an item to to-do list */
    addNewNode(parent: DetailNode) {
        if (parent.children===null || parent.children===undefined) {
            parent.children = []
        }
        parent.children.push({filename: '', nodeId: ScenarioDetailsService.randomIntAsStr(1000, 9999), isNew: true } as DetailNode);
        this.dataChange.next(this.data);
    }

    updateNode(node: DetailNode, filename: string) {
        node.filename = filename;
        node.isNew = false;
        this.dataChange.next(this.data);
    }

    deleteNode(node: DetailNodeWithParent) {
        let nodes: DetailNode[];
        if (MhUtils.isNull(node.parent)) {
            nodes = this.dataTree;
        }
        else {
            nodes = node.parent.children;
        }
        for (let i = 0; i < nodes.length; i++) {
            let n = nodes[i];
            if (n.nodeId===node.node.nodeId) {
                nodes.splice(i, 1);
            }
        }
        this.dataChange.next(this.data);
    }

    createFirstDetail(name: string): void {
        let newVar = {filename: name, nodeId: ScenarioDetailsService.randomIntAsStr(1000, 9999) } as DetailNode;
        newVar.children = [];
        this.dataTree.push(newVar);
        this.dataChange.next(this.dataTree);
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

    private findInBranch(datum: DetailNode) : boolean {
        console.log("31.10", datum)
        if (MhUtils.isTrue(datum.isNew)) {
            return true;
        }
        if (MhUtils.isNotNull(datum.children)) {
            for (const child of datum.children) {
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
    treeControl: FlatTreeControl<DetailFlatNode>;
    treeFlattener: MatTreeFlattener<DetailNode, DetailFlatNode>;
    dataSource: MatTreeFlatDataSource<DetailNode, DetailFlatNode>;
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

        this.updateResponse();
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
        this.treeControl = new FlatTreeControl<DetailFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.database = database;

        database.dataChange.subscribe(data => this.rebuildTreeForData(data));
    }

    @ViewChild(MatButton) button: MatButton;

    notToCreate() {
        return this.apiUid==null || this.form.invalid;
    }

    updateResponse(): void {
        this.scenarioService
            .scenarioStepAdd()
            .subscribe((response) => {
                this.response = response;
                this.listOfApis = this.response.apis;
                this.isLoading = false;
            });
    }

    create(): void {
        this.button.disabled = true;
        this.currentStates.add(this.states.wait);
        const subscribe: Subscription = this.scenarioService
            .addScenarioStepFormCommit(
                this.scenarioGroupId,
                this.scenarioId,
                this.form.value.name,
                this.form.value.prompt,
                this.apiUid.id.toString()
            )
            .subscribe(
                (response) => {
                    if (response.status === OperationStatus.OK) {
                        this.router.navigate(['../steps'], { relativeTo: this.activatedRoute });
                    }
                },
                () => {},
                () => {
                    this.currentStates.delete(this.states.wait);
                    subscribe.unsubscribe();
                }
            );
    }

    createFirstDetail(): void {
        this.button.disabled = true;
        this.database.createFirstDetail(this.form.value.name);
        this.formDirective.resetForm();
        this.form.reset();
    }

    dataSourceEmpty() {
        return this.database.dataTree.length===0;
    }

    transformer = (node: DetailNode, level: number) => {
        return new DetailFlatNode(!!node.children, node.filename, level, node.type, node.nodeId, node.isNew);
    }
    private _getLevel = (node: DetailFlatNode) => node.level;
    private _isExpandable = (node: DetailFlatNode) => node.expandable;
    private _getChildren = (node: DetailNode): Observable<DetailNode[]> => observableOf(node.children);
    hasChild = (_: number, _nodeData: DetailFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: DetailFlatNode) => {
        console.log("hasNoContent()", JSON.stringify(_nodeData));
        return _nodeData.filename === '';
    };

    hasNewNodeAbsent = (_: number, _nodeData: DetailFlatNode) => {
        let b = !this.database.newNodePresent();
        console.log("hasNewNodeAbsent()", b, _nodeData.nodeId);
        return b;
    };

    hasNewNodePresent = (_: number, _nodeData: DetailFlatNode)=> {
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
    visibleNodes(): DetailNode[] {
        const result = [];

        function addExpandedChildren(node: DetailNode, expanded: string[]) {
            result.push(node);
            if (expanded.includes(node.nodeId)) {
                if (MhUtils.isNotNull(node.children)) {
                    node.children.map((child) => addExpandedChildren(child, expanded));
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
        const nodeToInsert: DetailNode = siblings.splice(siblingIndex, 1)[0];
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

    /**
     * Experimental - opening tree nodes as you drag over them
     */
    dragStart() {
        this.dragging = true;
    }
    dragEnd() {
        this.dragging = false;
    }
    dragHover(node: DetailFlatNode) {
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
    private expandNodesById(flatNodes: DetailFlatNode[], ids: string[]) {
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

    private getParentNode(node: DetailFlatNode): DetailFlatNode | null {
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

    findInTree(detailFlatNode : DetailFlatNode ) : DetailNodeWithParent | null {
        return this.findInTreeWithParent(detailFlatNode, null);
    }

    findInTreeWithParent(detailFlatNode : DetailFlatNode, parent: DetailNode) : DetailNodeWithParent | null {
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

    private findInBranch(detailFlatNode: DetailFlatNode, datum: DetailNode, parent: DetailNode) : DetailNodeWithParent | null {
        if (datum.nodeId===detailFlatNode.nodeId) {
            return new DetailNodeWithParent(datum, parent);
        }
        if (datum.children!==null && datum.children!==undefined) {
            for (const child of datum.children) {
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
    addNewStubItem(node: DetailFlatNode) {
        console.log("10.10", node);
        this.treeControl.expand(node);
        let detailNode = this.findInTree(node);
        console.log("10.11", detailNode)
        this.database.addNewNode(detailNode.node);
        this.database.dataChange.next(this.database.data);
        this.refreshTree();
    }

    // Save the node to database
    saveNode(node: DetailFlatNode) {
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

    deleteNewNode(node: DetailFlatNode) {
        console.log("10.20", node);
        let detailNode = this.findInTree(node);
        console.log("10.21", detailNode)
        this.database.deleteNode(detailNode);
        this.ngAfterViewInit();
        this.formDirective.resetForm();
        this.form.reset();
    }

}