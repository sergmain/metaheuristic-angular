import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateComponent } from './translate.component';

// Mock TranslateService
class MockTranslateService {
  instant(key: string): string {
    return `translated_${key}`;
  }
}

describe('TranslateComponent', () => {
  let component: TranslateComponent;
  let fixture: ComponentFixture<TranslateComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateComponent],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TranslateComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should translate a simple key', () => {
    component.key = 'batch-add.Cancel';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toBe('translated_batch-add.Cancel');
  });

  it('should update translation when key changes', () => {
    component.key = 'test.key1';
    fixture.detectChanges();
    
    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toBe('translated_test.key1');

    component.key = 'test.key2';
    fixture.detectChanges();
    
    expect(compiled.textContent).toBe('translated_test.key2');
  });

  it('should call TranslateService.instant with the correct key', () => {
    const instantSpy = vi.spyOn(translateService, 'instant');
    
    component.key = 'batch-add.Upload-File-button';
    const result = component.translatedText;

    expect(instantSpy).toHaveBeenCalledWith('batch-add.Upload-File-button');
    expect(result).toBe('translated_batch-add.Upload-File-button');
  });
});
