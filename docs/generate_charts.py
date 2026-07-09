import os
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Set style
plt.rcParams['font.family'] = 'Segoe UI'
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# Colors aligned with FitFuel+ design system (Zinc/Orange + Accents)
COLOR_ORANGE = '#FF5722'  # Primary
COLOR_BLUE = '#3B82F6'    # Secondary
COLOR_ZINC_DARK = '#18181B'
COLOR_ZINC_MUTED = '#71717A'
COLOR_ZINC_LIGHT = '#F4F4F5'
COLOR_GRID = '#E4E4E7'
COLOR_TEXT = '#27272A'

# Create output dir
os.makedirs('d:/doanWEDKD/docs/images', exist_ok=True)

# ----------------------------------------------------
# CHART 1: Thị Trường Fitness Việt Nam 2020-2025
# ----------------------------------------------------
years = ['2020', '2022', '2023', '2024\n(Dự báo)', '2025\n(Dự báo)']
market_value = [400, 530, 610, 700, 800]  # $ triệu
gyms_count = [600, 650, 600, 650, 700]    # phòng gym

fig, ax1 = plt.subplots(figsize=(10, 6), dpi=300)

# Bar chart for Market Value
bars = ax1.bar(years, market_value, color=COLOR_ORANGE, alpha=0.85, width=0.5, label='Giá trị thị trường ($ triệu)')
ax1.set_xlabel('Năm', fontsize=12, fontweight='bold', labelpad=10, color=COLOR_TEXT)
ax1.set_ylabel('Giá Trị Thị Trường (Triệu USD)', fontsize=12, fontweight='bold', color=COLOR_ORANGE, labelpad=10)
ax1.tick_params(axis='y', labelcolor=COLOR_ORANGE)
ax1.grid(True, axis='y', linestyle='--', alpha=0.5, color=COLOR_GRID)

# Line chart for Gyms Count (Secondary axis)
ax2 = ax1.twinx()
line = ax2.plot(years, gyms_count, color=COLOR_BLUE, marker='o', linewidth=3, markersize=8, label='Số phòng gym')
ax2.set_ylabel('Số Lượng Phòng Gym', fontsize=12, fontweight='bold', color=COLOR_BLUE, labelpad=10)
ax2.tick_params(axis='y', labelcolor=COLOR_BLUE)

# Annotations for bars
for bar in bars:
    height = bar.get_height()
    ax1.annotate(f'${height:,.0f}M',
                 xy=(bar.get_x() + bar.get_width() / 2, height),
                 xytext=(0, 3),  # 3 points vertical offset
                 textcoords="offset points",
                 ha='center', va='bottom', fontsize=10, fontweight='bold', color=COLOR_TEXT)

# Annotations for line
for i, txt in enumerate(gyms_count):
    ax2.annotate(f'~{txt}', (years[i], gyms_count[i]), textcoords="offset points", xytext=(0,10), ha='center', fontweight='bold', color=COLOR_BLUE)

plt.title('Thị Trường Fitness Việt Nam 2020-2025\n(Statista, VIR, Ken Research)', fontsize=14, fontweight='bold', pad=20, color=COLOR_ZINC_DARK)
fig.tight_layout()
plt.savefig('d:/doanWEDKD/docs/images/chart1_fitness_market.png', bbox_inches='tight')
plt.close()

# ----------------------------------------------------
# CHART 2: Vấn Đề Quản Lý Phòng Gym Việt Nam
# ----------------------------------------------------
problems = [
    'Không tự động cảnh báo\n(100% thủ công)',
    'Tỷ lệ gyms không\nlợi nhuận bền vững',
    'Doanh thu phụ trợ\nchưa tối ưu (bỏ ngỏ)',
    'Dữ liệu rải rác\n(Sử dụng Excel)',
    'Mất hội viên &\nTỷ lệ churn cao'
]
percentages = [100.0, 91.2, 82.5, 72.0, 60.0]  # Average churn 60%, un-optimized aux revenue 82.5%

fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
colors = sns.color_palette("Oranges_r", len(problems))

y_pos = np.arange(len(problems))
bars = ax.barh(y_pos, percentages, color=colors, height=0.6, edgecolor='none', alpha=0.9)

# Customize axes
ax.set_yticks(y_pos)
ax.set_yticklabels(problems, fontsize=10, fontweight='bold', color=COLOR_TEXT)
ax.invert_yaxis()  # top-down
ax.set_xlabel('Tỷ lệ phần trăm (%)', fontsize=12, fontweight='bold', labelpad=10, color=COLOR_TEXT)
ax.set_xlim(0, 115)
ax.grid(True, axis='x', linestyle='--', alpha=0.5, color=COLOR_GRID)

# Add percentages on bars
for bar in bars:
    width = bar.get_width()
    ax.annotate(f'{width:.1f}%',
                 xy=(width, bar.get_y() + bar.get_height() / 2),
                 xytext=(8, 0),  # 8 points horizontal offset
                 textcoords="offset points",
                 ha='left', va='center', fontsize=11, fontweight='bold', color=COLOR_TEXT)

plt.title('Các Vấn Đề Quản Lý Phòng Gym Tại Việt Nam\n(Nguồn: Glofox, VnData, Health & Fitness Association)', fontsize=14, fontweight='bold', pad=20, color=COLOR_ZINC_DARK)
fig.tight_layout()
plt.savefig('d:/doanWEDKD/docs/images/chart2_gym_problems.png', bbox_inches='tight')
plt.close()

# ----------------------------------------------------
# CHART 3: So Sánh Phần Mềm Quản Lý Gym
# ----------------------------------------------------
features = [
    'Quản lý membership',
    'Check-in / Điểm danh',
    'Quản lý dinh dưỡng',
    'Bán/Cho thuê dụng cụ (Gear)',
    'Gamification (XP/Badge)',
    'AI Retention & Cảnh báo',
    'Real-time Dashboard KPI',
    'Tự động hóa quy trình'
]

# Convert stars and crosses to numerical values for heatmap (0 to 5)
comparison_data = {
    'Excel': [2, 0, 0, 0, 0, 0, 1, 0],
    'GymDesk': [4, 3, 0, 0, 0, 0, 2, 2],
    'Glofox': [4, 4, 2, 0, 0, 0, 3, 3],
    'Mindbody': [5, 3, 2, 0, 0, 2, 4, 3],
    'FitFuel+': [5, 5, 5, 5, 5, 5, 5, 5]
}

df = pd.DataFrame(comparison_data, index=features)

fig, ax = plt.subplots(figsize=(10, 7), dpi=300)

# Create a custom colormap from light zinc to FitFuel+ Orange
cmap = sns.light_palette(COLOR_ORANGE, as_cmap=True)

# Generate mask or custom labels for the heatmap
annot_labels = np.empty_like(df.values, dtype=object)
for r in range(df.shape[0]):
    for c in range(df.shape[1]):
        val = df.values[r, c]
        if val == 0:
            annot_labels[r, c] = '—'
        elif val == 1:
            annot_labels[r, c] = '★☆☆☆☆'
        elif val == 2:
            annot_labels[r, c] = '★★☆☆☆'
        elif val == 3:
            annot_labels[r, c] = '★★★☆☆'
        elif val == 4:
            annot_labels[r, c] = '★★★★☆'
        elif val == 5:
            annot_labels[r, c] = '★★★★★'

# Plot heatmap
sns.heatmap(df, annot=annot_labels, fmt='', cmap=cmap, cbar=False, 
            linewidths=1.5, linecolor='white', square=False,
            annot_kws={'fontsize': 9, 'fontweight': 'bold', 'fontfamily': 'DejaVu Sans'}, ax=ax)

# Adjust label rotations and style
ax.set_xticklabels(ax.get_xticklabels(), fontsize=12, fontweight='bold', color=COLOR_TEXT)
ax.set_yticklabels(ax.get_yticklabels(), rotation=0, fontsize=11, fontweight='bold', color=COLOR_TEXT)

plt.title('Ma Trận So Sánh Các Giải Pháp Quản Lý Phòng Gym\n(Nguồn: Statista, GetKisi, GymDesk Official 2026)', fontsize=14, fontweight='bold', pad=25, color=COLOR_ZINC_DARK)
fig.tight_layout()
plt.savefig('d:/doanWEDKD/docs/images/chart3_competitor_comparison.png', bbox_inches='tight')
plt.close()

print("All charts successfully generated and saved in docs/images/")
