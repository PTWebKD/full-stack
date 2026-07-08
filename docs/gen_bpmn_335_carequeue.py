# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"d:\doanWEDKD\docs")
from bpmn_helpers import Diagram, TASK, TASK_SYS, TASK_CALL, START_NONE, START_MSG, START_TIMER, END_EVT, GATEWAY

d = Diagram("BPMN - 3.3.5 Care Queue Workflow", "bpmn-335-carequeue", page_w=2150)

d.add_pool("pool_gymowner", "GymOwner / Nhân viên", 40, 520)
d.add_pool("pool_member", "Member (Passive)", 600, 260)
d.add_pool("pool_system", "Hệ thống FitFuel+", 900, 505)

P = "pool_gymowner"
d.shape("g_start", P, START_NONE, "Bắt đầu", 60, 90, 30, 30)
d.shape("g_open", P, TASK, "Vào\n/gym-owner/care-queue", 150, 65, 200, 100)
d.shape("g_viewlist", P, TASK, "Xem danh sách ưu tiên cao\ntrước (HIGH → MEDIUM → LOW)", 400, 65, 220, 100)
d.shape("g_selectrec", P, TASK, "Chọn 1 recommendation\ncần xử lý", 670, 65, 190, 100)
d.shape("g_readinfo", P, TASK, "Đọc thông tin: tên member,\nlý do, gợi ý hành động", 910, 65, 210, 100)
d.shape("g_action", P, TASK, "Gửi tin nhắn/email\nnhắc nhở qua hệ thống", 1170, 65, 200, 110)
d.shape("g_confirmbtn", P, TASK, "Bấm\nGhi nhận kết quả", 1420, 75, 170, 100)
d.shape("g_inputresult", P, TASK, "Nhập: hành động đã làm,\nkết quả (renewed/declined/\nunreachable/other), ghi chú", 1420, 190, 220, 110)
d.shape("g_gwunreach", P, GATEWAY, "Kết quả =\nKhông liên lạc\nđược?", 1680, 220, 50, 50)
d.shape("g_holdrec", P, TASK, "Tạm đóng chỉ thị,\nhẹn tạo lại yêu cầu\nmới sau 3 ngày", 1760, 60, 210, 100)
d.shape("g_endhold", P, END_EVT, "Kết thúc\n(tạm đóng)", 2010, 95, 36, 36)
d.shape("g_end", P, END_EVT, "Kết thúc", 1780, 300, 36, 36)

d.edge("g_e1", "g_start", "g_open")
d.edge("g_e2", "g_open", "g_viewlist")
d.edge("g_e3", "g_viewlist", "g_selectrec")
d.edge("g_e4", "g_selectrec", "g_readinfo")
d.edge("g_e5", "g_readinfo", "g_action")
d.edge("g_e6", "g_action", "g_confirmbtn")
d.edge("g_e7", "g_confirmbtn", "g_inputresult")
d.edge("g_e8", "g_inputresult", "g_gwunreach")
d.edge("g_e8b", "g_gwunreach", "g_holdrec", "Có", exit=(0.5, 0))
d.edge("g_e8c", "g_holdrec", "g_endhold")
d.edge("g_e8d", "g_gwunreach", "g_end", "Không", exit=(0.5, 1))

Pm = "pool_member"
d.shape("m_start", Pm, START_MSG, "Nhận SMS / in-app:\nnhắc gia hạn hoặc\ncảnh báo không hoạt động", 60, 640, 30, 30)
d.shape("m_gw", Pm, GATEWAY, "Tự\nxử lý?", 180, 665, 50, 50)
d.shape("m_selfserve", Pm, TASK, "Gia hạn /\ncheck-in", 280, 640, 160, 100)
d.shape("m_end1", Pm, END_EVT, "Kết thúc", 710, 675, 36, 36)
d.shape("m_wait", Pm, TASK, "Nhận tin nhắn/email\nnhắc nhở", 280, 760, 190, 90)
d.shape("m_end2", Pm, END_EVT, "Kết thúc", 510, 795, 36, 36)

d.edge("m_e1", "m_start", "m_gw")
d.edge("m_e2", "m_gw", "m_selfserve", "Có")
d.edge("m_e3", "m_selfserve", "m_end1")
d.edge("m_e5", "m_gw", "m_wait", "Không", exit=(0.5, 1))
d.edge("m_e6", "m_wait", "m_end2")

Ps = "pool_system"
d.shape("cron_start", Ps, START_TIMER, "Cron 06:00\nhằng ngày", 1720, 990, 30, 30)
d.shape("cron_call", Ps, TASK_CALL, "[Call Activity]\nTạo Recommendation\n(BPMN_335_CronRecommendation)", 1790, 965, 240, 100)
d.shape("cron_end", Ps, END_EVT, "Kết thúc\n(Recommendation\nđã sẵn sàng)", 2060, 1000, 36, 36)
d.edge("cron_e1", "cron_start", "cron_call")
d.edge("cron_e2", "cron_call", "cron_end")

d.shape("s_recvrenew", Ps, START_MSG, "Nhận sự kiện\ngia hạn", 60, 970, 30, 30)
d.shape("s_findrec1", Ps, TASK_SYS, "Tìm RECOMMENDATIONS\npending của member", 150, 945, 210, 100)
d.shape("s_handled1", Ps, TASK_SYS, "Chuyển status = 'handled'\n(tự động, không cần nhân viên)", 400, 945, 240, 100)
d.shape("s_end1", Ps, END_EVT, "Kết thúc", 680, 980, 36, 36)

d.shape("s_recvcheckin", Ps, START_MSG, "Nhận sự kiện\ncheck-in", 60, 1100, 30, 30)
d.shape("s_updatelast", Ps, TASK_SYS, "Cập nhật\nlast_checkin", 150, 1075, 180, 100)
d.shape("s_gw", Ps, GATEWAY, "Có 'inactive_alert'\npending?", 380, 1100, 50, 50)
d.shape("s_handled2", Ps, TASK_SYS, "Chuyển status\n= 'handled'", 470, 1075, 190, 100)
d.shape("s_end2", Ps, END_EVT, "Kết thúc", 700, 1110, 36, 36)
d.shape("s_end3", Ps, END_EVT, "Kết thúc", 480, 1200, 36, 36)

d.edge("s_e1", "s_recvrenew", "s_findrec1")
d.edge("s_e2", "s_findrec1", "s_handled1")
d.edge("s_e3", "s_handled1", "s_end1")
d.edge("s_e4", "s_recvcheckin", "s_updatelast")
d.edge("s_e5", "s_updatelast", "s_gw")
d.edge("s_e6", "s_gw", "s_handled2", "Có")
d.edge("s_e7", "s_handled2", "s_end2")
d.edge("s_e8", "s_gw", "s_end3", "Không", exit=(0.5, 1))

d.shape("s_recvresult", Ps, START_MSG, "Nhận kết quả\nchăm sóc từ GymOwner", 60, 1290, 30, 30)
d.shape("s_savelog", Ps, TASK_SYS, "Lưu\nMEMBER_CARE_LOGS", 150, 1265, 190, 100)
d.shape("s_handled3", Ps, TASK_SYS, "RECOMMENDATIONS.status\n= 'handled'", 400, 1265, 200, 100)
d.shape("s_end4", Ps, END_EVT, "Kết thúc", 660, 1300, 36, 36)

d.edge("s_e9", "s_recvresult", "s_savelog")
d.edge("s_e10", "s_savelog", "s_handled3")
d.edge("s_e11", "s_handled3", "s_end4")

d.set_flow_label("3.3.5 Care Queue — Message flows")
d.msg("msg1", "m_selfserve", "s_recvrenew")
d.msg("msg2", "g_action", "m_wait")
d.msg("msg3", "g_end", "s_recvresult")

d.write(r"d:\doanWEDKD\docs\BPMN_335_CareQueueWorkflow.drawio", page_h=1450)
POOL_DISPLAY = {
    "pool_gymowner": "GymOwner / Nhân viên",
    "pool_member": "Member (Passive)",
    "pool_system": "Hệ thống FitFuel+",
}
d.write_guide(r"d:\doanWEDKD\docs\BPMN_335_CareQueueWorkflow_MessageFlow_Guide.md",
              "3.3.5 Care Queue Workflow", POOL_DISPLAY)
