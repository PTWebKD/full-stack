import re

def process_file():
    with open('d:\\doanWEDKD\\docs\\12_Business_RulesNew.md', 'r', encoding='utf-8') as f:
        content = f.read()

    # Mapping of BR to New UC and BPMN
    # We will find every block starting with ### BR-XX and replace its '*   **Áp dụng**: ...' line.
    
    mapping = {
        'BR-01': 'UC-01, UC-03, UC-04',
        'BR-02': 'UC-02',
        'BR-03': 'Toàn bộ hệ thống',
        'BR-04': 'Toàn bộ hệ thống',
        'BR-40': 'UC-03, Nhóm 3.3.2',
        'BR-05': 'UC-03, UC-10',
        'BR-06': 'UC-10, Nhóm 3.3.7',
        'BR-07': 'UC-10, Nhóm 3.3.7',
        'BR-08': 'UC-10, Nhóm 3.3.9',
        'BR-09': 'UC-01, UC-06, Nhóm 3.3.1',
        'BR-10': 'UC-14, Timer Actor',
        'BR-11': 'UC-14, Timer Actor',
        'BR-12': 'UC-08, UC-13, Nhóm 3.3.6',
        'BR-13': 'UC-13, UC-08',
        'BR-14': 'UC-13, UC-08',
        'BR-15': 'Không áp dụng trực tiếp',
        'BR-11B': 'UC-13', # Gear
        'BR-49': 'UC-09, Nhóm 3.3.10',
        'BR-50': 'UC-09, UC-13, Nhóm 3.3.10',
        'BR-51': 'UC-09, UC-13, Nhóm 3.3.10',
        'BR-52': 'UC-08, UC-09',
        'BR-53': 'UC-16, UC-08, UC-09',
        'BR-54': 'UC-08, UC-09, UC-12',
        'BR-55': 'UC-08, UC-09, UC-16',
        'BR-21': 'UC-06, UC-07, UC-11',
        'BR-22': 'UC-06, UC-07, UC-11',
        'BR-23': 'UC-06',
        'BR-24': 'Timer Actor, UC-06',
        'BR-25': 'UC-06, UC-11',
        'BR-26': 'Toàn bộ hệ thống',
        'BR-27': 'Toàn bộ hệ thống',
        'BR-28': 'UC-06, UC-11, UC-10',
        'BR-29': 'UC-08, UC-09, UC-10',
        'BR-30': 'UC-16, UC-08, UC-09',
        'BR-31': 'UC-06, Nhóm 3.3.4',
        'BR-32': 'UC-05, UC-06',
        'BR-33': 'UC-06, Nhóm 3.3.4',
        'BR-34': 'UC-05, UC-06',
        'BR-35': 'UC-14, Timer Actor',
        'BR-36': 'UC-14',
        'BR-37': 'UC-16',
        'BR-38': 'UC-16',
        'BR-39': 'Toàn bộ hệ thống',
        'BR-41': 'UC-05, Nhóm 3.3.3',
        'BR-42': 'UC-05, Nhóm 3.3.3',
        'BR-43': 'UC-06, UC-07, Nhóm 3.3.5',
        'BR-44': 'UC-06, UC-08, Nhóm 3.3.6',
        'BR-45': 'UC-14, UC-07, Timer Actor',
        'BR-46': 'UC-11, Nhóm 3.3.8',
        'BR-47': 'UC-02, UC-09, Nhóm 3.3.1',
        'BR-48': 'UC-02, UC-09, Nhóm 3.3.1',
        'BR-56': 'UC-01, Nhóm 3.3.1',
        'BR-57': 'UC-02, Nhóm 3.3.1',
        'BR-58': 'UC-01, Nhóm 3.3.1',
        'BR-59': 'UC-02, Nhóm 3.3.1',
        'BR-60': 'UC-03, Nhóm 3.3.2',
        'BR-61': 'UC-03, Nhóm 3.3.2',
        'BR-62': 'UC-03, Nhóm 3.3.2',
        'BR-63': 'UC-03, UC-04, Nhóm 3.3.2',
        'BR-64': 'UC-03, Nhóm 3.3.2',
        'BR-65': 'UC-05, Nhóm 3.3.3',
        'BR-66': 'UC-05, Nhóm 3.3.3',
        'BR-67': 'UC-05, UC-07, Nhóm 3.3.3',
        'BR-68': 'UC-05, Nhóm 3.3.3',
        'BR-69': 'UC-06, Nhóm 3.3.4',
        'BR-70': 'UC-06, Nhóm 3.3.4',
        'BR-71': 'UC-06, UC-14, Nhóm 3.3.4',
        'BR-72': 'Không áp dụng',
        'BR-73': 'UC-07, Nhóm 3.3.5',
        'BR-74': 'UC-07, Nhóm 3.3.5',
        'BR-75': 'UC-07, Nhóm 3.3.5',
        'BR-76': 'UC-07, Nhóm 3.3.5',
        'BR-77': 'UC-08, Nhóm 3.3.6',
        'BR-78': 'UC-08, Nhóm 3.3.6',
        'BR-79': 'UC-08, Nhóm 3.3.6',
        'BR-80': 'UC-08, Nhóm 3.3.6',
        'BR-81': 'UC-08, Nhóm 3.3.6',
        'BR-82': 'UC-10, Nhóm 3.3.7',
        'BR-83': 'UC-10, Nhóm 3.3.7',
        'BR-84': 'UC-10, Nhóm 3.3.7',
        'BR-85': 'UC-11, Nhóm 3.3.8',
        'BR-86': 'UC-11, Nhóm 3.3.8',
        'BR-87': 'UC-11, Nhóm 3.3.8',
        'BR-88': 'UC-11, UC-12, Nhóm 3.3.8',
        'BR-89': 'UC-10, Nhóm 3.3.9',
        'BR-90': 'UC-10, Nhóm 3.3.9',
        'BR-91': 'UC-10, Nhóm 3.3.9',
        'BR-92': 'UC-10, Nhóm 3.3.9'
    }

    # Rename BR-11B to BR-15B for better standard? Actually, let's just keep BR-11B but change its apply rule.
    # Replace the Áp dụng lines
    
    def replacer(match):
        br_id = match.group(1)
        if br_id in mapping:
            return f"### {br_id}{match.group(2)}*   **Áp dụng**: {mapping[br_id]}\n"
        return match.group(0)

    # regex to match: ### BR-XX: Title\n(any non-### lines)*?*   **Áp dụng**: ...\n
    pattern = re.compile(r'### (BR-[0-9]+B?)(.*?)\*   \*\*Áp dụng\*\*: .*?\n', re.DOTALL)
    
    new_content = pattern.sub(replacer, content)

    # Note: rename BR-11B to BR-16 since 15 is used? Just leave it as BR-11B for now.
    
    # Let's also update the "Ngày cập nhật"
    new_content = re.sub(r'> Ngày cập nhật: .*?\n', '> Ngày cập nhật: 08/07/2026 — Đồng bộ với Use Case mới (16 UC) và BPMN 3.3.x\n', new_content)

    with open('d:\\doanWEDKD\\docs\\12_Business_RulesNew.md', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Done updating business rules.")

if __name__ == '__main__':
    process_file()
