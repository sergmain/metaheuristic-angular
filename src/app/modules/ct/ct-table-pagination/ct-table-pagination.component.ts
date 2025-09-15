import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageableDefault } from '@app/models/PageableDefault';
import { NgIf } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone : true,
    selector: 'ct-table-pagination',
    templateUrl: './ct-table-pagination.component.html',
    styleUrls: ['./ct-table-pagination.component.sass'],
    imports: [NgIf, MatIconButton, MatIcon]
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
