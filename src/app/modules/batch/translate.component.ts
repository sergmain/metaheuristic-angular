import { Component, Input, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [CommonModule],
  template: `{{ translatedText }}`,
})
export class TranslateComponent {
  @Input() key: string = '';
  
  private translateService = inject(TranslateService);
  
  get translatedText(): string {
    return this.translateService.instant(this.key);
  }
}
