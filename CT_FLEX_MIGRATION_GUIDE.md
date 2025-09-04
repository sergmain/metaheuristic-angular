# CT-Flex to Standard CSS Flexbox Migration Guide

## Overview
This document outlines the migration from custom `ct-flex` components to standard CSS flexbox classes in the Angular application.

## Migration Progress

### ✅ Completed Components
The following components have been successfully migrated:

#### Account Module
- `account-add.component.html`
- `account-edit.component.html`
- `account-edit-pass.component.html`
- `account-access.component.html`
- `accounts.component.html`

#### API Module
- `api-add.component.html`
- `apis.component.html`

#### Auth Module
- `auth-add.component.html`
- `auth-edit.component.html`
- `auths.component.html`

#### Batch Module
- `batch-add.component.html`

#### CT Module
- `ct-back-button.component.html`
- `ct-table-pagination.component.html`
- `ct-state-of-tasks.component.html`

#### Components
- `login.component.html`

### 📁 Infrastructure Changes
- ✅ Created `flex-utilities.scss` with utility classes
- ✅ Updated `styles.scss` to import flex utilities
- ✅ Updated `ct.module.ts` to deprecate ct-flex components

## Migration Patterns

### Pattern 1: Simple Button Groups
**Before:**
```html
<ct-flex justify-content="flex-end" gap="8px">
  <ct-flex-item>
    <button mat-stroked-button>Cancel</button>
  </ct-flex-item>
  <ct-flex-item>
    <button mat-flat-button color="primary">Save</button>
  </ct-flex-item>
</ct-flex>
```

**After:**
```html
<div class="flex justify-content-flex-end gap-8px">
  <button mat-stroked-button>Cancel</button>
  <button mat-flat-button color="primary">Save</button>
</div>
```

### Pattern 2: Space Between Layout
**Before:**
```html
<ct-flex justify-content="space-between">
  <ct-flex-item>
    <ct-heading>Title</ct-heading>
  </ct-flex-item>
  <ct-flex-item>
    <button mat-flat-button>Action</button>
  </ct-flex-item>
</ct-flex>
```

**After:**
```html
<div class="flex justify-content-space-between">
  <ct-heading>Title</ct-heading>
  <button mat-flat-button>Action</button>
</div>
```

### Pattern 3: Table Action Buttons
**Before:**
```html
<ct-flex justify-content="flex-end" gap="9px">
  <ct-flex-item>
    <button mat-flat-button>Edit</button>
  </ct-flex-item>
  <ct-flex-item>
    <button mat-flat-button color="warn">Delete</button>
  </ct-flex-item>
</ct-flex>
```

**After:**
```html
<div class="flex justify-content-flex-end gap-9px">
  <button mat-flat-button>Edit</button>
  <button mat-flat-button color="warn">Delete</button>
</div>
```

### Pattern 4: With Align Items
**Before:**
```html
<ct-flex justify-content="space-between" align-items="center" gap="8px">
  <ct-flex-item>
    <span>Content</span>
  </ct-flex-item>
</ct-flex>
```

**After:**
```html
<div class="flex justify-content-space-between align-items-center gap-8px">
  <span>Content</span>
</div>
```

## CSS Utility Classes

The following utility classes are available in `flex-utilities.scss`:

### Base Flex
- `.flex` - Basic flex container

### Justify Content
- `.justify-content-space-between`
- `.justify-content-flex-end`
- `.justify-content-flex-start`
- `.justify-content-center`

### Align Items
- `.align-items-flex-end`
- `.align-items-baseline`
- `.align-items-center`

### Direction
- `.flex-direction-column`

### Gap Utilities
- `.gap-unit-1` (9px)
- `.gap-unit-2` (18px)
- `.gap-unit-3` (27px)
- `.gap-18px`
- `.gap-16px`
- `.gap-12px`
- `.gap-9px`
- `.gap-8px`
- `.gap-4px`
- `.gap-0`

### Flex Item Utilities
- `.flex-1`
- `.flex-2`
- `.flex-shrink-0`
- `.flex-shrink-1`

### Common Combinations
- `.flex-justify-end-gap-8`
- `.flex-space-between`
- `.flex-center`
- `.flex-column`
- `.flex-column-gap-8`

## Remaining Files to Migrate

Based on the search results, approximately **60+ more HTML files** still contain ct-flex usage and need migration:

### High Priority Files
- Chat module components
- Company module components
- Evaluation components
- Function components
- Global variables components
- Source code components
- Settings components
- Scenario components
- Processor components
- KB components
- Experiment components

## Migration Checklist

For each remaining file:

1. **Identify ct-flex patterns:**
   - `<ct-flex [attributes]>`
   - `<ct-flex-item [attributes]>`

2. **Replace with standard divs and CSS classes:**
   - Convert attributes to CSS classes
   - Remove ct-flex-item wrappers when not needed
   - Maintain spacing and layout

3. **Test the component:**
   - Verify visual layout matches original
   - Check responsiveness
   - Ensure accessibility is maintained

## Attribute Mapping Reference

| CT-Flex Attribute | CSS Class |
|------------------|-----------|
| `justify-content="flex-end"` | `justify-content-flex-end` |
| `justify-content="flex-start"` | `justify-content-flex-start` |
| `justify-content="center"` | `justify-content-center` |
| `justify-content="space-between"` | `justify-content-space-between` |
| `align-items="center"` | `align-items-center` |
| `align-items="flex-end"` | `align-items-flex-end` |
| `align-items="baseline"` | `align-items-baseline` |
| `flex-direction="column"` | `flex-direction-column` |
| `gap="8px"` | `gap-8px` |
| `gap="unit(1)"` | `gap-unit-1` |

## Benefits of Migration

1. **Future Compatibility:** Works with newer Angular versions
2. **Performance:** No custom component overhead
3. **Standard CSS:** Uses native CSS Grid gap property
4. **Maintainability:** Standard flexbox is widely understood
5. **Flexibility:** Easy to extend with additional utility classes

## Next Steps

1. Continue migrating remaining HTML files using the established patterns
2. After all migrations are complete, remove ct-flex component files
3. Remove ct-flex imports from ct.module.ts completely
4. Run full application test to ensure no regressions
5. Update project documentation

## Notes

- The `unit()` function in variables.scss multiplies by 9px
- CSS Grid `gap` property is used instead of margin-based spacing
- Modern browsers support CSS Grid gap for flexbox containers
- All utility classes are defined in `/src/flex-utilities.scss`
