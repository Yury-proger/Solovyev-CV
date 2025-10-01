// Application data
const appData = {
    urd_modes: [
        {
            mode: "10% открытие УРД",
            shear_stress: 40.72,
            max_shear_stress: 57.48,
            mean_shear_stress: 34.22,
            status: "критический",
            description: "При данном режиме ни один из испытанных ингибиторов не обеспечивает требуемую защиту"
        },
        {
            mode: "100% открытие УРД",
            shear_stress: 22.86,
            max_shear_stress: 34.43,
            mean_shear_stress: 20.39,
            status: "условно допустимый",
            description: "Ингибитор 2 обеспечивает защиту на большей части поверхности"
        }
    ],
    inhibitor_thresholds: [
        { name: "Ингибитор 1", threshold: 6.12, description: "Теряет защитные свойства при КНнС > 6.12 Па" },
        { name: "Ингибитор 2", threshold: 25.48, description: "Более устойчив - теряет защитные свойства при КНнС > 25.48 Па" }
    ],
    autoclave_results: [
        { rpm: 60, shear_stress: 1.52, corrosion_rate_background: 1.104, corrosion_rate_inhibitor1: 0.032, corrosion_rate_inhibitor2: 0.041, efficiency_inhibitor1: 97.1, efficiency_inhibitor2: 96.3 },
        { rpm: 400, shear_stress: 6.12, corrosion_rate_background: 2.436, corrosion_rate_inhibitor1: 0.053, corrosion_rate_inhibitor2: 0.045, efficiency_inhibitor1: 97.8, efficiency_inhibitor2: 98.1 },
        { rpm: 800, shear_stress: 15.32, corrosion_rate_background: 2.97, corrosion_rate_inhibitor1: 0.133, corrosion_rate_inhibitor2: 0.067, efficiency_inhibitor1: 95.5, efficiency_inhibitor2: 97.7 },
        { rpm: 1200, shear_stress: 25.48, corrosion_rate_background: 2.842, corrosion_rate_inhibitor1: 0.279, corrosion_rate_inhibitor2: 0.093, efficiency_inhibitor1: 90.8, efficiency_inhibitor2: 96.9 },
        { rpm: 1700, shear_stress: 38.62, corrosion_rate_background: 3.02, corrosion_rate_inhibitor1: 1.721, corrosion_rate_inhibitor2: 0.894, efficiency_inhibitor1: 9.4, efficiency_inhibitor2: 53.0 }
    ]
};

// Global variables
let mainChart = null;
let currentUrdMode = '10';
let currentChartType = 'efficiency';
let currentInhibitors = { inhibitor1: true, inhibitor2: true };

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeChart();
    populateDataTable();
    updateResultsPanel();
});

// Event listeners
function initializeEventListeners() {
    // UРД mode toggle
    document.querySelectorAll('input[name="urd_mode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentUrdMode = this.value;
            updateResultsPanel();
        });
    });

    // Chart type toggle
    document.querySelectorAll('input[name="chart_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentChartType = this.value;
            updateChart();
            updateChartTitle();
        });
    });

    // Inhibitor filters
    document.getElementById('inhibitor1').addEventListener('change', function() {
        currentInhibitors.inhibitor1 = this.checked;
        updateChart();
    });

    document.getElementById('inhibitor2').addEventListener('change', function() {
        currentInhibitors.inhibitor2 = this.checked;
        updateChart();
    });

    // Table sorting
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const sortBy = this.getAttribute('data-sort');
            sortTable(sortBy);
        });
    });
}

// Chart initialization and updates
function initializeChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: getChartData(),
        options: getChartOptions()
    });
}

function getChartData() {
    const datasets = [];
    const colors = ['#1FB8CD', '#FFC185', '#B4413C'];
    
    if (currentChartType === 'efficiency') {
        if (currentInhibitors.inhibitor1) {
            datasets.push({
                label: 'Ингибитор 1',
                data: appData.autoclave_results.map(item => ({
                    x: item.shear_stress,
                    y: item.efficiency_inhibitor1
                })),
                borderColor: colors[0],
                backgroundColor: colors[0] + '20',
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: false,
                tension: 0.1
            });
        }
        
        if (currentInhibitors.inhibitor2) {
            datasets.push({
                label: 'Ингибитор 2',
                data: appData.autoclave_results.map(item => ({
                    x: item.shear_stress,
                    y: item.efficiency_inhibitor2
                })),
                borderColor: colors[1],
                backgroundColor: colors[1] + '20',
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: false,
                tension: 0.1
            });
        }
    } else {
        // Corrosion rate chart
        datasets.push({
            label: 'Без ингибитора',
            data: appData.autoclave_results.map(item => ({
                x: item.shear_stress,
                y: item.corrosion_rate_background
            })),
            borderColor: colors[2],
            backgroundColor: colors[2] + '20',
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: false,
            tension: 0.1
        });

        if (currentInhibitors.inhibitor1) {
            datasets.push({
                label: 'Ингибитор 1',
                data: appData.autoclave_results.map(item => ({
                    x: item.shear_stress,
                    y: item.corrosion_rate_inhibitor1
                })),
                borderColor: colors[0],
                backgroundColor: colors[0] + '20',
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: false,
                tension: 0.1
            });
        }
        
        if (currentInhibitors.inhibitor2) {
            datasets.push({
                label: 'Ингибитор 2',
                data: appData.autoclave_results.map(item => ({
                    x: item.shear_stress,
                    y: item.corrosion_rate_inhibitor2
                })),
                borderColor: colors[1],
                backgroundColor: colors[1] + '20',
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: false,
                tension: 0.1
            });
        }
    }

    return { datasets };
}

function getChartOptions() {
    const isEfficiency = currentChartType === 'efficiency';
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        family: 'FKGroteskNeue, Inter, sans-serif',
                        size: 14
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(38, 40, 40, 0.95)',
                titleColor: '#f5f5f5',
                bodyColor: '#f5f5f5',
                borderColor: '#626c71',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    title: function(context) {
                        return `КНнС: ${context[0].parsed.x} Па`;
                    },
                    label: function(context) {
                        const value = context.parsed.y;
                        const unit = isEfficiency ? '%' : 'мм/год';
                        return `${context.dataset.label}: ${value} ${unit}`;
                    },
                    afterBody: function(context) {
                        const point = context[0];
                        const dataPoint = appData.autoclave_results.find(item => 
                            Math.abs(item.shear_stress - point.parsed.x) < 0.1
                        );
                        if (dataPoint) {
                            return [`Обороты: ${dataPoint.rpm} об/мин`];
                        }
                        return [];
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Касательные напряжения на стенке (Па)',
                    font: {
                        family: 'FKGroteskNeue, Inter, sans-serif',
                        size: 14,
                        weight: '500'
                    }
                },
                grid: {
                    color: 'rgba(98, 108, 113, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: isEfficiency ? 'Эффективность (%)' : 'Скорость коррозии (мм/год)',
                    font: {
                        family: 'FKGroteskNeue, Inter, sans-serif',
                        size: 14,
                        weight: '500'
                    }
                },
                grid: {
                    color: 'rgba(98, 108, 113, 0.1)'
                },
                min: isEfficiency ? 0 : 0,
                max: isEfficiency ? 100 : undefined
            }
        },
        elements: {
            point: {
                hoverBackgroundColor: '#1FB8CD',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 2
            }
        }
    };
}

function updateChart() {
    if (mainChart) {
        document.querySelector('.chart-section').classList.add('loading');
        
        setTimeout(() => {
            mainChart.data = getChartData();
            mainChart.options = getChartOptions();
            mainChart.update('active');
            document.querySelector('.chart-section').classList.remove('loading');
        }, 150);
    }
}

function updateChartTitle() {
    const titleElement = document.getElementById('chart-title');
    const subtitleElement = document.getElementById('chart-subtitle');
    
    if (currentChartType === 'efficiency') {
        titleElement.textContent = 'Эффективность ингибиторов коррозии';
        subtitleElement.textContent = 'Зависимость от касательных напряжений на стенке трубопровода';
    } else {
        titleElement.textContent = 'Скорость коррозии';
        subtitleElement.textContent = 'Влияние касательных напряжений при различных методах защиты';
    }
}

// Results panel update
function updateResultsPanel() {
    const mode10Card = document.getElementById('mode10-card');
    const mode100Card = document.getElementById('mode100-card');
    
    // Remove active states
    mode10Card.classList.remove('active');
    mode100Card.classList.remove('active');
    
    // Add active state to current mode
    if (currentUrdMode === '10') {
        mode10Card.classList.add('active');
        mode10Card.style.boxShadow = '0 0 0 2px #1FB8CD';
    } else {
        mode100Card.classList.add('active');
        mode100Card.style.boxShadow = '0 0 0 2px #1FB8CD';
    }
    
    // Reset other card styles
    setTimeout(() => {
        if (currentUrdMode !== '10') mode10Card.style.boxShadow = '';
        if (currentUrdMode !== '100') mode100Card.style.boxShadow = '';
    }, 2000);
}

// Data table functions
function populateDataTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    appData.autoclave_results.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.rpm}</td>
            <td>${row.shear_stress}</td>
            <td>${row.corrosion_rate_background}</td>
            <td>${row.corrosion_rate_inhibitor1}</td>
            <td>${row.corrosion_rate_inhibitor2}</td>
            <td>${row.efficiency_inhibitor1}</td>
            <td>${row.efficiency_inhibitor2}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function sortTable(sortBy) {
    const tableBody = document.getElementById('tableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    // Determine sort direction
    const currentSort = tableBody.getAttribute('data-sort');
    const currentDir = tableBody.getAttribute('data-sort-dir') || 'asc';
    const newDir = (currentSort === sortBy && currentDir === 'asc') ? 'desc' : 'asc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = getValueFromRow(a, sortBy);
        const bValue = getValueFromRow(b, sortBy);
        
        if (newDir === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });
    
    // Update table
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
    
    // Update sort attributes
    tableBody.setAttribute('data-sort', sortBy);
    tableBody.setAttribute('data-sort-dir', newDir);
    
    // Update header indicators
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    const sortHeader = document.querySelector(`th[data-sort="${sortBy}"]`);
    sortHeader.classList.add(newDir === 'asc' ? 'sort-asc' : 'sort-desc');
}

function getValueFromRow(row, sortBy) {
    const index = {
        'rpm': 0,
        'shear_stress': 1,
        'corrosion_rate_background': 2,
        'corrosion_rate_inhibitor1': 3,
        'corrosion_rate_inhibitor2': 4,
        'efficiency_inhibitor1': 5,
        'efficiency_inhibitor2': 6
    }[sortBy];
    
    return parseFloat(row.cells[index].textContent);
}

// Animation helpers
function fadeInElement(element) {
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
}

function fadeOutElement(element) {
    element.classList.remove('fade-in');
    element.classList.add('fade-out');
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize responsive behavior
window.addEventListener('resize', debounce(() => {
    if (mainChart) {
        mainChart.resize();
    }
}, 250));