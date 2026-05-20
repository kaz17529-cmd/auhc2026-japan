import re

with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_tbody = False

for line in lines:
    if '<th><span class="en">Progress</span><span class="ja">進捗</span></th>' in line:
        new_lines.append(line)
        new_lines.append('                            <th><span class="en">Comments</span><span class="ja">コメント</span></th>\n')
        continue
        
    if '<span class="status-done"><span class="en">Confirmed (May 2)</span><span' in line:
        # We need to replace the progress with 'Done' and add comment
        new_lines.append('                            <td><span class="status-done"><span class="en">Done</span><span class="ja">完了</span></span></td>\n')
        new_lines.append('                            <td><span class="en">Confirmed (May 2)</span><span class="ja">5/2(日)確定</span></td>\n')
        continue
    if 'class="ja">5/2(日)確定</span></span></td>' in line:
        # Skip the second line of the previous progress
        continue
        
    if '<span class="status-doing"><span class="en">Requested to Fed (4/26)</span><span class="ja">4/26 連盟リクエスト中</span></span></td>' in line:
        new_lines.append('                            <td><span class="status-doing"><span class="en">In Progress</span><span class="ja">進行中</span></span></td>\n')
        new_lines.append('                            <td><span class="en">Requested to Fed (4/26)</span><span class="ja">4/26 連盟リクエスト中</span></td>\n')
        continue
        
    if '<span class="status-doing"><span class="en">Need to decide 2 or 3 per room</span><span class="ja">2人 or 3人/部屋か決める必要あり</span></span></td>' in line:
        new_lines.append('                            <td><span class="status-doing"><span class="en">In Progress</span><span class="ja">進行中</span></span></td>\n')
        new_lines.append('                            <td><span class="en">Need to decide 2 or 3 per room</span><span class="ja">2人 or 3人/部屋か決める必要あり</span></td>\n')
        continue
        
    if 'class="ja">進行中</span></span></td>' in line:
        new_lines.append(line)
        new_lines.append('                            <td></td>\n')
        continue
    
    if '<td><span class="status-tbd">TBD</span></td>' in line:
        # Check if this is the LAST TBD in the row. Since rows have deadline and progress TBD.
        # It's tricky to do by line if there are multiple.
        pass

    new_lines.append(line)

with open("index.html", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
