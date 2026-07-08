# -*- coding: utf-8 -*-
import html

def esc(s):
    return html.escape(s, quote=True).replace("\n", "&#10;")

cells = []
edges = []

def add_pool(pid, label, x, y, w, h):
    cells.append((pid, "swimlane;startSize=20;horizontal=0;html=1;whiteSpace=wrap;fillColor=#f5f5f5;", label, x, y, w, h, "1"))

POOL_ORIGIN_Y = {
    "pool_member": 40,
    "pool_gymowner": 1300,
    "pool_system": 1780,
}

# Message flows are no longer auto-drawn (see MSG_FLOW_LOG below), so flows
# no longer need to be spread into separate x-bands — keep them compact.
FLOW_OFFSET = {"a": 0, "b": 0, "c": 0, "d": 0}
_CUR_OFFSET = [0]

def set_flow(flow_key):
    _CUR_OFFSET[0] = FLOW_OFFSET[flow_key]
    _CUR_FLOW_NAME[0] = flow_key

# Shape label lookup (for the message-flow guide) and current active flow
# name (for grouping), set alongside set_flow().
SHAPE_LABEL = {}
_CUR_FLOW_NAME = ["a"]
_FLOW_DISPLAY = {
    "a": "Luồng A — Đăng ký Online",
    "b": "Luồng B — Gia hạn",
    "c": "Luồng C — Chuyển gói Tháng → Năm",
    "d": "Luồng D — Bảo lưu",
}
POOL_DISPLAY = {
    "pool_member": "Member / Khách hàng",
    "pool_gymowner": "GymOwner / Nhân viên",
    "pool_system": "Hệ thống FitFuel+",
}

def add_shape(cid, parent, style, label, x, y, w, h):
    # x/y passed in are meant as absolute canvas coordinates; mxGraph child
    # geometry is relative to the parent pool's origin, so translate here.
    abs_x = x + _CUR_OFFSET[0]
    rel_y = y - POOL_ORIGIN_Y[parent]
    cells.append((cid, style, label, abs_x, rel_y, w, h, parent))
    SHAPE_LABEL[cid] = (label.replace("\n", " "), parent)

# Message flows are NOT emitted into the .drawio XML — the diagram gets too
# dense with 5 flows sharing 3 pools for auto-routing to avoid every task.
# Instead each one is logged here and written out as a manual-wiring guide
# (docs/BPMN_Membership_Lifecycle_MessageFlow_Guide.md) so they can be drawn
# by hand in draw.io, bent around obstacles as needed for each specific spot.
MSG_FLOW_LOG = []

def add_edge(eid, src, tgt, label="", msg=False):
    if msg:
        MSG_FLOW_LOG.append((_CUR_FLOW_NAME[0], eid, src, tgt))
        return
    style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;"
    edges.append((eid, style, label, src, tgt, "1", None))

# Official mxgraph.bpmn stencil styles (matches docs/gen_bpmn_gear_sale.py conventions)
_TASK_BASE = ("shape=mxgraph.bpmn.task2;whiteSpace=wrap;rectStyle=rounded;size=10;"
              "html=1;container=1;expand=0;collapsible=0;")
TASK = _TASK_BASE + "taskMarker=user;fillColor=#ffffff;"
TASK_SYS = _TASK_BASE + "taskMarker=service;fillColor=#d5e8d4;strokeColor=#82b366;"
TASK_CALL = _TASK_BASE + "taskMarker=none;fillColor=#e1d5e7;strokeColor=#9673a6;strokeWidth=3;"

_EVT_BASE = ("shape=mxgraph.bpmn.event;html=1;verticalLabelPosition=bottom;"
             "labelBackgroundColor=#ffffff;verticalAlign=top;align=center;"
             "perimeter=ellipsePerimeter;outlineConnect=0;aspect=fixed;")
START_NONE = _EVT_BASE + "outline=standard;symbol=general;fillColor=#ffffff;"
START_MSG = _EVT_BASE + "outline=standard;symbol=message;fillColor=#dae8fc;strokeColor=#6c8ebf;"
END_EVT = _EVT_BASE + "outline=end;symbol=terminate2;fillColor=#f8cecc;strokeColor=#b85450;strokeWidth=3;"
CATCH_MSG = _EVT_BASE + "outline=catching;symbol=message;fillColor=#dae8fc;strokeColor=#6c8ebf;"
CATCH_TIMER = _EVT_BASE + "outline=catching;symbol=timer;fillColor=#fff2cc;strokeColor=#d6b656;"

GATEWAY = ("points=[[0.25,0.25,0],[0.5,0,0],[0.75,0.25,0],[1,0.5,0],[0.75,0.75,0],[0.5,1,0],[0.25,0.75,0],[0,0.5,0]];"
           "shape=mxgraph.bpmn.gateway2;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;"
           "verticalAlign=top;align=center;perimeter=rhombusPerimeter;outlineConnect=0;outline=none;"
           "symbol=none;gwType=exclusive;fillColor=#fff2cc;strokeColor=#d6b656;")

POOL_W = 1830

# ---------------- POOLS ----------------
add_pool("pool_member", "Member / Khách hàng", 0, 40, POOL_W, 1260)
add_pool("pool_gymowner", "GymOwner / Nhân viên", 0, 1300, POOL_W, 480)
add_pool("pool_system", "Hệ thống FitFuel+", 0, 1780, POOL_W, 1400)

# ================= FLOW A: DANG KY ONLINE (member y~70-190, system y~2010-2190) =================
set_flow("a")
Pm = "pool_member"
Pg = "pool_gymowner"
add_shape("a_m_start", Pm, START_NONE, "Bắt đầu", 60, 130, 30, 30)
add_shape("a_m_choose", Pm, TASK, "Chọn Gói Tháng\nhoặc Gói Năm", 150, 90, 190, 110)
add_shape("a_m_phone", Pm, TASK, "Nhập số\nđiện thoại", 400, 90, 160, 110)
add_shape("a_m_pay", Pm, TASK_CALL, "[Call Activity]\nThanh toán online\n(SP-01)", 620, 90, 220, 110)
add_shape("a_m_recvpay", Pm, CATCH_MSG, "Nhận phản hồi\nthanh toán", 900, 120, 40, 40)
add_shape("a_m_gw", Pm, GATEWAY, "Thanh toán\nthành công?", 1000, 115, 50, 50)
add_shape("a_m_endfail", Pm, END_EVT, "Đăng ký thất bại -\nthử lại / thoát", 1010, 260, 36, 36)
add_shape("a_m_recvsms", Pm, CATCH_MSG, "Nhận SMS\nmật khẩu tạm", 1130, 120, 40, 40)
add_shape("a_m_end", Pm, END_EVT, "Đăng ký thành công -\nđăng nhập", 1240, 120, 36, 36)

add_edge("a_e1", "a_m_start", "a_m_choose")
add_edge("a_e2", "a_m_choose", "a_m_phone")
add_edge("a_e3", "a_m_phone", "a_m_pay")
add_edge("a_e4", "a_m_pay", "a_m_recvpay")
add_edge("a_e5", "a_m_recvpay", "a_m_gw")
add_edge("a_e6", "a_m_gw", "a_m_endfail", "Thất bại")
add_edge("a_e7", "a_m_gw", "a_m_recvsms", "Thành công")
add_edge("a_e8", "a_m_recvsms", "a_m_end")

Ps = "pool_system"
add_shape("a_s_recvpay", Ps, START_MSG, "Nhận yêu cầu\nthanh toán", 620, 2050, 30, 30)
add_shape("a_s_process", Ps, TASK_SYS, "Xử lý SP-01:\nkiểm tra idempotency\n", 690, 2010, 200, 110)
add_shape("a_s_gw", Ps, GATEWAY, "Thành công?", 920, 2045, 50, 50)
add_shape("a_s_fail", Ps, TASK_SYS, "Kết thúc giao dịch\nthất bại", 900, 2170, 190, 80)
add_shape("a_s_createuser", Ps, TASK_SYS, "Tạo USERS,\nkích hoạt\nGYM_MEMBERSHIPS", 1010, 2010, 200, 110)
add_shape("a_s_history", Ps, TASK_SYS, "Ghi\nMEMBERSHIP_HISTORY\n", 1240, 2010, 200, 110)
add_shape("a_s_sms", Ps, TASK_SYS, "Gửi SMS\nmật khẩu tạm thời", 1470, 2010, 190, 110)
add_shape("a_s_end", Ps, END_EVT, "Kết thúc\n(kích hoạt)", 1690, 2045, 36, 36)

add_edge("a_e9", "a_s_recvpay", "a_s_process")
add_edge("a_e10", "a_s_process", "a_s_gw")
add_edge("a_e11", "a_s_gw", "a_s_fail", "Thất bại")
add_edge("a_e12", "a_s_gw", "a_s_createuser", "Thành công")
add_edge("a_e13", "a_s_createuser", "a_s_history")
add_edge("a_e14", "a_s_history", "a_s_sms")
add_edge("a_e15", "a_s_sms", "a_s_end")

add_edge("a_msg1", "a_m_pay", "a_s_recvpay", "", True)
add_edge("a_msg2", "a_s_fail", "a_m_recvpay", "", True)
add_edge("a_msg3", "a_s_createuser", "a_m_recvpay", "", True)
add_edge("a_msg4", "a_s_sms", "a_m_recvsms", "", True)

# ================= FLOW B: GIA HAN (member y~550-680, system y~2540-2700) =================
set_flow("b")
add_shape("b_m_start", Pm, START_NONE, "Bắt đầu", 60, 610, 30, 30)
add_shape("b_m_choose", Pm, TASK, "Chọn gói\ncần gia hạn", 150, 570, 180, 110)
add_shape("b_m_pay", Pm, TASK_CALL, "[Call Activity]\nThanh toán\n(SP-01)", 370, 570, 200, 110)
add_shape("b_m_gw_err", Pm, GATEWAY, "Lỗi mạng\nkhi thanh toán?", 610, 590, 50, 50)
add_shape("b_m_retry", Pm, TASK, "Giao dịch hủy,\ngói giữ nguyên -\ncó thể thử lại", 590, 700, 200, 90)
add_shape("b_m_recv", Pm, CATCH_MSG, "Nhận xác nhận\ngia hạn + FitCoin", 730, 600, 40, 40)
add_shape("b_m_end", Pm, END_EVT, "Gia hạn\nthành công", 840, 600, 36, 36)

add_edge("b_e1", "b_m_start", "b_m_choose")
add_edge("b_e2", "b_m_choose", "b_m_pay")
add_edge("b_e3", "b_m_pay", "b_m_gw_err")
add_edge("b_e4", "b_m_gw_err", "b_m_retry", "Có lỗi mạng")
add_edge("b_e5", "b_m_gw_err", "b_m_recv", "Thanh toán OK")
add_edge("b_e6", "b_m_recv", "b_m_end")
add_edge("b_e7", "b_m_retry", "b_m_pay", "Thử lại")

add_shape("b_s_recv", Ps, START_MSG, "Nhận yêu cầu\ngia hạn đã thanh toán", 610, 2570, 30, 30)
add_shape("b_s_gw", Ps, GATEWAY, "Gói còn\nhiệu lực?", 690, 2565, 50, 50)
add_shape("b_s_extend", Ps, TASK_SYS, "Cộng dồn thời gian\nvào end_date hiện tại", 780, 2510, 200, 100)
add_shape("b_s_newdate", Ps, TASK_SYS, "Tính end_date mới\ntừ thời điểm hiện tại", 780, 2630, 200, 100)
add_shape("b_s_history", Ps, TASK_SYS, "Tạo bản ghi mới\ntrong MEMBERSHIP_HISTORY\n", 1020, 2570, 210, 110)
add_shape("b_s_fitcoin", Ps, TASK_SYS, "Cộng 50 FitCoin\nvào tài khoản\n", 1270, 2570, 190, 110)
add_shape("b_s_notify", Ps, TASK_SYS, "Gửi xác nhận\ngia hạn", 1500, 2570, 170, 110)
add_shape("b_s_end", Ps, END_EVT, "Kết thúc\n(gia hạn)", 1710, 2605, 36, 36)

add_edge("b_e8", "b_s_recv", "b_s_gw")
add_edge("b_e9", "b_s_gw", "b_s_extend", "Còn hiệu lực")
add_edge("b_e10", "b_s_gw", "b_s_newdate", "Đã hết hạn")
add_edge("b_e11", "b_s_extend", "b_s_history")
add_edge("b_e12", "b_s_newdate", "b_s_history")
add_edge("b_e13", "b_s_history", "b_s_fitcoin")
add_edge("b_e14", "b_s_fitcoin", "b_s_notify")
add_edge("b_e15", "b_s_notify", "b_s_end")

add_edge("b_msg1", "b_m_pay", "b_s_recv", "", True)
add_edge("b_msg2", "b_s_notify", "b_m_recv", "", True)

# ================= FLOW C: CHUYEN GOI THANG -> NAM (member y~800-950, system y~2760-2900) =================
set_flow("c")
add_shape("c_m_start", Pm, START_NONE, "Bắt đầu", 60, 850, 30, 30)
add_shape("c_m_choose", Pm, TASK, "Chọn\n'Chuyển sang\nGói Năm'", 150, 800, 180, 130)
add_shape("c_m_recvcheck", Pm, CATCH_MSG, "Chờ phản hồi\nkiểm tra điều kiện", 400, 850, 40, 40)
add_shape("c_m_gw_wait", Pm, GATEWAY, "Được phép\nchuyển đổi?", 500, 845, 50, 50)
add_shape("c_m_endwait", Pm, END_EVT, "Gợi ý đợi hết hạn -\nkhông đổi gói", 510, 970, 36, 36)
add_shape("c_m_recvfee", Pm, CATCH_MSG, "Xem phí\nchênh lệch", 620, 850, 40, 40)
add_shape("c_m_pay", Pm, TASK_CALL, "[Call Activity]\nThanh toán phí\nchênh lệch (SP-01)", 720, 800, 210, 130)
add_shape("c_m_recvresult", Pm, CATCH_MSG, "Nhận xác nhận\nđổi gói", 990, 850, 40, 40)
add_shape("c_m_end", Pm, END_EVT, "Chuyển gói\nthành công", 1100, 850, 36, 36)

add_edge("c_e1", "c_m_start", "c_m_choose")
add_edge("c_e2", "c_m_choose", "c_m_recvcheck")
add_edge("c_e3", "c_m_recvcheck", "c_m_gw_wait")
add_edge("c_e4", "c_m_gw_wait", "c_m_endwait", "Không\n(< 3 ngày còn lại)")
add_edge("c_e5", "c_m_gw_wait", "c_m_recvfee", "Có")
add_edge("c_e6", "c_m_recvfee", "c_m_pay")
add_edge("c_e7", "c_m_pay", "c_m_recvresult")
add_edge("c_e8", "c_m_recvresult", "c_m_end")

add_shape("c_s_start", Ps, START_MSG, "Nhận yêu cầu\nchuyển gói", 400, 2790, 30, 30)
add_shape("c_s_checkdays", Ps, TASK_SYS, "Kiểm tra số ngày\ncòn lại của Gói Tháng", 470, 2750, 200, 100)
add_shape("c_s_gw", Ps, GATEWAY, "Còn lại\n< 3 ngày?", 700, 2775, 50, 50)
add_shape("c_s_warn", Ps, TASK_SYS, "Cảnh báo, gợi ý\nđợi hết hạn để\ntối ưu chi phí", 460, 2870, 200, 90)
add_shape("c_s_end_wait", Ps, END_EVT, "Kết thúc\n(gợi ý đợi)", 550, 2975, 36, 36)
add_shape("c_s_calcfee", Ps, TASK_SYS, "Tính phí chênh lệch\n(giá Năm - giá Tháng)/30\n× số ngày còn lại", 780, 2750, 220, 100)
add_shape("c_s_recvpay", Ps, START_MSG, "Nhận thanh toán\nphí chênh lệch", 1030, 2775, 30, 30)
add_shape("c_s_gwpay", Ps, GATEWAY, "Thanh toán\nthành công?", 1100, 2775, 50, 50)
add_shape("c_s_update", Ps, TASK_SYS, "Cập nhật gói mới,\ntạo bản ghi mới\ntrong MEMBERSHIP_HISTORY", 1190, 2750, 220, 100)
add_shape("c_s_notify", Ps, TASK_SYS, "Gửi xác nhận\nđổi gói", 1440, 2750, 180, 100)
add_shape("c_s_end", Ps, END_EVT, "Kết thúc\n(đổi gói)", 1650, 2775, 36, 36)

add_edge("c_e9", "c_s_start", "c_s_checkdays")
add_edge("c_e10", "c_s_checkdays", "c_s_gw")
add_edge("c_e11", "c_s_gw", "c_s_warn", "Có")
add_edge("c_e12", "c_s_warn", "c_s_end_wait")
add_edge("c_e13", "c_s_gw", "c_s_calcfee", "Không")
add_edge("c_e14", "c_s_calcfee", "c_s_recvpay")
add_edge("c_e15", "c_s_recvpay", "c_s_gwpay")
add_edge("c_e16", "c_s_gwpay", "c_s_update", "Thành công")
add_edge("c_e17", "c_s_update", "c_s_notify")
add_edge("c_e18", "c_s_notify", "c_s_end")

add_edge("c_msg1", "c_m_choose", "c_s_start", "", True)
add_edge("c_msg2", "c_s_warn", "c_m_recvcheck", "", True)
add_edge("c_msg3", "c_s_calcfee", "c_m_recvcheck", "", True)
add_edge("c_msg4", "c_s_calcfee", "c_m_recvfee", "", True)
add_edge("c_msg5", "c_m_pay", "c_s_recvpay", "", True)
add_edge("c_msg6", "c_s_notify", "c_m_recvresult", "", True)

# ================= FLOW D: BAO LUU (member y~1030-1230, gymowner y~1620-1760, system y~3020-3160... ) =================
set_flow("d")
add_shape("d_m_start", Pm, START_NONE, "Bắt đầu", 60, 1090, 30, 30)
add_shape("d_m_request", Pm, TASK, "Gửi yêu cầu bảo lưu\n", 150, 1050, 220, 110)
add_shape("d_m_recvresult", Pm, CATCH_MSG, "Chờ kết quả\nphê duyệt", 430, 1090, 40, 40)
add_shape("d_m_gw", Pm, GATEWAY, "Được\nduyệt?", 530, 1085, 50, 50)
add_shape("d_m_reject", Pm, END_EVT, "Yêu cầu bị\ntừ chối", 540, 1210, 36, 36)
add_shape("d_m_suspended", Pm, TASK, "Gói tập chuyển\ntrạng thái 'Tạm ngưng'", 640, 1060, 200, 100)
add_shape("d_m_reactivate", Pm, TASK, "Gửi yêu cầu\nkích hoạt lại", 900, 1060, 190, 100)
add_shape("d_m_recvfinal", Pm, CATCH_MSG, "Nhận xác nhận\nkích hoạt lại", 1150, 1090, 40, 40)
add_shape("d_m_end", Pm, END_EVT, "Kích hoạt lại\nthành công", 1260, 1090, 36, 36)

add_edge("d_e1", "d_m_start", "d_m_request")
add_edge("d_e2", "d_m_request", "d_m_recvresult")
add_edge("d_e3", "d_m_recvresult", "d_m_gw")
add_edge("d_e4", "d_m_gw", "d_m_reject", "Không")
add_edge("d_e5", "d_m_gw", "d_m_suspended", "Có")
add_edge("d_e6", "d_m_suspended", "d_m_reactivate")
add_edge("d_e7", "d_m_reactivate", "d_m_recvfinal")
add_edge("d_e8", "d_m_recvfinal", "d_m_end")

add_shape("d_g_recv", Pg, START_MSG, "Nhận yêu cầu\nbảo lưu", 150, 1690, 30, 30)
add_shape("d_g_review", Pg, TASK, "Xem xét\nyêu cầu", 220, 1650, 170, 100)
add_shape("d_g_gw", Pg, GATEWAY, "Hợp lệ &\nphê duyệt?", 430, 1675, 50, 50)
add_shape("d_g_reject", Pg, TASK, "Từ chối +\nghi lý do", 520, 1780, 170, 90)
add_shape("d_g_approve", Pg, TASK, "Duyệt\nyêu cầu", 520, 1650, 170, 90)
add_shape("d_g_end", Pg, END_EVT, "Đã xử lý\nyêu cầu", 740, 1685, 36, 36)

add_edge("d_e9", "d_g_recv", "d_g_review")
add_edge("d_e10", "d_g_review", "d_g_gw")
add_edge("d_e11", "d_g_gw", "d_g_reject", "Không")
add_edge("d_e12", "d_g_gw", "d_g_approve", "Có")
add_edge("d_e13", "d_g_reject", "d_g_end")
add_edge("d_e14", "d_g_approve", "d_g_end")

add_shape("d_s_recv1", Ps, START_MSG, "Nhận phê duyệt\nbảo lưu", 640, 3000, 30, 30)
add_shape("d_s_suspend", Ps, TASK_SYS, "Cập nhật\nGYM_MEMBERSHIPS.status\n= 'suspended'", 710, 2960, 210, 100)
add_shape("d_s_end1", Ps, END_EVT, "Kết thúc\n(tạm ngưng)", 940, 2995, 36, 36)
add_shape("d_s_recv2", Ps, START_MSG, "Nhận yêu cầu\nkích hoạt lại", 900, 3080, 30, 30)
add_shape("d_s_reactivate", Ps, TASK_SYS, "Cộng bù số ngày\nđã bảo lưu vào\nend_date của gói", 970, 3040, 210, 100)
add_shape("d_s_notify", Ps, TASK_SYS, "Gửi xác nhận\nkích hoạt lại", 1200, 3040, 190, 100)
add_shape("d_s_end2", Ps, END_EVT, "Kết thúc\n(kích hoạt lại)", 1410, 3075, 36, 36)

add_edge("d_e15", "d_s_recv1", "d_s_suspend")
add_edge("d_e16", "d_s_suspend", "d_s_end1")
add_edge("d_e17", "d_s_recv2", "d_s_reactivate")
add_edge("d_e18", "d_s_reactivate", "d_s_notify")
add_edge("d_e19", "d_s_notify", "d_s_end2")

add_edge("d_msg1", "d_m_request", "d_g_recv", "", True)
add_edge("d_msg2", "d_g_reject", "d_m_recvresult", "", True)
add_edge("d_msg3", "d_g_approve", "d_m_recvresult", "", True)
add_edge("d_msg4", "d_g_approve", "d_s_recv1", "", True)
add_edge("d_msg5", "d_s_suspend", "d_m_suspended", "", True)
add_edge("d_msg6", "d_m_reactivate", "d_s_recv2", "", True)
add_edge("d_msg7", "d_s_notify", "d_m_recvfinal", "", True)

# Payment Gateway is NOT modeled here — SP-01 (Thanh toán) is documented as its
# own BPMN diagram; each "[Call Activity] Thanh toán (SP-01)" task above calls
# into it directly, hence the direct a_msg1 / b_msg1 / c_msg1 message flows to
# the System pool with no separate gateway pool in between.

# ---------------- BUILD XML ----------------
xml_cells = []
xml_cells.append('<mxCell id="0" />')
xml_cells.append('<mxCell id="1" parent="0" />')

for (cid, style, value, x, y, w, h, parent) in cells:
    xml_cells.append(
        f'<mxCell id="{cid}" value="{esc(value)}" style="{style}" vertex="1" parent="{parent}">'
        f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>'
    )

for (eid, style, value, src, tgt, parent, points) in edges:
    if points:
        pts_xml = "".join(f'<mxPoint x="{px}" y="{py}" />' for (px, py) in points)
        geo = f'<mxGeometry relative="1" as="geometry"><Array as="points">{pts_xml}</Array></mxGeometry>'
    else:
        geo = '<mxGeometry relative="1" as="geometry" />'
    xml_cells.append(
        f'<mxCell id="{eid}" value="{esc(value)}" style="{style}" edge="1" parent="{parent}" source="{src}" target="{tgt}">'
        f'{geo}</mxCell>'
    )

body = "\n".join(xml_cells)

xml = f'''<mxfile host="app.diagrams.net">
  <diagram name="BPMN - Vong doi hoi vien" id="bpmn-membership-lifecycle">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="1900" pageHeight="3220" math="0" shadow="0">
      <root>
        {body}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
'''

with open(r"d:\doanWEDKD\docs\BPMN_Membership_Lifecycle.drawio", "w", encoding="utf-8") as f:
    f.write(xml)

# ---------------- MESSAGE FLOW GUIDE (manual wiring instructions) ----------------
guide_lines = []
guide_lines.append("# Hướng dẫn nối Message Flow — BPMN Vòng đời hội viên (3.3.4)\n")
guide_lines.append(
    "Sơ đồ `.drawio` chỉ chứa **Sequence Flow** (mũi tên đặc, trong cùng 1 pool). "
    "Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) đã được bỏ khỏi "
    "file để tránh chồng chéo lên task, danh sách dưới đây liệt kê đầy đủ để bạn "
    "tự nối tay trong draw.io.\n"
)
guide_lines.append("## Cách vẽ 1 Message Flow trong draw.io\n")
guide_lines.append(
    "1. Mở panel Shape bên trái, tìm mục **BPMN** (hoặc gõ tìm \"message flow\" trong ô Search Shapes).\n"
    "2. Kéo thả cạnh **Message Flow** (đường nét đứt, đầu mũi tên tròn rỗng `o->`) vào canvas — "
    "hoặc đơn giản hơn: vẽ 1 cạnh thường rồi bấm chuột phải → Edit Style → dán style sau:\n"
    "   ```\n"
    "   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;"
    "dashed=1;endArrow=open;endFill=1;\n"
    "   ```\n"
    "3. Kéo 2 đầu mũi tên gắn vào đúng 2 shape nguồn/đích theo bảng bên dưới. Vì bạn nối tay, "
    "bạn có thể chủ động bẻ cong / thêm điểm gấp khúc (waypoint) để né các task khác — "
    "click giữa cạnh và kéo để tạo điểm gấp.\n"
    "4. Toạ độ ước lượng của từng shape đã cho sẵn (x,y tuyệt đối trên canvas) để bạn dễ định vị."
    " Muốn xem chính xác: mở `BPMN_Membership_Lifecycle.drawio`, click vào shape, xem Arrange panel.\n"
)

for flow_key in ["a", "b", "c", "d"]:
    rows = [r for r in MSG_FLOW_LOG if r[0] == flow_key]
    if not rows:
        continue
    guide_lines.append(f"\n## {_FLOW_DISPLAY[flow_key]}\n")
    guide_lines.append("| # | Từ (nguồn) | Pool nguồn | Đến (đích) | Pool đích |")
    guide_lines.append("|---|---|---|---|---|")
    for (_, eid, src, tgt) in rows:
        src_label, src_pool = SHAPE_LABEL.get(src, (src, "?"))
        tgt_label, tgt_pool = SHAPE_LABEL.get(tgt, (tgt, "?"))
        guide_lines.append(
            f"| {eid} | **{src_label}** (`{src}`) | {POOL_DISPLAY.get(src_pool, src_pool)} | "
            f"**{tgt_label}** (`{tgt}`) | {POOL_DISPLAY.get(tgt_pool, tgt_pool)} |"
        )

guide_lines.append(f"\n\nTổng cộng: **{len(MSG_FLOW_LOG)} message flow** cần nối thủ công.\n")

with open(r"d:\doanWEDKD\docs\BPMN_Membership_Lifecycle_MessageFlow_Guide.md", "w", encoding="utf-8") as f:
    f.write("\n".join(guide_lines))

print("OK, wrote file. cells:", len(cells), "edges:", len(edges), "| message flows logged:", len(MSG_FLOW_LOG))
