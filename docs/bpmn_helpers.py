# -*- coding: utf-8 -*-
"""Shared helpers for generating sequence-flow-only BPMN .drawio files for
docs/14_BPMN_Business_Processes.md. Message flows (cross-pool) are logged
but NOT drawn — a companion *_MessageFlow_Guide.md is emitted instead, so the
diagram stays readable (matches the approach agreed for 3.3.4)."""
import html


def esc(s):
    return html.escape(s, quote=True).replace("\n", "&#10;")


_TASK_BASE = ("shape=mxgraph.bpmn.task2;whiteSpace=wrap;rectStyle=rounded;size=10;"
              "html=1;container=1;expand=0;collapsible=0;")
TASK = _TASK_BASE + "taskMarker=user;fillColor=#ffffff;"
TASK_SYS = _TASK_BASE + "taskMarker=service;fillColor=#d5e8d4;strokeColor=#82b366;"
TASK_CALL = _TASK_BASE + "taskMarker=none;fillColor=#e1d5e7;strokeColor=#9673a6;strokeWidth=3;"
TASK_TIMER = _TASK_BASE + "taskMarker=timer;fillColor=#fff2cc;strokeColor=#d6b656;"

_EVT_BASE = ("shape=mxgraph.bpmn.event;html=1;verticalLabelPosition=bottom;"
             "labelBackgroundColor=#ffffff;verticalAlign=top;align=center;"
             "perimeter=ellipsePerimeter;outlineConnect=0;aspect=fixed;")
START_NONE = _EVT_BASE + "outline=standard;symbol=general;fillColor=#ffffff;"
START_MSG = _EVT_BASE + "outline=standard;symbol=message;fillColor=#dae8fc;strokeColor=#6c8ebf;"
START_TIMER = _EVT_BASE + "outline=standard;symbol=timer;fillColor=#fff2cc;strokeColor=#d6b656;"
END_EVT = _EVT_BASE + "outline=end;symbol=terminate2;fillColor=#f8cecc;strokeColor=#b85450;strokeWidth=3;"
CATCH_MSG = _EVT_BASE + "outline=catching;symbol=message;fillColor=#dae8fc;strokeColor=#6c8ebf;"
CATCH_TIMER = _EVT_BASE + "outline=catching;symbol=timer;fillColor=#fff2cc;strokeColor=#d6b656;"

GATEWAY = ("points=[[0.25,0.25,0],[0.5,0,0],[0.75,0.25,0],[1,0.5,0],[0.75,0.75,0],[0.5,1,0],[0.25,0.75,0],[0,0.5,0]];"
           "shape=mxgraph.bpmn.gateway2;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;"
           "verticalAlign=top;align=center;perimeter=rhombusPerimeter;outlineConnect=0;outline=none;"
           "symbol=none;gwType=exclusive;fillColor=#fff2cc;strokeColor=#d6b656;")

GATEWAY_PARALLEL = ("shape=mxgraph.bpmn.gateway2;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;"
                     "verticalAlign=top;align=center;perimeter=rhombusPerimeter;outlineConnect=0;outline=none;"
                     "symbol=parallel;gwType=parallel;fillColor=#e1d5e7;strokeColor=#9673a6;")


class Diagram:
    """One .drawio file: pools stacked vertically, each with its own y-origin
    so callers can keep using pool-relative-looking absolute y coordinates."""

    def __init__(self, name, diagram_id, page_w=1900):
        self.name = name
        self.diagram_id = diagram_id
        self.page_w = page_w
        self.cells = []
        self.edges = []          # sequence flows only -> drawn
        self.msg_log = []        # (flow_label, eid, src, tgt) -> guide only
        self.pool_origin_y = {}
        self.shape_label = {}    # cid -> (label, parent)
        self._cur_flow_label = "—"

    def set_flow_label(self, label):
        self._cur_flow_label = label

    def add_pool(self, pid, label, y, h, w=None):
        w = w or self.page_w
        self.pool_origin_y[pid] = y
        self.cells.append((pid, "swimlane;startSize=20;horizontal=0;html=1;whiteSpace=wrap;fillColor=#f5f5f5;",
                            label, 0, y, w, h, "1"))

    def shape(self, cid, parent, style, label, x, y, w, h):
        rel_y = y - self.pool_origin_y[parent]
        self.cells.append((cid, style, label, x, rel_y, w, h, parent))
        self.shape_label[cid] = (label.replace("\n", " "), parent)

    def edge(self, eid, src, tgt, label="", exit=None, entry=None):
        style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;"
        if exit:
            style += f"exitX={exit[0]};exitY={exit[1]};exitDx=0;exitDy=0;"
        if entry:
            style += f"entryX={entry[0]};entryY={entry[1]};entryDx=0;entryDy=0;"
        self.edges.append((eid, style, label, src, tgt, "1", None))

    def msg(self, eid, src, tgt):
        self.msg_log.append((self._cur_flow_label, eid, src, tgt))

    def build_xml(self, page_h):
        xml_cells = ['<mxCell id="0" />', '<mxCell id="1" parent="0" />']
        for (cid, style, value, x, y, w, h, parent) in self.cells:
            xml_cells.append(
                f'<mxCell id="{cid}" value="{esc(value)}" style="{style}" vertex="1" parent="{parent}">'
                f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>'
            )
        for (eid, style, value, src, tgt, parent, points) in self.edges:
            geo = '<mxGeometry relative="1" as="geometry" />'
            xml_cells.append(
                f'<mxCell id="{eid}" value="{esc(value)}" style="{style}" edge="1" parent="{parent}" '
                f'source="{src}" target="{tgt}">{geo}</mxCell>'
            )
        body = "\n".join(xml_cells)
        return f'''<mxfile host="app.diagrams.net">
  <diagram name="{self.name}" id="{self.diagram_id}">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="{self.page_w + 100}" pageHeight="{page_h}" math="0" shadow="0">
      <root>
        {body}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
'''

    def write(self, drawio_path, page_h):
        with open(drawio_path, "w", encoding="utf-8") as f:
            f.write(self.build_xml(page_h))
        print(f"OK wrote {drawio_path} | cells={len(self.cells)} edges={len(self.edges)} msg_logged={len(self.msg_log)}")

    def write_guide(self, guide_path, title, pool_display):
        lines = [f"# Hướng dẫn nối Message Flow — {title}\n"]
        lines.append(
            "Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** "
            "(giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu "
            "**task này → task kia**, nối tay trong draw.io theo đúng thứ tự.\n"
        )
        lines.append("## Cách vẽ 1 Message Flow trong draw.io\n")
        lines.append(
            "1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:\n"
            "   ```\n"
            "   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;"
            "dashed=1;endArrow=open;endFill=1;\n"
            "   ```\n"
            "2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên "
            "và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.\n"
        )
        groups = {}
        for (flow_label, eid, src, tgt) in self.msg_log:
            groups.setdefault(flow_label, []).append((eid, src, tgt))
        for flow_label, rows in groups.items():
            lines.append(f"\n## {flow_label}\n")
            for i, (eid, src, tgt) in enumerate(rows, 1):
                s_label, s_pool = self.shape_label.get(src, (src, "?"))
                t_label, t_pool = self.shape_label.get(tgt, (tgt, "?"))
                s_pool_name = pool_display.get(s_pool, s_pool)
                t_pool_name = pool_display.get(t_pool, t_pool)
                lines.append(
                    f"{i}. **{s_label}** (`{src}` — pool *{s_pool_name}*)  "
                    f"→  **{t_label}** (`{tgt}` — pool *{t_pool_name}*)"
                )
        lines.append(f"\n\nTổng cộng: **{len(self.msg_log)} message flow** cần nối thủ công.\n")
        with open(guide_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        print(f"OK wrote {guide_path}")
