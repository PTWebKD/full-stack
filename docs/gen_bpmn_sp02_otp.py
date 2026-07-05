# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"d:\doanWEDKD\docs")
from bpmn_helpers import Diagram, TASK, TASK_SYS, START_NONE, START_MSG, END_EVT, CATCH_MSG, GATEWAY

d = Diagram("BPMN - SP-02 Xac thuc OTP Guest", "bpmn-sp02-otp", page_w=1750)

d.add_pool("pool_guest", "Guest", 40, 580)
d.add_pool("pool_system", "Hệ thống FitFuel+", 660, 400)

P = "pool_guest"
d.shape("g_start", P, START_NONE, "Bắt đầu", 60, 90, 30, 30)
d.shape("g_inputphone", P, TASK, "Nhập số\nđiện thoại", 150, 65, 160, 100)
d.shape("g_gw1", P, GATEWAY, "Đã quá giới hạn\n3 lần/ngày?", 370, 90, 50, 50)
d.shape("g_blocked", P, TASK, "Hiển thị thông báo\n'Đã quá giới hạn hôm nay'", 480, 65, 220, 100)
d.shape("g_endblocked", P, END_EVT, "Return:\nBLOCKED", 750, 90, 36, 36)

d.shape("g_otpscreen", P, TASK, "Xem màn hình\nnhập OTP", 480, 220, 170, 100)
d.shape("g_waitsms", P, CATCH_MSG, "Chờ SMS", 700, 255, 40, 40)
d.shape("g_inputotp", P, TASK, "Nhập 6 số OTP", 790, 220, 170, 100)
d.shape("g_gwexpire", P, GATEWAY, "Mã đã hết hạn\n(> 10 phút)?", 1010, 155, 50, 50)
d.shape("g_expired", P, TASK, "Thông báo mã hết hạn,\nyêu cầu gửi lại mã mới", 1010, 50, 220, 90)
d.shape("g_gw2", P, GATEWAY, "OTP nhập\ncó đúng?", 1010, 280, 50, 50)
d.shape("g_gw3", P, GATEWAY, "Còn lượt thử\n(< 3 lần)?", 1010, 410, 50, 50)
d.shape("g_retry", P, TASK, "Hiển thị lỗi\n'Sai mã',\ncho nhập lại", 1120, 385, 170, 100)
d.shape("g_outoftries", P, TASK, "Thông báo\n'Hết lượt thử'", 1120, 500, 170, 90)
d.shape("g_endfail", P, END_EVT, "Return:\nFAILED", 1340, 530, 36, 36)
d.shape("g_endsuccess", P, END_EVT, "Return: SUCCESS\n+ session_token", 1150, 280, 40, 40)

d.edge("g_e1", "g_start", "g_inputphone")
d.edge("g_e2", "g_inputphone", "g_gw1")
d.edge("g_e3", "g_gw1", "g_blocked", "Có")
d.edge("g_e4", "g_blocked", "g_endblocked")
d.edge("g_e5", "g_gw1", "g_otpscreen", "Không", exit=(0.5, 1))
d.edge("g_e6", "g_otpscreen", "g_waitsms")
d.edge("g_e7", "g_waitsms", "g_inputotp")
d.edge("g_e8", "g_inputotp", "g_gwexpire")
d.edge("g_e8b", "g_gwexpire", "g_expired", "Có\n(hết hạn)", exit=(0.5, 0))
d.edge("g_e8c", "g_expired", "g_gw1", "quay lại xin mã mới\n(tính vào giới hạn BR-47)", entry=(0, 0.5))
d.edge("g_e8d", "g_gwexpire", "g_gw2", "Không\n(còn hiệu lực)", exit=(0.5, 1))
d.edge("g_e9", "g_gw2", "g_endsuccess", "Đúng", exit=(1, 0.5))
d.edge("g_e10", "g_gw2", "g_gw3", "Sai", exit=(0.5, 1))
d.edge("g_e11", "g_gw3", "g_retry", "Có", exit=(1, 0.5))
d.edge("g_e12", "g_retry", "g_inputotp", entry=(0.5, 0))
d.edge("g_e13", "g_gw3", "g_outoftries", "Không", exit=(0.5, 1))
d.edge("g_e14", "g_outoftries", "g_endfail")

Ps = "pool_system"
d.shape("s_recvreq", Ps, START_MSG, "Nhận yêu cầu\ngửi OTP", 60, 710, 30, 30)
d.shape("s_checklimit", Ps, TASK_SYS, "Kiểm tra số\nlần/ngày (BR-47)", 130, 685, 190, 90)
d.shape("s_genotp", Ps, TASK_SYS, "Sinh OTP 6 số,\nTTL = 10 phút", 360, 685, 180, 90)
d.shape("s_sendsms", Ps, TASK_SYS, "Gửi qua\nSMS gateway", 580, 685, 170, 90)
d.shape("s_saveotp", Ps, TASK_SYS, "Lưu\nOTP_VERIFICATIONS", 790, 685, 190, 90)
d.shape("s_end1", Ps, END_EVT, "Kết thúc", 1020, 720, 36, 36)

d.shape("s_recvverify", Ps, START_MSG, "Nhận xác thực\nthành công", 60, 880, 30, 30)
d.shape("s_createtoken", Ps, TASK_SYS, "Tạo session_token\n(TTL = 2 giờ)", 130, 855, 200, 90)
d.shape("s_savesession", Ps, TASK_SYS, "Lưu vào GUEST_SESSIONS\n(phone, token, expires_at)", 370, 855, 230, 90)
d.shape("s_end2", Ps, END_EVT, "Kết thúc", 640, 890, 36, 36)

d.edge("s_e1", "s_recvreq", "s_checklimit")
d.edge("s_e2", "s_checklimit", "s_genotp")
d.edge("s_e3", "s_genotp", "s_sendsms")
d.edge("s_e4", "s_sendsms", "s_saveotp")
d.edge("s_e5", "s_saveotp", "s_end1")
d.edge("s_e6", "s_recvverify", "s_createtoken")
d.edge("s_e7", "s_createtoken", "s_savesession")
d.edge("s_e8", "s_savesession", "s_end2")

d.set_flow_label("SP-02 — Message flows")
d.msg("msg1", "g_inputphone", "s_recvreq")
d.msg("msg2", "s_sendsms", "g_waitsms")
d.msg("msg3", "g_endsuccess", "s_recvverify")
d.msg("msg4", "g_expired", "s_recvreq")  # yêu cầu gửi lại mã cũng phải qua đúng luồng gửi OTP (kiểm tra hạn mức BR-47, sinh mã mới, gửi SMS)

d.write(r"d:\doanWEDKD\docs\BPMN_SP02_OTP.drawio", page_h=1150)
POOL_DISPLAY = {"pool_guest": "Guest", "pool_system": "Hệ thống FitFuel+"}
d.write_guide(r"d:\doanWEDKD\docs\BPMN_SP02_OTP_MessageFlow_Guide.md", "SP-02 Xác thực OTP Guest", POOL_DISPLAY)
