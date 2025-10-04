import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Suppress CSS parsing errors from SCSS in tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const errorString = args.join(' ');
  if (errorString.includes('Could not parse CSS stylesheet')) {
    return; // Suppress CSS parsing errors
  }
  originalConsoleError.apply(console, args);
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
