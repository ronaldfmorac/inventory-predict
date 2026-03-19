let charts = {};

function destroyCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
}

function renderTurnoverChart(turnoverData) {
    const lang = localStorage.getItem('language') || 'es';
    const ctx = document.getElementById('turnover-chart').getContext('2d');
    const top10 = turnoverData.slice(0, 10);
    
    charts.turnover = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top10.map(d => d.name),
            datasets: [{
                label: translations[lang].turnoverRatio,
                data: top10.map(d => d.turnoverRatio),
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: '#818cf8',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderCategoryValueChart(valData) {
    const ctx = document.getElementById('category-value-chart').getContext('2d');
    const categories = Object.keys(valData.byCategory);
    const values = Object.values(valData.byCategory);

    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#94a3b8' } }
            }
        }
    });
}

function renderTimeAnalysisChart(timeData) {
    const lang = localStorage.getItem('language') || 'es';
    const ctx = document.getElementById('time-analysis-chart').getContext('2d');
    const sortedDates = Object.keys(timeData).sort();
    
    // Extract unique categories
    const categoriesSet = new Set();
    sortedDates.forEach(date => {
        Object.keys(timeData[date]).forEach(cat => categoriesSet.add(cat));
    });
    const categories = Array.from(categoriesSet);

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981'];
    
    const datasets = categories.map((cat, i) => ({
        label: cat,
        data: sortedDates.map(date => timeData[date][cat] || 0),
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '33', // 20% opacity
        fill: true,
        tension: 0.4
    }));

    charts.time = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { 
                    display: true, 
                    position: 'top',
                    labels: { color: '#94a3b8', boxWidth: 10 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: { 
                    stacked: true,
                    title: { display: true, text: translations[lang].demandChartLabel, color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#64748b' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });
}
