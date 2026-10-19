# Dựng docs/tai-lieu-tham-khao.md từ docs/noi-dung-goc.md (file gốc giữ nguyên, vì content.js trích theo số dòng).
import re, html, sys
src = open('docs/noi-dung-goc.md', encoding='utf-8').read().split('\n')
L = lambda a, b: src[a-1:b]  # dòng a..b (1-based, gồm cả hai đầu)

def fix(line):
    line = re.sub(r'\*\*&#x20;\*\*&#x([0-9A-Fa-f]+);', lambda m: ' ' + chr(int(m.group(1), 16)), line)
    line = html.unescape(line).replace('\xa0', ' ')
    line = re.sub(r'_\*\*(.+?)\*\*_', r'**\1**', line)
    line = line.replace('là là cuộc', 'là cuộc')
    return line.rstrip()

out = []
def add(*lines): out.extend(lines)
def body(a, b): add(*[fix(l) for l in L(a, b)])

add('# Giai đoạn 1 · 1930–1935: Phong trào cách mạng 1930–1931 và khôi phục phong trào 1932–1935', '')
add('## 1. Phong trào cách mạng 1930–1931', '', '### Bối cảnh'); body(7, 18)
add('### Diễn biến năm 1930'); body(22, 53)
add('### Ý nghĩa'); body(55, 65)
add('### Xô viết Nghệ – Tĩnh'); body(69, 87)
add('## 2. Luận cương chính trị của Đảng Cộng sản Đông Dương (10-1930)', ''); body(91, 96)
add('### Nội dung chính của Luận cương'); body(99, 117)
add('### Đánh giá Luận cương'); body(121, 131)
add('## 3. Khôi phục tổ chức và phong trào, Đại hội Đảng lần thứ nhất (3-1935)', ''); body(135, 145)
add('### Đấu tranh kiên cường trong nhà tù đế quốc'); body(149, 151)
add('### Hoạt động của các lãnh tụ và khôi phục phong trào'); body(155, 165)

add('', '# Giai đoạn 2 · 1936–1939: Phong trào đấu tranh dân chủ', '')
for l in L(258, 327):
    l = fix(l)
    if l.startswith('### '): l = '## ' + l[4:]
    elif l.startswith('#### '): l = '### ' + l[5:]
    elif l.startswith('**III.'): l = '## ' + l.strip('*')
    add(l)

add('', '# Giai đoạn 3 · 1939–1945: Giải phóng dân tộc dẫn đến thắng lợi của Cách mạng tháng Tám', '')
for l in L(333, 484):
    l = fix(l)
    m = re.fullmatch(r'\*\*(\d)\. (.+?)\*\*', l)
    if m: l = f'## {m.group(1)}. {m.group(2)}'
    elif re.fullmatch(r'\*\*[^*]{4,120}[^.*]\*\*', l): l = '### ' + l.strip('*')
    add(l)

text = '\n'.join(out)
text = re.sub(r'\n{3,}', '\n\n', text).strip() + '\n'
text = re.sub(r'(?m)^(#{1,3} .+)\n(?!\n)', r'\1\n\n', text)
open('docs/tai-lieu-tham-khao.md', 'w', encoding='utf-8').write(text)
print(len(text.split('\n')), 'dòng')
