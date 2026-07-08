# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"d:\doanWEDKD\docs")
from bpmn_helpers import Diagram, TASK, TASK_SYS, TASK_CALL, START_NONE, START_MSG, END_EVT, GATEWAY, CATCH_MSG

d = Diagram("BPMN - 3.3.2 Dinh duong noi bo", "bpmn-332-nutrition", page_w=2450)

d.add_pool("pool_member", "Member", 40, 300)
d.add_pool("pool_guest", "Guest", 345, 310)
d.add_pool("pool_gymowner", "GymOwner (quản lý đơn qua web)", 655, 300)
d.add_pool("pool_system", "Hệ thống FitFuel+", 955, 330)

# ================= LUỒNG B: MEMBER ĐẶT TRƯỚC (PRE-ORDER) =================
P = "pool_member"
d.shape("b_start", P, START_NONE, "Bắt đầu", 60, 90, 30, 30)
d.shape("b_finish", P, TASK, "Member hoàn thành\nbuổi tập", 150, 65, 180, 100)
d.shape("b_waitsuggest", P, CATCH_MSG, "Chờ gợi ý\ntừ AI Engine", 390, 90, 40, 40)
d.shape("b_viewsuggest", P, TASK, "Xem 3 sản phẩm\nAI Engine gợi ý", 460, 65, 180, 100)
d.shape("b_gw", P, GATEWAY, "Muốn đặt\ntrước?", 700, 90, 50, 50)
d.shape("b_end1", P, END_EVT, "Kết thúc", 780, 170, 36, 36)
d.shape("b_choose", P, TASK, "Chọn sản phẩm\n& số lượng", 800, 65, 180, 100)
d.shape("b_pay", P, TASK_CALL, "[Call Activity]\nThanh toán online\n(SP-01)", 1030, 65, 200, 100)
d.shape("b_end2", P, END_EVT, "Kết thúc", 1280, 100, 36, 36)

d.edge("b_e1", "b_start", "b_finish")
d.edge("b_e2", "b_finish", "b_waitsuggest")
d.edge("b_e2b", "b_waitsuggest", "b_viewsuggest")
d.edge("b_e3", "b_viewsuggest", "b_gw")
d.edge("b_e4", "b_gw", "b_end1", "Không", exit=(0.5, 1))
d.edge("b_e5", "b_gw", "b_choose", "Có")
d.edge("b_e6", "b_choose", "b_pay")
d.edge("b_e8", "b_pay", "b_end2")

# ================= LUỒNG C: GUEST TỰ ĐẶT HÀNG ONLINE =================
Pg = "pool_guest"
d.shape("g_start", Pg, START_NONE, "Bắt đầu", 60, 410, 30, 30)
d.shape("g_browse", Pg, TASK, "Duyệt danh mục\nsản phẩm dinh dưỡng", 150, 385, 190, 100)
d.shape("g_addcart", Pg, TASK, "Chọn sản phẩm,\nthêm giỏ hàng", 380, 385, 180, 100)
d.shape("g_checkout", Pg, TASK, "Checkout", 600, 385, 150, 100)
d.shape("g_otp", Pg, TASK_CALL, "[Call Activity]\nXác thực OTP\n(SP-02)", 790, 385, 190, 100)
d.shape("g_gw1", Pg, GATEWAY, "SP-02\nkết quả?", 1020, 410, 50, 50)
d.shape("g_notify1", Pg, TASK, "Hiển thị\nthông báo", 1110, 360, 170, 90)
d.shape("g_end1", Pg, END_EVT, "Kết thúc", 1330, 395, 36, 36)
d.shape("g_pay", Pg, TASK_CALL, "[Call Activity]\nThanh toán (SP-01)", 1110, 470, 190, 100)
d.shape("g_gw2", Pg, GATEWAY, "SP-01\nkết quả?", 1350, 510, 50, 50)
d.shape("g_notify2", Pg, TASK, "Thông báo\nthất bại", 1440, 460, 170, 90)
d.shape("g_end2", Pg, END_EVT, "Kết thúc", 1660, 495, 36, 36)
d.shape("g_end3", Pg, END_EVT, "Kết thúc", 1440, 595, 36, 36)

d.edge("g_e1", "g_start", "g_browse")
d.edge("g_e2", "g_browse", "g_addcart")
d.edge("g_e3", "g_addcart", "g_checkout")
d.edge("g_e4", "g_checkout", "g_otp")
d.edge("g_e5", "g_otp", "g_gw1")
d.edge("g_e6", "g_gw1", "g_notify1", "BLOCKED /\nFAILED", exit=(0.5, 0))
d.edge("g_e7", "g_notify1", "g_end1")
d.edge("g_e8", "g_gw1", "g_pay", "SUCCESS", exit=(0.5, 1))
d.edge("g_e9", "g_pay", "g_gw2")
d.edge("g_e10", "g_gw2", "g_notify2", "FAILED", exit=(0.5, 0))
d.edge("g_e11", "g_notify2", "g_end2")
d.edge("g_e12", "g_gw2", "g_end3", "SUCCESS", exit=(0.5, 1))

# ================= XỬ LÝ PRE-ORDER / GUEST ORDER (GymOwner quản lý qua web) =================
Ps = "pool_gymowner"
d.shape("s_start", Ps, START_MSG, "Nhận thông báo\nđơn pre-order /\nGuest mới", 60, 700, 30, 30)
d.shape("s_prepare", Ps, TASK, "Chuẩn bị\nsản phẩm", 150, 675, 170, 100)
d.shape("s_gwstock", Ps, GATEWAY, "Còn hàng\nthực tế?", 380, 700, 50, 50)
d.shape("s_cancelorder", Ps, TASK, "Hủy đơn, hoàn FitCoin /\ntiền đã thanh toán", 470, 820, 220, 100)
d.shape("s_endcancel", Ps, END_EVT, "Kết thúc\n(đã hủy)", 730, 855, 36, 36)
d.shape("s_ready", Ps, TASK, "Chuyển\nstatus = 'ready'\n(trên web)", 480, 675, 180, 100)
d.shape("s_done", Ps, TASK, "Chuyển\nstatus = 'done'\n(sau khi khách nhận hàng)", 700, 675, 210, 100)
d.shape("s_end", Ps, END_EVT, "Kết thúc", 950, 710, 36, 36)

d.edge("s_e1", "s_start", "s_prepare")
d.edge("s_e2", "s_prepare", "s_gwstock")
d.edge("s_e2b", "s_gwstock", "s_cancelorder", "Không\n(hết hàng thực tế)", exit=(0.5, 1))
d.edge("s_e2c", "s_cancelorder", "s_endcancel")
d.edge("s_e3", "s_gwstock", "s_ready", "Có")
d.edge("s_e3b", "s_ready", "s_done")
d.edge("s_e6", "s_done", "s_end")

# ================= HỆ THỐNG =================
Psys = "pool_system"
d.shape("sys_recv_suggest", Psys, START_MSG, "Nhận yêu cầu\ngợi ý sản phẩm", 60, 1015, 30, 30)
d.shape("sys_suggest", Psys, TASK_SYS, "Gợi ý 3 sản phẩm\ntừ AI Engine", 130, 995, 200, 85)
d.shape("sys_suggest_end", Psys, END_EVT, "Kết thúc", 360, 1030, 36, 36)

d.shape("sys_recv_b", Psys, START_MSG, "Nhận thanh toán\nthành công (pre-order)", 450, 1015, 30, 30)
d.shape("sys_create_b", Psys, TASK_SYS, "Tạo NUTRITION_ORDERS\nstatus='pending'\norder_type='pre_order'", 520, 990, 220, 90)
d.shape("sys_end_b", Psys, END_EVT, "Kết thúc", 770, 1025, 36, 36)

d.shape("sys_recv_g", Psys, START_MSG, "Nhận thanh toán\nthành công (Guest order)", 860, 1015, 30, 30)
d.shape("sys_create_g", Psys, TASK_SYS, "Tạo NUTRITION_ORDERS\nstatus='pending', gắn theo\nsố điện thoại đã xác thực", 930, 990, 240, 90)
d.shape("sys_end_g", Psys, END_EVT, "Kết thúc", 1210, 1025, 36, 36)

d.edge("sys_e1", "sys_recv_suggest", "sys_suggest")
d.edge("sys_e2", "sys_suggest", "sys_suggest_end")
d.edge("sys_e3", "sys_recv_b", "sys_create_b")
d.edge("sys_e4", "sys_create_b", "sys_end_b")
d.edge("sys_e5", "sys_recv_g", "sys_create_g")
d.edge("sys_e6", "sys_create_g", "sys_end_g")

d.shape("h_start", Psys, START_MSG, "Nhận event\nstatus thay đổi", 60, 1105, 30, 30)
d.shape("h_gw1", Psys, GATEWAY, "status\n= 'done'?", 150, 1130, 50, 50)
d.shape("h_end1", Psys, END_EVT, "Kết thúc", 240, 1215, 36, 36)
d.shape("h_deduct", Psys, TASK_SYS, "Trừ\nINVENTORY.quantity_in_stock", 260, 1105, 230, 100)
d.shape("h_gw2", Psys, GATEWAY, "quantity_in_stock\n<= low_stock\n_threshold?", 530, 1130, 50, 50)
d.shape("h_notify", Psys, TASK_SYS, "Gửi NOTIFICATIONS cảnh báo\ntồn kho cho Gym Owner", 630, 1105, 240, 100)
d.shape("h_end2", Psys, END_EVT, "Kết thúc", 910, 1140, 36, 36)
d.shape("h_end3", Psys, END_EVT, "Kết thúc", 630, 1245, 36, 36)

d.edge("h_e1", "h_start", "h_gw1")
d.edge("h_e2", "h_gw1", "h_end1", "Không", exit=(0.5, 1))
d.edge("h_e3", "h_gw1", "h_deduct", "Có")
d.edge("h_e4", "h_deduct", "h_gw2")
d.edge("h_e5", "h_gw2", "h_notify", "Có")
d.edge("h_e6", "h_notify", "h_end2")
d.edge("h_e7", "h_gw2", "h_end3", "Không", exit=(0.5, 1))

d.set_flow_label("3.3.2 — Message flows")
d.msg("msg1", "b_finish", "sys_recv_suggest")
d.msg("msg2", "sys_suggest_end", "b_waitsuggest")
d.msg("msg3", "b_end2", "sys_recv_b")
d.msg("msg4", "sys_end_b", "s_start")
d.msg("msg5", "g_end3", "sys_recv_g")
d.msg("msg6", "sys_end_g", "s_start")
d.msg("msg7", "s_done", "h_start")

d.write(r"d:\doanWEDKD\docs\BPMN_332_Nutrition.drawio", page_h=1350)
POOL_DISPLAY = {
    "pool_member": "Member",
    "pool_guest": "Guest",
    "pool_gymowner": "GymOwner (quản lý đơn qua web)",
    "pool_system": "Hệ thống FitFuel+",
}
d.write_guide(r"d:\doanWEDKD\docs\BPMN_332_Nutrition_MessageFlow_Guide.md", "3.3.2 Dinh dưỡng nội bộ", POOL_DISPLAY)
