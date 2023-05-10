import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatCheckboxChange} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class DetailNode {
    id: string;
    children: DetailNode[];
    filename: string;
    type: any;
}

/** Flat node with expandable and level information */
export class DetailFlatNode {
    constructor(
        public expandable: boolean,
        public filename: string,
        public level: number,
        public type: any,
        public id: string
    ) {}
}

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
const TREE_DATA = JSON.stringify({
    Applications: {
        Calendar: 'app',
        Chrome: 'app',
        Webstorm: 'app'
    },
    Documents: {
        angular: {
            src: {
                compiler: 'ts',
                core: 'ts'
            }
        },
        material2: {
            src: {
                button: 'ts',
                checkbox: 'ts',
                input: 'ts'
            }
        }
    },
    Downloads: {
        October: 'pdf',
        November: 'pdf',
        Tutorial: 'html'
    },
    Pictures: {
        'Photo Booth Library': {
            Contents: 'dir',
            Pictures: 'dir'
        },
        Sun: 'png',
        Woods: 'jpg'
    }
});

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
    dataChange = new BehaviorSubject<DetailNode[]>([]);

    get data(): DetailNode[] { return this.dataChange.value; }

    constructor() {
        this.initialize();
    }

    initialize() {
        // Parse the string to json object.
        const dataObject = JSON.parse(TREE_DATA);

        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        const data = this.buildFileTree(dataObject, 0);

        // Notify the change.
        this.dataChange.next(data);
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
            node.id = `${parentId}/${idx}`;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1, node.id);
                } else {
                    node.type = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }
}

/**
 * @title Tree with checkboxes
 */
@Component({
    selector: 'scenario-dtls',
    templateUrl: 'scenario-dtls.component.html',
    styleUrls: ['scenario-dtls.component.css'],
    providers: [ChecklistDatabase],
})
export class ScenarioDtlsComponent {

    treeControl: FlatTreeControl<DetailFlatNode>;
    treeFlattener: MatTreeFlattener<DetailNode, DetailFlatNode>;
    dataSource: MatTreeFlatDataSource<DetailNode, DetailFlatNode>;
    // expansion model tracks expansion state
    expansionModel = new SelectionModel<string>(true);
    dragging = false;
    expandTimeout: any;
    expandDelay = 1000;
    validateDrop = false;

    constructor(database: ChecklistDatabase) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
            this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl<DetailFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        database.dataChange.subscribe(data => this.rebuildTreeForData(data));
    }

    transformer = (node: DetailNode, level: number) => {
        return new DetailFlatNode(!!node.children, node.filename, level, node.type, node.id);
    }
    private _getLevel = (node: DetailFlatNode) => node.level;
    private _isExpandable = (node: DetailFlatNode) => node.expandable;
    private _getChildren = (node: DetailNode): Observable<DetailNode[]> => observableOf(node.children);
    hasChild = (_: number, _nodeData: DetailFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: DetailFlatNode) => _nodeData.filename === '';

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
            if (expanded.includes(node.id)) {
                node.children.map((child) => addExpandedChildren(child, expanded));
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
        function findNodeSiblings(arr: Array<any>, id: string): Array<any> {
            let result, subResult;
            arr.forEach((item, i) => {
                if (item.id === id) {
                    result = arr;
                } else if (item.children) {
                    subResult = findNodeSiblings(item.children, id);
                    if (subResult) result = subResult;
                }
            });
            return result;

        }

        // determine where to insert the node
        const nodeAtDest = visibleNodes[event.currentIndex];
        const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
        if (!newSiblings) return;
        const insertIndex = newSiblings.findIndex(s => s.id === nodeAtDest.id);

        // remove the node from its old place
        const node = event.item.data;
        const siblings = findNodeSiblings(changedData, node.id);
        const siblingIndex = siblings.findIndex(n => n.id === node.id);
        const nodeToInsert: DetailNode = siblings.splice(siblingIndex, 1)[0];
        if (nodeAtDest.id === nodeToInsert.id) return;

        // ensure validity of drop - must be same level
        const nodeAtDestFlatNode = this.treeControl.dataNodes.find((n) => nodeAtDest.id === n.id);
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
        this.dataSource.data = data;
        this.expansionModel.selected.forEach((id) => {
            const node = this.treeControl.dataNodes.find((n) => n.id === id);
            this.treeControl.expand(node);
        });
    }

    /**
     * Not used but you might need this to programmatically expand nodes
     * to reveal a particular node
     */
    private expandNodesById(flatNodes: DetailFlatNode[], ids: string[]) {
        if (!flatNodes || flatNodes.length === 0) return;
        const idSet = new Set(ids);
        return flatNodes.forEach((node) => {
            if (idSet.has(node.id)) {
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

    /** Save the node to database */
    saveNode(node: DetailFlatNode, itemValue: string) {
        const nestedNode = this.getParentNode(node);
        // this.database.updateItem(nestedNode!, itemValue);
    }
}