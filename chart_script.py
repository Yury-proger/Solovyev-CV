import plotly.graph_objects as go
import plotly.io as pio

# Data
shear_stress = [1.52, 6.12, 15.32, 25.48, 38.62]
inhibitor_1_efficiency = [97.1, 97.8, 95.5, 90.8, 9.4]
inhibitor_2_efficiency = [96.3, 98.1, 97.7, 96.9, 53.0]

# Create figure
fig = go.Figure()

# Add Inhibitor 1 line
fig.add_trace(go.Scatter(
    x=shear_stress,
    y=inhibitor_1_efficiency,
    mode='lines+markers',
    name='Inhibitor 1',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8),
    hovertemplate='Stress: %{x} Pa<br>Efficiency: %{y}%<extra></extra>'
))

# Add Inhibitor 2 line
fig.add_trace(go.Scatter(
    x=shear_stress,
    y=inhibitor_2_efficiency,
    mode='lines+markers',
    name='Inhibitor 2',
    line=dict(color='#2E8B57', width=3),
    marker=dict(size=8),
    hovertemplate='Stress: %{x} Pa<br>Efficiency: %{y}%<extra></extra>'
))

# Add horizontal line at 85% (minimum protective efficiency)
fig.add_hline(
    y=85,
    line_dash="dash",
    line_color="#DB4545",
    line_width=2,
    annotation_text="Min Protection",
    annotation_position="bottom right"
)

# Add vertical lines at threshold values
fig.add_vline(
    x=6.12,
    line_dash="dash",
    line_color="gray",
    line_width=2,
    annotation_text="Threshold 1",
    annotation_position="top"
)

fig.add_vline(
    x=25.48,
    line_dash="dash",
    line_color="gray", 
    line_width=2,
    annotation_text="Threshold 2",
    annotation_position="top"
)

# Update layout
fig.update_layout(
    title="Inhibitor Efficiency vs Shear Stress",
    xaxis_title="Shear Stress (Pa)",
    yaxis_title="Efficiency (%)",
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='lightgray', range=[0, 100])

# Update traces for better interactivity
fig.update_traces(cliponaxis=False)

# Save as PNG and SVG
fig.write_image("inhibitor_efficiency_chart.png")
fig.write_image("inhibitor_efficiency_chart.svg", format="svg")

fig.show()