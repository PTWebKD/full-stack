# -*- coding: utf-8 -*-
import html

def esc(s):
    return html.escape(s, quote=True).replace("\n", "&#10;")

cells = []  # list of (id, style, value, x, y, w, h, parent)
edges = []  # list of (id, style, value, source, target, parent)

def add_pool(pid, label, x, y, w, h):
    cells.append((pid, "swimlane;startSize=20;horizontal=0;html=1;whiteSpace=wrap;fillColor=#f5f5f5;", label, x, y, w, h, "1"))

def add_shape(cid, parent, style, label, x, y, w, h):
    cells.append((cid, style, label, x, y, w, h, parent))

def add_edge(eid, src, tgt, label="", msg=False):
    style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;"
    if msg:
        style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;"
    edges.append((eid, style, label, src, tgt, "1"))

# Official mxgraph.bpmn stencil styles (via drawio-skill shapesearch.py)
_TASK_BASE = ("shape=mxgraph.bpmn.task2;whiteSpace=wrap;rectStyle=rounded;size=10;"
              "html=1;container=1;expand=0;collapsible=0;")
TASK = _TASK_BASE + "taskMarker=user;fillColor=#ffffff;"
TASK_SYS = _TASK_BASE + "taskMarker=service;fillColor=#d5e8d4;strokeColor=#82b366;"

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

POOL_W = 3100

# ---------------- POOLS ----------------
add_pool("pool_member", "Member", 0, 40, POOL_W, 380)
add_pool("pool_system", "Hệ thống FitFuel+", 0, 420, POOL_W, 760)
add_pool("pool_gymowner", "GymOwner (Admin)", 0, 1180, POOL_W, 360)

# ================= MEMBER POOL ================= (main row y~110-230, branch-down y~330)
P = "pool_member"
add_shape("m_start", P, START_NONE, "Bắt đầu", 60, 175, 30, 30)
add_shape("m_browse", P, TASK, "Duyệt Gear Hub & xem chi tiết,\nlịch sử thiết bị (Gear Lifecycle)", 150, 140, 190, 100)
add_shape("m_addcart", P, TASK, "Chọn số lượng\n-> Add to Cart", 420, 140, 150, 100)
add_shape("m_recvstock", P, CATCH_MSG, "Nhận phản hồi\ntồn kho", 650, 170, 40, 40)
add_shape("m_gw_instock", P, GATEWAY, "Đủ hàng?", 760, 165, 50, 50)
add_shape("m_end_outofstock", P, END_EVT, "Hết hàng -\nkhông thể mua", 770, 320, 36, 36)
add_shape("m_checkout", P, TASK, "Checkout: xác nhận giỏ hàng,\ndùng FitCoin (<=50% - BR-27),\nxem hóa đơn, chọn thanh toán", 880, 120, 230, 140)
add_shape("m_recvpay", P, CATCH_MSG, "Nhận phản hồi\nthanh toán", 1180, 170, 40, 40)
add_shape("m_gw_paysuccess", P, GATEWAY, "Thanh toán\nthành công?", 1290, 165, 50, 50)
add_shape("m_end_payfail", P, END_EVT, "Hủy đơn -\nthanh toán thất bại", 1300, 320, 36, 36)
add_shape("m_recvorder", P, CATCH_MSG, "Nhận xác nhận\nđơn hàng", 1410, 170, 40, 40)
add_shape("m_end_success", P, END_EVT, "Hoàn tất\nmua hàng", 1520, 170, 36, 36)

add_edge("e_m1", "m_start", "m_browse")
add_edge("e_m2", "m_browse", "m_addcart")
add_edge("e_m3", "m_addcart", "m_recvstock")
add_edge("e_m4", "m_recvstock", "m_gw_instock")
add_edge("e_m5", "m_gw_instock", "m_end_outofstock", "Không")
add_edge("e_m6", "m_gw_instock", "m_checkout", "Có")
add_edge("e_m7", "m_checkout", "m_recvpay")
add_edge("e_m8", "m_recvpay", "m_gw_paysuccess")
add_edge("e_m9", "m_gw_paysuccess", "m_end_payfail", "Thất bại")
add_edge("e_m10", "m_gw_paysuccess", "m_recvorder", "Thành công")
add_edge("e_m11", "m_recvorder", "m_end_success")

# ================= SYSTEM POOL ================= two independent sub-flows, stacked with big gap
# Order chosen so each sub-flow sits next to the pool it talks to most:
# purchase flow on TOP (adjacent to Member, above) — listing flow on BOTTOM (adjacent to GymOwner, below)
P = "pool_system"
# --- purchase/fulfillment sub-flow (y ~ 40-310), x columns aligned with Member's addcart/checkout/recvpay ---
add_shape("s_start_stockreq", P, START_MSG, "Nhận yêu cầu\nkiểm tra tồn kho", 480, 95, 30, 30)
add_shape("s_checkstock", P, TASK_SYS, "Kiểm tra tồn kho\ntức thời", 560, 50, 180, 100)
add_shape("s_gw_stock", P, GATEWAY, "Đủ hàng?", 790, 75, 50, 50)
add_shape("s_notifyout", P, TASK_SYS, "Gửi thông báo\nhết hàng", 780, 240, 190, 70)
add_shape("s_end_stockfail", P, END_EVT, "Kết thúc\n(hết hàng)", 1030, 255, 36, 36)
add_shape("s_confirmstock", P, TASK_SYS, "Xác nhận đủ hàng,\nthêm vào Gear Cart", 900, 50, 190, 100)
add_shape("s_recvcheckout", P, CATCH_MSG, "Nhận yêu cầu\nthanh toán", 1140, 75, 40, 40)
add_shape("s_callpay", P, TASK_SYS, "[Call Activity]\nXử lý thanh toán\n(Quy trình 3.3.5)", 1230, 50, 210, 100)
add_shape("s_recvpaygw", P, CATCH_MSG, "Nhận phản hồi\nPayment Gateway", 1490, 75, 40, 40)
add_shape("s_gw_paysuccess2", P, GATEWAY, "Thanh toán\nthành công?", 1580, 70, 50, 50)
add_shape("s_cancelrefund", P, TASK_SYS, "Hủy giao dịch,\nhoàn FitCoin tạm giữ", 1550, 230, 200, 80)
add_shape("s_end_payfail2", P, END_EVT, "Kết thúc\n(thanh toán thất bại)", 1800, 250, 36, 36)
add_shape("s_confirmorder", P, TASK_SYS, "Xác nhận\nđơn hàng", 1680, 50, 160, 100)
add_shape("s_deductstock", P, TASK_SYS, "Trừ tồn kho\nGymOwner", 1900, 50, 160, 100)
add_shape("s_recordsold", P, TASK_SYS, "Ghi nhận 'sold'\nvào Gear Lifecycle", 2120, 50, 190, 100)
add_shape("s_transferown", P, TASK_SYS, "Chuyển quyền sở hữu\nlogic sang Member", 2370, 50, 190, 100)
add_shape("s_gw_stockzero", P, GATEWAY, "Tồn kho\nvề 0?", 2620, 75, 50, 50)
add_shape("s_markout", P, TASK_SYS, "Đánh dấu 'Hết hàng',\nẩn khỏi niêm yết", 2590, 230, 190, 80)
add_shape("s_notifyall", P, TASK_SYS, "Gửi xác nhận đơn hàng\ncho Member + GymOwner", 2730, 50, 210, 100)
add_shape("s_end_dealdone", P, END_EVT, "Hoàn tất\ngiao dịch bán", 3000, 75, 36, 36)

add_edge("e_s9", "s_start_stockreq", "s_checkstock")
add_edge("e_s10", "s_checkstock", "s_gw_stock")
add_edge("e_s11", "s_gw_stock", "s_notifyout", "Không")
add_edge("e_s12", "s_gw_stock", "s_confirmstock", "Có")
add_edge("e_s13", "s_notifyout", "s_end_stockfail")
add_edge("e_s14", "s_confirmstock", "s_recvcheckout")
add_edge("e_s15", "s_recvcheckout", "s_callpay")
add_edge("e_s16", "s_callpay", "s_recvpaygw")
add_edge("e_s17", "s_recvpaygw", "s_gw_paysuccess2")
add_edge("e_s18", "s_gw_paysuccess2", "s_cancelrefund", "Thất bại / hết hàng\n(race condition)")
add_edge("e_s19", "s_gw_paysuccess2", "s_confirmorder", "Thành công")
add_edge("e_s20", "s_cancelrefund", "s_end_payfail2")
add_edge("e_s21", "s_confirmorder", "s_deductstock")
add_edge("e_s22", "s_deductstock", "s_recordsold")
add_edge("e_s23", "s_recordsold", "s_transferown")
add_edge("e_s24", "s_transferown", "s_gw_stockzero")
add_edge("e_s25", "s_gw_stockzero", "s_markout", "Có")
add_edge("e_s26", "s_gw_stockzero", "s_notifyall", "Không")
add_edge("e_s27", "s_markout", "s_notifyall")
add_edge("e_s28", "s_notifyall", "s_end_dealdone")

# --- listing sub-flow (y ~ 430-650), x columns aligned with GymOwner's inputinfo/recvlistingresult ---
add_shape("s_start_list", P, START_MSG, "Nhận yêu cầu\nđăng bán", 490, 475, 30, 30)
add_shape("s_verifyrole", P, TASK_SYS, "Xác nhận vai trò GymOwner\n(chỉ hiện Bán đứt - BR-11B)", 570, 440, 210, 100)
add_shape("s_gw_photos", P, GATEWAY, "Đủ >=2 ảnh\nthực tế? (BR-11)", 840, 465, 50, 50)
add_shape("s_reqphoto", P, TASK_SYS, "Yêu cầu\nbổ sung ảnh", 830, 600, 180, 70)
add_shape("s_end_needphoto", P, END_EVT, "Thiếu ảnh -\nchưa đăng", 1070, 615, 36, 36)
add_shape("s_genid", P, TASK_SYS, "Sinh Gear ID\nduy nhất (BR-12)", 960, 440, 170, 100)
add_shape("s_initlife", P, TASK_SYS, "Khởi tạo Gear Lifecycle\n(status = listed)", 1190, 440, 190, 100)
add_shape("s_publish", P, TASK_SYS, "Niêm yết công khai\ntrên Gear Hub", 1440, 440, 180, 100)
add_shape("s_end_listed", P, END_EVT, "Listing đã\nniêm yết", 1680, 465, 36, 36)

add_edge("e_s1", "s_start_list", "s_verifyrole")
add_edge("e_s2", "s_verifyrole", "s_gw_photos")
add_edge("e_s3", "s_gw_photos", "s_reqphoto", "Không")
add_edge("e_s4", "s_gw_photos", "s_genid", "Có")
add_edge("e_s5", "s_reqphoto", "s_end_needphoto")
add_edge("e_s6", "s_genid", "s_initlife")
add_edge("e_s7", "s_initlife", "s_publish")
add_edge("e_s8", "s_publish", "s_end_listed")

# ================= GYMOWNER POOL ================= x columns aligned with System's listing flow above
P = "pool_gymowner"
add_shape("g_start", P, START_NONE, "Bắt đầu", 60, 175, 30, 30)
add_shape("g_selectsell", P, TASK, "Chọn\n'Đăng bán'", 150, 150, 160, 80)
add_shape("g_inputinfo", P, TASK, "Nhập thông tin: tên, danh mục,\ngiá, SL tồn kho, >=2 ảnh", 470, 140, 240, 100)
add_shape("g_recvlistingresult", P, CATCH_MSG, "Nhận phản hồi\nđăng bán", 1200, 170, 40, 40)
add_shape("g_gw_listingok", P, GATEWAY, "Đăng bán\nthành công?", 1310, 165, 50, 50)
add_shape("g_addphotos", P, TASK, "Bổ sung ảnh\ntheo yêu cầu", 1280, 290, 180, 70)
add_shape("g_end_listed", P, END_EVT, "Listing đã\nniêm yết", 1460, 175, 36, 36)
add_shape("g_recvsale", P, CATCH_MSG, "Nhận thông báo\nbán hàng", 2700, 170, 40, 40)
add_shape("g_gw_outofstock", P, GATEWAY, "Hết hàng?", 2810, 165, 50, 50)
add_shape("g_restock", P, TASK, "Cập nhật lại tồn kho\nđể tái niêm yết", 2750, 30, 200, 80)
add_shape("g_end_restock", P, END_EVT, "Đã tái\nniêm yết", 3000, 50, 36, 36)
add_shape("g_end_stillavail", P, END_EVT, "Đã bán -\ncòn hàng", 2890, 280, 36, 36)

add_edge("e_g1", "g_start", "g_selectsell")
add_edge("e_g2", "g_selectsell", "g_inputinfo")
add_edge("e_g3", "g_inputinfo", "g_recvlistingresult")
add_edge("e_g4", "g_recvlistingresult", "g_gw_listingok")
add_edge("e_g5", "g_gw_listingok", "g_addphotos", "Không")
add_edge("e_g6", "g_gw_listingok", "g_end_listed", "Có")
add_edge("e_g7", "g_addphotos", "g_inputinfo")
add_edge("e_g8", "g_recvsale", "g_gw_outofstock")
add_edge("e_g9", "g_gw_outofstock", "g_restock", "Có")
add_edge("e_g10", "g_gw_outofstock", "g_end_stillavail", "Không")
add_edge("e_g11", "g_restock", "g_end_restock")

# ---------------- MESSAGE FLOWS (cross-pool) ----------------
add_edge("e_msg1", "m_addcart", "s_start_stockreq", "", True)
add_edge("e_msg2", "s_notifyout", "m_recvstock", "", True)
add_edge("e_msg3", "s_confirmstock", "m_recvstock", "", True)
add_edge("e_msg4", "m_checkout", "s_recvcheckout", "", True)
add_edge("e_msg5", "s_cancelrefund", "m_recvpay", "", True)
add_edge("e_msg6", "s_confirmorder", "m_recvpay", "", True)
add_edge("e_msg7", "s_notifyall", "m_recvorder", "", True)

add_edge("e_msg8", "g_inputinfo", "s_start_list", "", True)
add_edge("e_msg9", "s_reqphoto", "g_recvlistingresult", "", True)
add_edge("e_msg10", "s_end_listed", "g_recvlistingresult", "", True)
add_edge("e_msg11", "s_markout", "g_recvsale", "", True)
add_edge("e_msg12", "s_notifyall", "g_recvsale", "", True)

# ---------------- BUILD XML ----------------
xml_cells = []
xml_cells.append('<mxCell id="0" />')
xml_cells.append('<mxCell id="1" parent="0" />')

for (cid, style, value, x, y, w, h, parent) in cells:
    xml_cells.append(
        f'<mxCell id="{cid}" value="{esc(value)}" style="{style}" vertex="1" parent="{parent}">'
        f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>'
    )

for (eid, style, value, src, tgt, parent) in edges:
    xml_cells.append(
        f'<mxCell id="{eid}" value="{esc(value)}" style="{style}" edge="1" parent="{parent}" source="{src}" target="{tgt}">'
        f'<mxGeometry relative="1" as="geometry" /></mxCell>'
    )

body = "\n".join(xml_cells)

xml = f'''<mxfile host="app.diagrams.net">
  <diagram name="BPMN - Mua ban Gear qua GymOwner" id="bpmn-gear-sale">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        {body}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
'''

with open(r"d:\doanWEDKD\docs\BPMN_MuaBanGear.drawio", "w", encoding="utf-8") as f:
    f.write(xml)

print("OK, wrote file. cells:", len(cells), "edges:", len(edges))
