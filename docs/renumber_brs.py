import re
import os

files_to_update = [
    'd:\\doanWEDKD\\docs\\12_Business_RulesNew.md',
    'd:\\doanWEDKD\\docs\\14_BPMN_Business_Processes_NEW.md',
    'd:\\doanWEDKD\\docs\\03_Actor_UseCase.md'
]

# Read file 12 to find all BR IDs in order
with open(files_to_update[0], 'r', encoding='utf-8') as f:
    content12 = f.read()

# Find all BR headers. E.g. ### BR-01: ...
br_headers = re.findall(r'### (BR-[0-9]+B?):', content12)

# Create a mapping from old ID to new ID
mapping = {}
counter = 1
for old_id in br_headers:
    new_id = f"BR-{counter:02d}"
    mapping[old_id] = new_id
    counter += 1

print("Mapping generated:")
for k, v in mapping.items():
    print(f"{k} -> {v}")

# To safely replace, we should replace occurrences of BR-XX but not substring matches.
# E.g. BR-1 might match BR-10. So we use word boundaries or lookaheads.
# A regex like r'\bBR-XX\b' works well.
# Wait, 'BR-11B' has a letter. \b handles it fine if followed by space or punctuation.

# Sort mapping by length of old_id descending to avoid partial replacements (e.g. replacing BR-1 before BR-11)
sorted_mapping = sorted(mapping.items(), key=lambda x: len(x[0]), reverse=True)

def replace_brs(text):
    for old_id, new_id in sorted_mapping:
        # We replace using regex to ensure we don't partially match BR-10 with BR-1
        # But wait, we can just replace 'BR-XX' temporarily with 'NEWBR-XX', and then drop the 'NEW'.
        pass
    
    # Actually, a better way is to use a single regex replacement
    def replacer(match):
        return mapping.get(match.group(0), match.group(0))
    
    # Create a regex pattern that matches any of the old IDs exactly
    pattern = re.compile(r'\b(?:' + '|'.join(re.escape(k) for k in mapping.keys()) + r')\b')
    return pattern.sub(replacer, text)

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        
        new_text = replace_brs(text)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f"Updated {filepath}")

print("Done renumbering BRs.")
