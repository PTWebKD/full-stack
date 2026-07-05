# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"d:\doanWEDKD\docs")
from bpmn_helpers import Diagram, TASK, TASK_SYS, TASK_CALL, START_NONE, START_MSG, END_EVT, CATCH_MSG, GATEWAY

d = Diagram("BPMN - 3.3.3 Delivery", "bpmn-333-delivery", page_w=1700)

d.add_pool("pool_member", "Member", 40, 380)
d.add_pool("pool_gymowner", "GymOwner", 460, 380)
d.add_pool("pool_3rdparty", "Đơn vị vận chuyển (Hộp đen — Bên thứ 3)", 880, 200)
d.add_pool("pool_system", "Hệ thống FitFuel+", 1120, 700)

P = "pool_member"
d.shape("m_start", P, START_NONE, "Bắt đầu", 60, 90, 30, 30)
d.shape("m_choose", P, TASK, "Chọn\n'Giao hàng'", 150, 65, 160, 100)
d.shape("m_address", P, TASK, "Chọn\nSHIPPING_ADDRESSES", 350, 65, 190, 100)
d.shape("m_pay", P, TASK_CALL, "[Call Activity]\nThanh toán online\n(SP-01)", 580, 65, 200, 100)
d.shape("m_track", P, TASK, "Theo dõi status\ntrên Web App", 820, 65, 180, 100)
d.shape("m_gw", P, GATEWAY, "Muốn hủy đơn?\n(khi pending/\npreparing)", 1050, 90, 50, 50)
d.shape("m_cancel", P, TASK, "Hủy đơn", 1140, 40, 150, 90)
d.shape("m_end1", P, END_EVT, "Kết thúc", 1330, 75, 36, 36)
d.shape("m_wait", P, TASK, "Chờ\nnhận hàng", 1140, 170, 150, 90)
d.shape("m_receive", P, TASK, "Nhận hàng\ntừ Shipper", 1330, 170, 170, 90)
d.shape("m_done", P, TASK, "Done", 1540, 170, 130, 90)
d.shape("m_end2", P, END_EVT, "Kết thúc", 1710, 205, 36, 36)

d.edge("m_e1", "m_start", "m_choose")
d.edge("m_e2", "m_choose", "m_address")
d.edge("m_e3", "m_address", "m_pay")
d.edge("m_e5", "m_pay", "m_track")
d.edge("m_e6", "m_track", "m_gw")
d.edge("m_e7", "m_gw", "m_cancel", "Có", exit=(0.5, 0))
d.edge("m_e9", "m_cancel", "m_end1")
d.edge("m_e10", "m_gw", "m_wait", "Không", exit=(0.5, 1))
d.edge("m_e11", "m_wait", "m_receive")
d.edge("m_e12", "m_receive", "m_done")
d.edge("m_e13", "m_done", "m_end2")

Pg = "pool_gymowner"
d.shape("g_start", Pg, START_MSG, "Nhận đơn mới tại\n/gym-owner/orders", 60, 490, 30, 30)
d.shape("g_prepare", Pg, TASK, "Chuẩn bị\nsản phẩm", 150, 465, 170, 100)
d.shape("g_confirm", Pg, TASK, "Xác nhận\nsẵn sàng", 360, 465, 170, 100)
d.shape("g_activate", Pg, TASK_CALL, "Kích hoạt Subprocess:\nQuy trình giao hàng\nbên thứ 3 (+)", 570, 465, 220, 100)
d.shape("g_end", Pg, END_EVT, "Kết thúc\n(đã bàn giao,\nhệ thống theo dõi tiếp)", 830, 490, 36, 36)

d.shape("g_start2", Pg, START_MSG, "Nhận cảnh báo\ngiao hàng thất bại\ntừ hệ thống", 60, 620, 30, 30)
d.shape("g_intervene", Pg, TASK, "Can thiệp thủ công,\nkiểm tra tình trạng\nđơn hàng", 150, 595, 200, 100)
d.shape("g_cancelship", Pg, TASK, "Bấm hủy đơn\n(giao hàng thất bại)", 400, 595, 220, 100)
d.shape("g_endcancel", Pg, END_EVT, "Kết thúc\n(đã hủy)", 660, 630, 36, 36)

d.edge("g_e1", "g_start", "g_prepare")
d.edge("g_e2", "g_prepare", "g_confirm")
d.edge("g_e3", "g_confirm", "g_activate")
d.edge("g_e4", "g_activate", "g_end")
d.edge("g_e5", "g_start2", "g_intervene")
d.edge("g_e6", "g_intervene", "g_cancelship")
d.edge("g_e7", "g_cancelship", "g_endcancel")

Psp = "pool_3rdparty"
d.shape("sp_start", Psp, START_MSG, "Nhận\nbàn giao", 60, 930, 30, 30)
d.shape("sp_task", Psp, TASK, "QUY TRÌNH GIAO HÀNG BÊN THỨ 3 (+)\n(GHN/Ahamove: điều phối shipper →\nlấy hàng → giao hàng → gửi webhook báo kết quả)",
        150, 900, 420, 100)
d.shape("sp_end", Psp, END_EVT, "Kết thúc", 620, 930, 36, 36)

d.edge("sp_e1", "sp_start", "sp_task")
d.edge("sp_e2", "sp_task", "sp_end")

Ps = "pool_system"
d.shape("h_start1", Ps, START_MSG, "Nhận tín hiệu\ntừ GymOwner", 60, 1170, 30, 30)
d.shape("h_preparing", Ps, TASK_SYS, "Đổi status\n= 'preparing'", 150, 1145, 180, 90)
d.shape("h_end1", Ps, END_EVT, "Kết thúc", 200, 1260, 36, 36)

d.shape("h_start2", Ps, START_MSG, "Nhận webhook\ntừ Subprocess (+)", 60, 1300, 30, 30)
d.shape("h_gwresult", Ps, GATEWAY, "Webhook lần này\nbáo trạng thái gì?", 180, 1400, 50, 50)
d.shape("h_shipped", Ps, TASK_SYS, "Đổi status\n= 'shipped'", 360, 1150, 190, 90)
d.shape("h_end_shipped", Ps, END_EVT, "Kết thúc\n(chờ webhook\nlần sau)", 600, 1185, 36, 36)
d.shape("h_delivering", Ps, TASK_SYS, "Đổi status\n= 'delivering'", 320, 1280, 190, 90)
d.shape("h_end_delivering", Ps, END_EVT, "Kết thúc\n(chờ webhook\nlần sau)", 560, 1315, 36, 36)
d.shape("h_donestat", Ps, TASK_SYS, "Đổi status\n= 'done'", 320, 1410, 170, 90)
d.shape("h_notify", Ps, TASK_SYS, "Gửi NOTIFICATIONS\ncho Member", 530, 1410, 190, 90)
d.shape("h_end2", Ps, END_EVT, "Kết thúc\n(đã giao xong)", 760, 1445, 36, 36)
d.shape("h_notifyfail", Ps, TASK_SYS, "Gửi cảnh báo giao hàng\nthất bại cho GymOwner", 320, 1540, 220, 100)
d.shape("h_end3", Ps, END_EVT, "Kết thúc\n(báo lỗi)", 590, 1575, 36, 36)

d.edge("h_e1", "h_start1", "h_preparing")
d.edge("h_e2", "h_preparing", "h_end1")
d.edge("h_e3", "h_start2", "h_gwresult")
d.edge("h_e4", "h_gwresult", "h_shipped", "shipped", exit=(0.5, 0), entry=(0, 0.5))
d.edge("h_e4b", "h_shipped", "h_end_shipped")
d.edge("h_e5", "h_gwresult", "h_delivering", "delivering", exit=(1, 0.5), entry=(0, 0.5))
d.edge("h_e5b", "h_delivering", "h_end_delivering")
d.edge("h_e6", "h_gwresult", "h_donestat", "done", entry=(0, 0.5))
d.edge("h_e6b", "h_donestat", "h_notify")
d.edge("h_e7", "h_notify", "h_end2")
d.edge("h_e8", "h_gwresult", "h_notifyfail", "thất bại / gián đoạn\n(lỗi giao hàng, thất lạc)", exit=(0.5, 1), entry=(0, 0.5))
d.edge("h_e9", "h_notifyfail", "h_end3")

d.shape("sys_recvpay", Ps, START_MSG, "Nhận thanh toán\nthành công", 60, 1700, 30, 30)
d.shape("sys_createorder", Ps, TASK_SYS, "Tạo đơn,\nstatus='pending'", 130, 1675, 200, 90)
d.shape("sys_end_createorder", Ps, END_EVT, "Kết thúc", 360, 1710, 36, 36)

d.shape("sys_recvcancel", Ps, START_MSG, "Nhận yêu cầu\nhủy đơn (Member)", 480, 1700, 30, 30)
d.shape("sys_refund_member", Ps, TASK_SYS, "FitCoin mở khóa\n& hoàn tiền", 550, 1675, 210, 90)
d.shape("sys_end_refund1", Ps, END_EVT, "Kết thúc", 790, 1710, 36, 36)

d.shape("sys_recvcancel2", Ps, START_MSG, "Nhận yêu cầu hủy đơn\n(GymOwner)", 900, 1700, 30, 30)
d.shape("sys_cancelstatus", Ps, TASK_SYS, "Chuyển status='cancelled',\nhoàn tiền tự động cho Member", 970, 1675, 260, 90)
d.shape("sys_end_refund2", Ps, END_EVT, "Kết thúc", 1260, 1710, 36, 36)

d.edge("sys_e1", "sys_recvpay", "sys_createorder")
d.edge("sys_e2", "sys_createorder", "sys_end_createorder")
d.edge("sys_e3", "sys_recvcancel", "sys_refund_member")
d.edge("sys_e4", "sys_refund_member", "sys_end_refund1")
d.edge("sys_e5", "sys_recvcancel2", "sys_cancelstatus")
d.edge("sys_e6", "sys_cancelstatus", "sys_end_refund2")

d.set_flow_label("3.3.3 — Message flows")
d.msg("msg1", "m_pay", "sys_recvpay")
d.msg("msg2", "sys_end_createorder", "g_start")
d.msg("msg3", "g_confirm", "h_start1")
d.msg("msg4", "g_activate", "sp_start")
d.msg("msg5", "sp_task", "h_start2")
d.msg("msg6", "h_notify", "m_track")
d.msg("msg7", "h_notifyfail", "g_start2")
d.msg("msg8", "m_cancel", "sys_recvcancel")
d.msg("msg9", "g_cancelship", "sys_recvcancel2")

d.write(r"d:\doanWEDKD\docs\BPMN_333_Delivery.drawio", page_h=1850)
POOL_DISPLAY = {
    "pool_member": "Member",
    "pool_gymowner": "GymOwner",
    "pool_3rdparty": "Đơn vị vận chuyển (Bên thứ 3)",
    "pool_system": "Hệ thống FitFuel+",
}
d.write_guide(r"d:\doanWEDKD\docs\BPMN_333_Delivery_MessageFlow_Guide.md", "3.3.3 Delivery & Quản lý đơn hàng", POOL_DISPLAY)
