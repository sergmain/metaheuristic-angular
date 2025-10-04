/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

// Plugin to handle Angular component resources (templates and styles)
function angularComponentResources(): Plugin {
  return {
    name: 'angular-component-resources',
    transform(code, id) {
      if (id.endsWith('.ts') && !id.includes('node_modules')) {
        // Replace templateUrl with inline template
        code = code.replace(
          /templateUrl:\s*['"`](.+?)['"`]/g,
          (match, templatePath) => {
            const dir = path.dirname(id);
            const templateFile = path.resolve(dir, templatePath);
            if (fs.existsSync(templateFile)) {
              const template = fs.readFileSync(templateFile, 'utf-8')
                .replace(/`/g, '\\`')
                .replace(/\$/g, '\\$');
              return `template: \`${template}\``;
            }
            return `template: ''`;
          }
        );
        
        // Replace styleUrls with inline styles
        code = code.replace(
          /styleUrls:\s*\[([\s\S]*?)\]/g,
          (match, styleUrlsContent) => {
            const styleUrls = styleUrlsContent
              .split(',')
              .map((s: string) => s.trim().replace(/['"`]/g, ''))
              .filter((s: string) => s);
            
            const styles = styleUrls.map((styleUrl: string) => {
              const dir = path.dirname(id);
              const styleFile = path.resolve(dir, styleUrl);
              if (fs.existsSync(styleFile)) {
                const style = fs.readFileSync(styleFile, 'utf-8')
                  .replace(/`/g, '\\`')
                  .replace(/\$/g, '\\$');
                return `\`${style}\``;
              }
              return "''";
            });
            
            return `styles: [${styles.join(', ')}]`;
          }
        );
        
        return { code };
      }
    }
  };
}

export default defineConfig({
  plugins: [angularComponentResources()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/authentication.service.spec.ts' // Exclude old Jasmine tests
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
      ]
    },
    server: {
      deps: {
        inline: ['@angular', '@angular/common', '@angular/core', '@angular/platform-browser']
      }
    }
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@services': path.resolve(__dirname, './src/app/services'),
      '@src': path.resolve(__dirname, './src'),
    }
  },
  define: {
    'import.meta.vitest': false,
  },
});
