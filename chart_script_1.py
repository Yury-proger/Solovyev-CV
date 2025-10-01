# Install necessary package for static image export
!pip install -q kaleido

import plotly.graph_objects as go

# Provided data
shear_stress = [1.52, 6.12, 15.32, 25.48, 38.62]
background_corrosion = [1.104, 2.436, 2.970, 2.842, 3.020]
inhibitor_1_corrosion = [0.032, 0.053, 0.133, 0.279, 1.721]
inhibitor_2_corrosion = [0.041, 0.045, 0.067, 0.093, 0.894]

# Brand colors
c1 = "#1FB8CD"  # Strong cyan
c2 = "#DB4545"  # Bright red (used for limit line)
c3 = "#2E8B57"  # Sea green
c4 = "#5D878F"  # Cyan

fig = go.Figure()

# Background (no inhibitor)
fig.add_trace(
    go.Scatter(
        x=shear_stress,
        y=background_corrosion,
        mode="markers",
        name="Без ингиб",
        marker=dict(color=c1, size=10, symbol="circle"),
        hovertemplate=(
            "Серия: %{fullData.name}<br>" +
            "КНнС: %{x:.2f} Па<br>" +
            "Скор: %{y:.2f} мм/г<extra></extra>"
        ),
    )
)

# Inhibitor 1
fig.add_trace(
    go.Scatter(
        x=shear_stress,
        y=inhibitor_1_corrosion,
        mode="markers",
        name="Ингиб 1",
        marker=dict(color=c3, size=10, symbol="square"),
        hovertemplate=(
            "Серия: %{fullData.name}<br>" +
            "КНнС: %{x:.2f} Па<br>" +
            "Скор: %{y:.2f} мм/г<extra></extra>"
        ),
    )
)

# Inhibitor 2
fig.add_trace(
    go.Scatter(
        x=shear_stress,
        y=inhibitor_2_corrosion,
        mode="markers",
        name="Ингиб 2",
        marker=dict(color=c4, size=10, symbol="diamond"),
        hovertemplate=(
            "Серия: %{fullData.name}<br>" +
            "КНнС: %{x:.2f} Па<br>" +
            "Скор: %{y:.2f} мм/г<extra></extra>"
        ),
    )
)

# Horizontal limit line at 0.1 mm/yr
fig.add_hline(y=0.10, line_color=c2, line_dash="dash")

# Layout and axes
fig.update_layout(
    title="Коррозия vs КНнС",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
)
fig.update_xaxes(title_text="КНнС, Па", tickformat=".2f")
fig.update_yaxes(title_text="Скор корр, мм/г", tickformat=".2f")

# Trace settings
fig.update_traces(cliponaxis=False)

# Save images
fig.write_image("chart.png")
fig.write_image("chart.svg", format="svg")
