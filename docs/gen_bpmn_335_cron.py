# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"d:\doanWEDKD\docs")
from bpmn_helpers import Diagram, TASK, TASK_SYS, START_TIMER, END_EVT, GATEWAY, GATEWAY_PARALLEL

d = Diagram("System Flowchart - Cron tao Recommendation", "flowchart-335-cron", page_w=1750)
d.add_pool("pool_cron", "CRON JOB — Tạo Recommendation (06:00 hằng ngày)", 40, 900)
P = "pool_cron"

d.shape("c_start", P, START_TIMER, "CRON START\n06:00", 60, 90, 30, 30)
d.shape("c_loadusers", P, TASK_SYS, "Lấy danh sách USERS có\nGYM_MEMBERSHIPS.status = 'active'", 150, 60, 260, 100)
d.shape("c_foreach", P, GATEWAY, "Còn member\nchưa xử lý?", 470, 85, 50, 50)
d.shape("c_end", P, END_EVT, "CRON END", 580, 55, 36, 36)
d.shape("c_loaddata", P, TASK_SYS, "Lấy end_date, last_checkin,\nplan_id, purchase_history", 570, 130, 240, 100)

d.edge("c_e1", "c_start", "c_loadusers")
d.edge("c_e2", "c_loadusers", "c_foreach")
d.edge("c_e3", "c_foreach", "c_end", "Hết\ndanh sách", exit=(0.5, 0))
d.edge("c_e4", "c_foreach", "c_loaddata", "Còn", exit=(0.5, 1))

d.shape("c_fork", P, GATEWAY_PARALLEL, "", 870, 155, 50, 50)
d.shape("c_r1", P, TASK_SYS, "Rule 1: end_date <= 7 ngày?\n→ Có: type='renew_reminder', HIGH", 970, 70, 320, 80)
d.shape("c_r2", P, TASK_SYS, "Rule 2: chưa check-in >= 14 ngày?\n→ Có: type='inactive_alert', MEDIUM", 970, 165, 320, 80)
d.shape("c_r3", P, TASK_SYS, "Rule 3: end_date quá 1-3 ngày?\n→ Có: type='renew_reminder', HIGH", 970, 260, 320, 80)
d.shape("c_r4", P, TASK_SYS, "Rule 4: end_date quá > 3 ngày?\n→ Có: type='renew_reminder', HIGH", 970, 355, 320, 80)
d.shape("c_r5", P, TASK_SYS, "Rule 5: check-in >= 4/tuần + Gói Tháng?\n→ Có: type='upsell_plan', MEDIUM", 970, 450, 320, 80)
d.shape("c_r6", P, TASK_SYS, "Rule 6: mua nutrition >= 3 lần/tuần?\n→ Có: type='upsell_nutrition', LOW", 970, 545, 320, 80)
d.shape("c_join", P, GATEWAY_PARALLEL, "", 1350, 335, 50, 50)

d.edge("c_e5", "c_loaddata", "c_fork")
d.edge("c_e6", "c_fork", "c_r1")
d.edge("c_e7", "c_fork", "c_r2")
d.edge("c_e8", "c_fork", "c_r3")
d.edge("c_e9", "c_fork", "c_r4")
d.edge("c_e10", "c_fork", "c_r5")
d.edge("c_e11", "c_fork", "c_r6")
d.edge("c_e12", "c_r1", "c_join")
d.edge("c_e13", "c_r2", "c_join")
d.edge("c_e14", "c_r3", "c_join")
d.edge("c_e15", "c_r4", "c_join")
d.edge("c_e16", "c_r5", "c_join")
d.edge("c_e17", "c_r6", "c_join")

d.shape("c_gwdup", P, GATEWAY, "Với mỗi candidate:\nđã có bản ghi pending\ntrong 7 ngày gần nhất?", 1450, 335, 50, 50)
d.shape("c_skip", P, TASK, "Bỏ qua,\nkhông tạo trùng lặp", 1450, 460, 190, 90)
d.shape("c_insert", P, TASK_SYS, "INSERT RECOMMENDATIONS\n(member_id, type, priority,\nstatus='pending')", 1160, 700, 250, 100)

d.edge("c_e18", "c_join", "c_gwdup")
d.edge("c_e19", "c_gwdup", "c_skip", "Có", exit=(0.5, 1))
d.edge("c_e20", "c_gwdup", "c_insert", "Không", exit=(0.5, 1), entry=(1, 0.5))
d.edge("c_e21", "c_skip", "c_foreach", "(lặp lại vòng FOR EACH)", entry=(1, 0.5))
d.edge("c_e22", "c_insert", "c_foreach", "(lặp lại vòng FOR EACH)", entry=(0.5, 1))

d.write(r"d:\doanWEDKD\docs\BPMN_335_CronRecommendation.drawio", page_h=940)
d.write_guide(r"d:\doanWEDKD\docs\BPMN_335_CronRecommendation_MessageFlow_Guide.md",
              "3.3.5 Cron Recommendation", {"pool_cron": "CRON JOB"})
