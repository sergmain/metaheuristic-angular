import { Component, OnInit, input, output } from '@angular/core';
import { PageableDefault } from '@app/models/PageableDefault';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone : true,
    selector: 'ct-table-pagination',
    templateUrl: './ct-table-pagination.component.html',
    styleUrls: ['./ct-table-pagination.component.sass'],
    imports: [MatIconButton, MatIcon]
})
export class CtTablePaginationComponent {
    next = output<void>();
    prev = output<void>();
    globalDisable = input<boolean>();
    pageableDefault = input<PageableDefault>();

    _next(): void {
        this.next.emit();
    }
    _prev(): void {
        this.prev.emit();
    }
}
