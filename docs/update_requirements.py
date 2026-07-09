import re

with open('d:\\doanWEDKD\\docs\\02_Requirements.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False

uc_mapping = {
    'UC-01': 'UC-03', 'UC-02': 'UC-04', 'UC-03': 'UC-04', 'UC-04': 'UC-04',
    'UC-05': 'UC-06', 'UC-06': 'UC-06', 'UC-07': 'UC-06', 'UC-08': 'UC-06',
    'UC-09': 'UC-07', 'UC-10': 'UC-07', 'UC-11': 'UC-05', 'UC-12': 'UC-07',
    'UC-13': 'UC-12, UC-03', 'UC-14': 'UC-10', 'UC-15': 'UC-10', 'UC-16': 'UC-10',
    'UC-17': 'UC-14', 'UC-18': 'UC-14', 'UC-19': 'UC-14', 'UC-20': 'UC-15',
    'UC-21': 'UC-13', 'UC-22': 'UC-13, UC-08', 'UC-23': 'UC-08', 'UC-24': 'UC-13',
    'UC-25': 'UC-08', 'UC-26': 'UC-13', 'UC-27': 'UC-15', 'UC-39': 'UC-07',
    'UC-40': 'UC-07', 'UC-41': 'UC-07', 'UC-42': 'UC-07', 'UC-43': 'UC-16',
    'UC-44': 'UC-10, UC-16', 'UC-45': 'UC-16', 'UC-46': 'UC-16', 'UC-47': 'UC-14',
    'UC-48': 'UC-14', 'UC-49': 'UC-14', 'UC-50': 'UC-15', 'UC-51': 'UC-15',
    'UC-52': 'UC-12', 'UC-53': 'UC-12', 'UC-54': 'UC-12', 'UC-55': 'UC-05',
    'UC-56': 'UC-05', 'UC-57': 'UC-05', 'UC-58': 'UC-06', 'UC-59': 'UC-07',
    'UC-60': 'UC-04', 'UC-61': 'UC-11', 'UC-62': 'UC-12', 'UC-63': 'UC-02',
    'UC-64': 'UC-13', 'UC-65': 'UC-09, UC-13', 'UC-66': 'UC-09', 'UC-67': 'UC-09, UC-13',
    'UC-68': 'UC-09, UC-13', 'UC-69': 'UC-15',
}

for line in lines:
    if '### 3.3.11. Delivery và quản lý đơn hàng' in line:
        skip = True
        continue
    if skip and '## 3.4.' in line:
        skip = False
        
    if skip:
        continue

    # Find UC-XX and replace based on mapping
    # Note: FR rows look like: | FR-001 | Guest... | ... | Cao | UC-01 |
    if re.search(r'\|\s*FR-\d+\s*\|', line):
        # find the last column
        parts = line.split('|')
        if len(parts) >= 6:
            old_ucs = re.findall(r'UC-\d+', parts[-2])
            if old_ucs:
                new_ucs = []
                for uc in old_ucs:
                    if uc in uc_mapping:
                        # Handle multiple mapped UCs (e.g. 'UC-13, UC-08')
                        mapped = uc_mapping[uc]
                        for m in mapped.split(','):
                            new_ucs.append(m.strip())
                
                # remove duplicates and join
                if new_ucs:
                    new_ucs_str = ', '.join(sorted(list(set(new_ucs))))
                    parts[-2] = f" {new_ucs_str} "
                    line = '|'.join(parts)
                
    new_lines.append(line)

with open('d:\\doanWEDKD\\docs\\02_Requirements.md', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done updating requirements")
