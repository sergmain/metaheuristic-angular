import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { BatchAddComponent } from './batch-add.component';
import { BatchService } from '@app/services/batch/batch.service';
import { AuthenticationService } from '@app/services/authentication';
import { SourceCodeUidsForCompany } from '@app/services/source-codes/SourceCodeUidsForCompany';
import { OperationStatus } from '@app/enums/OperationStatus';

// Mock TranslateService for the TranslateComponent that BatchAddComponent uses
class MockTranslateService {
  instant(key: string): string {
    return key; // Just return the key as-is for tests
  }
}

describe('BatchAddComponent - File Upload', () => {
  let component: BatchAddComponent;
  let fixture: ComponentFixture<BatchAddComponent>;
  let batchService: BatchService;
  let compiled: HTMLElement;

  const mockSourceCodeUids: SourceCodeUidsForCompany = {
    items: [
      { id: 1, companyId: 1, uid: 'test-source-code-1', createdOn: 0 },
      { id: 2, companyId: 1, uid: 'test-source-code-2', createdOn: 0 }
    ]
  };

  beforeEach(async () => {
    const batchServiceMock = {
      batchAdd: vi.fn().mockReturnValue(of(mockSourceCodeUids)),
      uploadFile: vi.fn()
    };

    const authServiceMock = {
      currentCompanyId: signal(1),
      isLogged: signal(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        BatchAddComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BatchService, useValue: batchServiceMock },
        { provide: AuthenticationService, useValue: authServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // This will ignore unknown elements
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchAddComponent);
    component = fixture.componentInstance;
    batchService = TestBed.inject(BatchService);
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have upload button disabled initially', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    const uploadButton = compiled.querySelector('button[color="primary"]') as HTMLButtonElement;
    expect(uploadButton).toBeTruthy();
    expect(uploadButton.disabled).toBe(true);
  });

  it('should enable upload button when source code is selected and file is uploaded', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    // Select a source code
    component.sourceCode.set(mockSourceCodeUids.items[0]);
    fixture.detectChanges();

    // Simulate file selection
    const fileUploadComponent = component.fileUpload();
    expect(fileUploadComponent).toBeTruthy();

    // Create a mock file
    const mockFile = new File(['test content'], 'test.zip', { type: 'application/zip' });
    const fileInput = fileUploadComponent!.fileInput()!.nativeElement as HTMLInputElement;
    
    // Create a DataTransfer to simulate file selection
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;

    // Trigger the change event
    fileUploadComponent!.fileChanged();
    fixture.detectChanges();
    await fixture.whenStable();

    // Check that computed signal updated
    expect(component.isUploadDisabled()).toBe(false);

    // Check that button is enabled
    const uploadButton = compiled.querySelector('button[color="primary"]') as HTMLButtonElement;
    expect(uploadButton.disabled).toBe(false);
  });

  it('should keep upload button disabled when only source code is selected without file', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    component.sourceCode.set(mockSourceCodeUids.items[0]);
    fixture.detectChanges();

    expect(component.isUploadDisabled()).toBe(true);
    
    const uploadButton = compiled.querySelector('button[color="primary"]') as HTMLButtonElement;
    expect(uploadButton.disabled).toBe(true);
  });

  it('should keep upload button disabled when only file is selected without source code', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    const fileUploadComponent = component.fileUpload();
    
    // Create a mock file
    const mockFile = new File(['test content'], 'test.zip', { type: 'application/zip' });
    const fileInput = fileUploadComponent!.fileInput()!.nativeElement as HTMLInputElement;
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;

    fileUploadComponent!.fileChanged();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isUploadDisabled()).toBe(true);
    
    const uploadButton = compiled.querySelector('button[color="primary"]') as HTMLButtonElement;
    expect(uploadButton.disabled).toBe(true);
  });

  it('should call batchService.uploadFile when upload button is clicked', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    const mockFile = new File(['test content'], 'test.zip', { type: 'application/zip' });
    const mockResponse = {
      status: OperationStatus.OK,
      messages: []
    };

    vi.spyOn(batchService, 'uploadFile').mockReturnValue(of(mockResponse));

    // Select source code
    component.sourceCode.set(mockSourceCodeUids.items[0]);
    
    // Upload file
    const fileUploadComponent = component.fileUpload();
    const fileInput = fileUploadComponent!.fileInput()!.nativeElement as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;
    fileUploadComponent!.fileChanged();
    
    fixture.detectChanges();
    await fixture.whenStable();

    // Click upload
    component.upload();

    expect(batchService.uploadFile).toHaveBeenCalledWith('1', mockFile);
  });

  it('should disable upload button after file is removed', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    // First, add a file
    component.sourceCode.set(mockSourceCodeUids.items[0]);
    const fileUploadComponent = component.fileUpload();
    const mockFile = new File(['test content'], 'test.zip', { type: 'application/zip' });
    const fileInput = fileUploadComponent!.fileInput()!.nativeElement as HTMLInputElement;
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;
    fileUploadComponent!.fileChanged();
    
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isUploadDisabled()).toBe(false);

    // Now remove the file
    fileUploadComponent!.removeFile();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isUploadDisabled()).toBe(true);
    
    const uploadButton = compiled.querySelector('button[color="primary"]') as HTMLButtonElement;
    expect(uploadButton.disabled).toBe(true);
  });

  it('should navigate back on successful upload', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    const mockFile = new File(['test content'], 'test.zip', { type: 'application/zip' });
    const mockResponse = {
      status: OperationStatus.OK,
      messages: []
    };

    vi.spyOn(batchService, 'uploadFile').mockReturnValue(of(mockResponse));
    const backSpy = vi.spyOn(component, 'back');

    component.sourceCode.set(mockSourceCodeUids.items[0]);
    const fileUploadComponent = component.fileUpload();
    const fileInput = fileUploadComponent!.fileInput()!.nativeElement as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;
    fileUploadComponent!.fileChanged();

    fixture.detectChanges();

    component.upload();
    await fixture.whenStable();

    expect(backSpy).toHaveBeenCalled();
  });

  it('should update file signal when file is selected', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    
    const mockFile = new File(['test content'], 'test.zip', { type: 'application/zip' });
    
    expect(component.file()).toBeUndefined();

    const fileUploadComponent = component.fileUpload();
    const fileInput = fileUploadComponent!.fileInput()!.nativeElement as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;
    
    component.fileUploadChanged();
    
    expect(component.file()).toEqual(mockFile);
  });
});
