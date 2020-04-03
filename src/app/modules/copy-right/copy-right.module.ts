import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CopyRightComponent } from './copy-right/copy-right.component';


@NgModule({
    imports: [CommonModule],
    declarations: [CopyRightComponent],
    exports: [CopyRightComponent]
})

export class CopyRightModule {}