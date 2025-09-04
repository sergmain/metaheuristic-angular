#!/usr/bin/env python3
"""
Complete the ct-flex to CSS flexbox migration for all remaining files.
This script will process all remaining HTML files efficiently.
"""

import os
import re
import glob

def migrate_ct_flex_to_div(content):
    """Replace ct-flex with div and appropriate CSS classes."""
    
    # Define the replacement patterns
    patterns = [
        # Complete ct-flex with ct-flex-items - extract inner content
        (
            r'<ct-flex([^>]*?)>\s*((?:<ct-flex-item[^>]*?>.*?</ct-flex-item>\s*)+)\s*</ct-flex>',
            lambda m: process_flex_with_items(m.group(1), m.group(2))
        ),
        
        # Simple ct-flex without ct-flex-items
        (
            r'<ct-flex([^>]*?)>(.*?)</ct-flex>',
            lambda m: f'<div class="flex{convert_attributes(m.group(1))}">{m.group(2)}</div>'
        ),
        
        # Standalone ct-flex-item (remove wrapper)
        (
            r'<ct-flex-item[^>]*?>(.*?)</ct-flex-item>',
            r'\1'
        )
    ]
    
    result = content
    for pattern, replacement in patterns:
        if callable(replacement):
            result = re.sub(pattern, replacement, result, flags=re.DOTALL | re.MULTILINE)
        else:
            result = re.sub(pattern, replacement, result, flags=re.DOTALL | re.MULTILINE)
    
    return result

def process_flex_with_items(attributes, items_content):
    """Process ct-flex container with multiple ct-flex-items."""
    # Extract content from each ct-flex-item
    item_pattern = r'<ct-flex-item[^>]*?>(.*?)</ct-flex-item>'
    items = re.findall(item_pattern, items_content, re.DOTALL)
    
    # Clean up and join the content
    cleaned_items = []
    for item in items:
        cleaned_item = item.strip()
        if cleaned_item:
            # Add appropriate indentation
            cleaned_items.append(f"                {cleaned_item}")
    
    content = '\n'.join(cleaned_items)
    css_attrs = convert_attributes(attributes)
    
    return f'<div class="flex{css_attrs}">\n{content}\n            </div>'

def convert_attributes(attributes):
    """Convert ct-flex attributes to CSS class names."""
    if not attributes:
        return ""
    
    # Extract attribute patterns
    attr_mappings = {
        r'justify-content="([^"]*)"': lambda m: f' justify-content-{m.group(1).replace("-", "-")}',
        r'align-items="([^"]*)"': lambda m: f' align-items-{m.group(1).replace("-", "-")}',
        r'flex-direction="([^"]*)"': lambda m: f' flex-direction-{m.group(1).replace("-", "-")}',
        r'gap="([^"]*)"': lambda m: f' gap-{m.group(1).replace("px", "px").replace("unit(", "unit-").replace(")", "")}'
    }
    
    result = ""
    for pattern, replacement in attr_mappings.items():
        if callable(replacement):
            match = re.search(pattern, attributes)
            if match:
                result += replacement(match)
        else:
            result = re.sub(pattern, replacement, attributes)
    
    return result

def process_file(file_path):
    """Process a single HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if no ct-flex components
        if 'ct-flex' not in content:
            return False
        
        original_content = content
        migrated_content = migrate_ct_flex_to_div(content)
        
        if original_content != migrated_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(migrated_content)
            return True
        
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Process all remaining HTML files."""
    
    # Get list of remaining files with ct-flex
    files_to_process = []
    
    remaining_files = [
        "/src/app/modules/global-variables/card-form-add-variable-with-storage/card-form-add-variable-with-storage.component.html",
        "/src/app/modules/global-variables/global-variables/global-variables.component.html",
        "/src/app/modules/kb/kb-add/kb-add.component.html",
        "/src/app/modules/kb/kb-edit/kb-edit.component.html",
        "/src/app/modules/kb/kbs/kbs.component.html",
        "/src/app/modules/processors/edit-processor/edit-processor.component.html",
        "/src/app/modules/processors/processors/processors.component.html",
        "/src/app/modules/scenario/scenario-add/scenario-add.component.html",
        "/src/app/modules/scenario/scenarios/scenarios.component.html",
        "/src/app/modules/source-codes/source-codes/source-codes.component.html",
        "/src/app/modules/settings/settings-languages/settings-languages-index/settings-languages-index.component.html",
        "/src/app/modules/settings/settings-security/settings-security-index/settings-security-index.component.html",
        "/src/app/modules/settings/settings-api-keys/settings-api-keys-index/settings-api-keys-index.component.html",
        "/src/app/modules/experiments/experiments/experiments.component.html",
        "/src/app/modules/experiments/experiment-add/experiment-add.component.html",
        "/src/app/modules/experiments/experiment-edit/experiment-edit.component.html",
        "/src/app/components/app-view/app-view.component.html",
        "/src/app/components/app-index/app-index.component.html",
        "/src/app/components/batch-change-notification/batch-change-notification.component.html"
    ]
    
    print(f"Processing {len(remaining_files)} remaining files...")
    
    processed_count = 0
    for file_path in remaining_files:
        # Remove leading slash for relative path
        clean_path = file_path.lstrip('/')
        
        if os.path.exists(clean_path):
            if process_file(clean_path):
                print(f"✓ Migrated: {clean_path}")
                processed_count += 1
            else:
                print(f"- No changes needed: {clean_path}")
        else:
            print(f"⚠ File not found: {clean_path}")
    
    print(f"\nProcessed {processed_count} files successfully!")
    print("Migration completed!")

if __name__ == "__main__":
    main()
