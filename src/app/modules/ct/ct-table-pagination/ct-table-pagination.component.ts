import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageableDefault } from '@app/models/PageableDefault';

@Component({
    selector: 'ct-table-pagination',
    templateUrl: './ct-table-pagination.component.html',
    styleUrls: ['./ct-table-pagination.component.sass'],
    standalone: false
})
export class CtTablePaginationComponent {
    @Output() next: EventEmitter<void> = new EventEmitter<void>();
    @Output() prev: EventEmitter<void> = new EventEmitter<void>();
    @Input() globalDisable: boolean;
    @Input() pageableDefault: PageableDefault;

    _next(): void {
        this.next.emit();
    }
    _prev(): void {
        this.prev.emit();
    }
}
