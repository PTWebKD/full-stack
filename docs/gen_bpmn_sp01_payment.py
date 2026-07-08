# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"d:\doanWEDKD\docs")
from bpmn_helpers import Diagram, TASK, TASK_SYS, START_NONE, START_MSG, END_EVT, CATCH_MSG, GATEWAY

d = Diagram("BPMN - SP-01 Xu ly Thanh toan", "bpmn-sp01-payment", page_w=1900)

d.add_pool("pool_actor", "Member / Guest (người mua)", 40, 520)
d.add_pool("pool_system", "Hệ thống FitFuel+", 640, 420)
d.add_pool("pool_paygw", "Payment Gateway (Actor phụ — online only)", 1100, 220)

P = "pool_actor"
d.shape("m_start", P, START_NONE, "Bắt đầu\n(yêu cầu thanh toán)", 60, 90, 30, 30)
d.shape("m_gw1", P, GATEWAY, "Đã đăng nhập &\ncó FitCoin?", 150, 85, 50, 50)
d.shape("m_showbal", P, TASK, "Hiển thị số dư FitCoin\nhiện tại + mức giảm tối đa\n", 260, 60, 210, 100)
d.shape("m_gw2", P, GATEWAY, "Muốn áp dụng\nFitCoin?", 500, 85, 50, 50)
d.shape("m_inputfc", P, TASK, "Nhập số FitCoin\nmuốn dùng", 610, 60, 170, 100)
d.shape("m_waitfcresult", P, CATCH_MSG, "Chờ kết quả\náp dụng FitCoin", 830, 90, 40, 40)
d.shape("m_gwfcresult", P, GATEWAY, "FitCoin\nhợp lệ?", 930, 85, 50, 50)
d.shape("m_fcerror", P, TASK, "Hiển thị lỗi: FitCoin vượt\nquá 50% đơn hàng,\nyêu cầu nhập lại", 1010, 60, 220, 100)

d.shape("m_choosepay", P, TASK, "Chọn phương thức thanh toán\nonline cho phần còn lại:\nVNPay / MoMo", 380, 205, 200, 100)
d.shape("m_redirect", P, TASK_SYS, "Redirect sang\nPayment Gateway", 630, 205, 180, 100)
d.shape("m_waitcb", P, CATCH_MSG, "Chờ webhook\ncallback", 860, 240, 40, 40)
d.shape("m_gwtimeout", P, GATEWAY, "Nhận được callback\ntrong thời gian chờ?", 930, 230, 50, 50)
d.shape("m_gw5", P, GATEWAY, "Callback\nthành công?", 1050, 230, 50, 50)
d.shape("m_endfail", P, END_EVT, "Return:\nFAILED", 1150, 360, 36, 36)

d.shape("m_endsuccess", P, END_EVT, "Return:\nSUCCESS", 1250, 230, 36, 36)

d.edge("m_e1", "m_start", "m_gw1")
d.edge("m_e2", "m_gw1", "m_showbal", "Có", exit=(1, 0.5))
d.edge("m_e3", "m_gw1", "m_choosepay", "Không\n(Guest / không FitCoin)", exit=(0.5, 1), entry=(0.5, 0))
d.edge("m_e4", "m_showbal", "m_gw2")
d.edge("m_e5", "m_gw2", "m_choosepay", "Không", exit=(0.5, 1), entry=(0.5, 0))
d.edge("m_e6", "m_gw2", "m_inputfc", "Có", exit=(1, 0.5))
d.edge("m_e7", "m_inputfc", "m_waitfcresult")
d.edge("m_e7b", "m_waitfcresult", "m_gwfcresult")
d.edge("m_e7c", "m_gwfcresult", "m_fcerror", "Không\n(vượt quá 50%)", exit=(1, 0.5), entry=(0, 0.5))
d.edge("m_e7d", "m_fcerror", "m_inputfc", "nhập lại", exit=(0, 0.5), entry=(1, 0.5))
d.edge("m_e9", "m_gwfcresult", "m_choosepay", "Có", exit=(0.5, 1), entry=(0.5, 0))

d.edge("m_e12", "m_choosepay", "m_redirect")
d.edge("m_e15", "m_redirect", "m_waitcb")
d.edge("m_e16", "m_waitcb", "m_gwtimeout")
d.edge("m_e16b", "m_gwtimeout", "m_gw5", "Có")
d.edge("m_e16c", "m_gwtimeout", "m_endfail", "Không\n(timeout)", exit=(0.5, 1), entry=(0.5, 0))
d.edge("m_e17", "m_gw5", "m_endfail", "Thất bại", exit=(0.5, 1))
d.edge("m_e19", "m_gw5", "m_endsuccess", "Thành công", exit=(1, 0.5))

Ps = "pool_system"
d.shape("s_recvok", Ps, START_MSG, "Nhận\nReturn SUCCESS", 60, 750, 30, 30)
d.shape("s_idem", Ps, TASK_SYS, "Kiểm tra\nidempotency", 130, 720, 190, 90)
d.shape("s_invoice", Ps, TASK_SYS, "Tạo / cập nhật\nINVOICES.payment_status\n= 'paid'", 360, 720, 200, 90)
d.shape("s_fcused", Ps, TASK_SYS, "Ghi\nINVOICES.fitcoin_used", 600, 720, 190, 90)
d.shape("s_end1", Ps, END_EVT, "Kết thúc", 830, 755, 36, 36)

d.shape("s_recvfail", Ps, START_MSG, "Nhận\nReturn FAILED", 60, 950, 30, 30)
d.shape("s_refund", Ps, TASK_SYS, "Hoàn trả FitCoin\nđã tạm khóa", 130, 920, 190, 90)
d.shape("s_end2", Ps, END_EVT, "Kết thúc", 360, 955, 36, 36)

d.shape("s_recvfcreq", Ps, START_MSG, "Nhận yêu cầu\náp dụng FitCoin", 950, 750, 30, 30)
d.shape("s_validatefc", Ps, TASK_SYS, "Validate: FitCoin × đơn giá\n<= 50% amount", 1020, 720, 210, 90)
d.shape("s_gwfc", Ps, GATEWAY, "Hợp lệ?", 1270, 740, 50, 50)
d.shape("s_lockfc", Ps, TASK_SYS, "Trừ tạm FitCoin khỏi\nUSERS.fitcoin_balance\n(tạm khóa)", 1360, 720, 200, 90)
d.shape("s_endfc1", Ps, END_EVT, "Kết thúc", 1600, 755, 36, 36)
d.shape("s_endfc2", Ps, END_EVT, "Kết thúc\n(từ chối)", 1270, 860, 36, 36)

d.edge("s_e1", "s_recvok", "s_idem")
d.edge("s_e2", "s_idem", "s_invoice")
d.edge("s_e3", "s_invoice", "s_fcused")
d.edge("s_e4", "s_fcused", "s_end1")
d.edge("s_e5", "s_recvfail", "s_refund")
d.edge("s_e6", "s_refund", "s_end2")
d.edge("s_e7", "s_recvfcreq", "s_validatefc")
d.edge("s_e8", "s_validatefc", "s_gwfc")
d.edge("s_e9", "s_gwfc", "s_lockfc", "Có")
d.edge("s_e10", "s_lockfc", "s_endfc1")
d.edge("s_e11", "s_gwfc", "s_endfc2", "Không", exit=(0.5, 1))

Pp = "pool_paygw"
d.shape("p_recv", Pp, START_MSG, "Nhận\nyêu cầu", 60, 1170, 30, 30)
d.shape("p_process", Pp, TASK_SYS, "Xử lý\ngiao dịch", 130, 1145, 170, 90)
d.shape("p_callback", Pp, TASK_SYS, "Gửi callback\nkết quả", 340, 1145, 170, 90)
d.shape("p_end", Pp, END_EVT, "Kết thúc", 550, 1180, 36, 36)

d.edge("p_e1", "p_recv", "p_process")
d.edge("p_e2", "p_process", "p_callback")
d.edge("p_e3", "p_callback", "p_end")

d.set_flow_label("SP-01 — Message flows")
d.msg("msg1", "m_endsuccess", "s_recvok")
d.msg("msg2", "m_endfail", "s_recvfail")
d.msg("msg3", "m_redirect", "p_recv")
d.msg("msg4", "p_callback", "m_waitcb")
d.msg("msg5", "m_inputfc", "s_recvfcreq")
d.msg("msg6", "s_endfc1", "m_waitfcresult")
d.msg("msg7", "s_endfc2", "m_waitfcresult")

d.write(r"d:\doanWEDKD\docs\BPMN_SP01_Payment.drawio", page_h=1350)
POOL_DISPLAY = {
    "pool_actor": "Member / Guest (người mua)",
    "pool_system": "Hệ thống FitFuel+",
    "pool_paygw": "Payment Gateway",
}
d.write_guide(r"d:\doanWEDKD\docs\BPMN_SP01_Payment_MessageFlow_Guide.md", "SP-01 Xử lý Thanh toán", POOL_DISPLAY)
