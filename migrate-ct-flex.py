#!/usr/bin/env python3
"""
Migration script to replace ct-flex components with standard CSS flexbox classes.
This script automates the migration process for all remaining HTML files.
"""

import os
import re
import glob

def migrate_ct_flex_patterns(content):
    """
    Replace ct-flex patterns with standard CSS flexbox classes.
    """
    # Pattern 1: Simple ct-flex with ct-flex-item wrapper removal
    # <ct-flex justify-content="flex-end" gap="8px">
    #   <ct-flex-item>content</ct-flex-item>
    # </ct-flex>
    # becomes:
    # <div class="flex justify-content-flex-end gap-8px">content</div>
    
    patterns = [
        # Pattern for ct-flex with attributes and ct-flex-item
        (
            r'<ct-flex([^>]*?)>\s*<ct-flex-item[^>]*?>\s*(.*?)\s*</ct-flex-item>\s*</ct-flex>',
            r'<div class="flex\1">\2</div>'
        ),
        
        # Pattern for multiple ct-flex-items
        (
            r'<ct-flex([^>]*?)>\s*((?:<ct-flex-item[^>]*?>.*?</ct-flex-item>\s*)*)\s*</ct-flex>',
            lambda m: replace_multiple_flex_items(m.group(1), m.group(2))
        ),
        
        # Simple ct-flex without ct-flex-item children
        (
            r'<ct-flex([^>]*?)>(.*?)</ct-flex>',
            r'<div class="flex\1">\2</div>'
        ),
        
        # Simple ct-flex-item
        (
            r'<ct-flex-item[^>]*?>(.*?)</ct-flex-item>',
            r'\1'
        )
    ]
    
    # Convert attributes to CSS classes
    result = content
    
    # First handle the attribute conversions
    result = re.sub(r'justify-content="([^"]*)"', lambda m: f'justify-content-{m.group(1).replace("-", "-")}', result)
    result = re.sub(r'align-items="([^"]*)"', lambda m: f'align-items-{m.group(1).replace("-", "-")}', result)
    result = re.sub(r'flex-direction="([^"]*)"', lambda m: f'flex-direction-{m.group(1).replace("-", "-")}', result)
    result = re.sub(r'gap="([^"]*)"', lambda m: f'gap-{m.group(1).replace("px", "px").replace("unit(", "unit-").replace(")", "")}', result)
    
    # Apply the patterns
    for pattern, replacement in patterns:
        if callable(replacement):
            result = re.sub(pattern, replacement, result, flags=re.DOTALL | re.MULTILINE)
        else:
            result = re.sub(pattern, replacement, result, flags=re.DOTALL | re.MULTILINE)
    
    # Clean up class attributes
    result = re.sub(r'class="flex\s+([^"]*)"', r'class="flex \1"', result)
    result = re.sub(r'class="flex\s*"', r'class="flex"', result)
    
    return result

def replace_multiple_flex_items(attributes, items_content):
    """
    Handle multiple ct-flex-items by extracting their content
    """
    # Extract content from each ct-flex-item
    item_pattern = r'<ct-flex-item[^>]*?>(.*?)</ct-flex-item>'
    items = re.findall(item_pattern, items_content, re.DOTALL)
    
    # Join the content with appropriate spacing
    content = '\n            '.join(item.strip() for item in items)
    
    return f'<div class="flex{attributes}">\n            {content}\n        </div>'

def process_file(file_path):
    """
    Process a single HTML file to migrate ct-flex components.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        migrated_content = migrate_ct_flex_patterns(content)
        
        if original_content != migrated_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(migrated_content)
            return True
        
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """
    Main function to process all HTML files in the project.
    """
    # Find all HTML files in the project
    html_files = []
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"Found {len(html_files)} HTML files to process")
    
    modified_count = 0
    for file_path in html_files:
        if process_file(file_path):
            print(f"✓ Migrated: {file_path}")
            modified_count += 1
        else:
            print(f"- No changes: {file_path}")
    
    print(f"\nMigration complete! Modified {modified_count} files.")

if __name__ == "__main__":
    main()
