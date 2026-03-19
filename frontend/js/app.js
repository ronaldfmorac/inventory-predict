document.addEventListener('DOMContentLoaded', () => {
    const langSwitcher = document.getElementById('lang-switcher');
    const uploadSection = document.getElementById('upload-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const fileInput = document.getElementById('file-input');
    const feedback = document.getElementById('upload-feedback');
    const resetButton = document.getElementById('reset-button');
    const dropZone = document.getElementById('drop-zone');

    const handleFile = async (file) => {
        if (!file || !file.type.match('text/csv')) {
            showFeedback('Por favor, selecciona un archivo CSV válido.', 'error');
            return;
        }

        showFeedback('Analizando datos de inventario...', 'success');

        try {
            const data = await parseCSV(file);
            const results = analyzeDataOffline(data);
            
            setTimeout(() => {
                window.lastResults = results; // Store for language changes
                populateDashboard(results);
                showDashboard();
            }, 800);

        } catch (error) {
            const lang = localStorage.getItem('language') || 'es';
            const errorMsg = translations[lang][error.message] || error.message;
            showFeedback(`Error: ${errorMsg}`, 'error');
        }
    };

    const translateInsight = (key, data) => {
        const lang = localStorage.getItem('language') || 'es';
        let template = translations[lang][key] || key;
        Object.keys(data).forEach(k => {
            let val = data[k];
            if (typeof val === 'number') val = val.toLocaleString(lang);
            template = template.replace(`\${${k}}`, val);
        });
        return template;
    };

    const showModal = (titleKey, products) => {
        const lang = localStorage.getItem('language') || 'es';
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${translations[lang][titleKey] || titleKey}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <ul class="modal-list">
                    ${products.map(p => `<li class="alert-item"><span>${p}</span></li>`).join('')}
                </ul>
                <button class="analyze-btn modal-close-btn" style="margin-top:1.5rem; width:100%">${translations[lang].closeModal}</button>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('.modal-close').onclick = close;
        modal.querySelector('.modal-close-btn').onclick = close;
        modal.onclick = (e) => { if(e.target === modal) close(); };
    };

    const populateDashboard = (res) => {
        // 1. Status
        document.getElementById('total-stock').textContent = res.stockStatus.totalUnits.toLocaleString();
        document.getElementById('total-value').textContent = `$${res.stockStatus.totalValue.toLocaleString()}`;
        document.getElementById('available-stock').textContent = res.stockStatus.available.toLocaleString();
        document.getElementById('committed-stock').textContent = res.stockStatus.committed.toLocaleString();

        // 2. Alerts
        renderAlertList('low-stock-list', res.criticalAlerts.lowStock, 'badge-warning');
        renderAlertList('out-of-stock-list', res.criticalAlerts.outOfStock, 'badge-danger');
        renderAlertList('excess-stock-list', [...new Set([...res.criticalAlerts.excessStock, ...res.criticalAlerts.deadStock])], 'badge-warning');

        // 3. Turnover
        renderTurnoverChart(res.turnoverAnalytics);
        const turnoverTable = document.getElementById('turnover-body');
        turnoverTable.innerHTML = res.turnoverAnalytics.slice(0, 5).map(t => `
            <tr>
                <td>${t.name}</td>
                <td><span class="badge ${t.turnoverRatio > 5 ? 'badge-success' : 'badge-warning'}">${t.turnoverRatio.toFixed(1)}</span></td>
            </tr>
        `).join('');

        // 4. Value
        renderCategoryValueChart(res.inventoryValue);
        document.getElementById('frozen-capital').textContent = `$${res.inventoryValue.frozenCapital.toLocaleString()}`;

        // 5 & 6. Performance
        const lang = localStorage.getItem('language') || 'es';
        const starList = document.getElementById('star-products-list');
        starList.innerHTML = res.starProducts.slice(0, 3).map(p => `
            <div class="alert-item">
                <span>${p.name}</span>
                <span class="badge badge-success">$${p.revenue.toLocaleString()}</span>
            </div>
        `).join('') || `<p style="color:var(--text-dim);">${translations[lang].noStars}</p>`;

        const probList = document.getElementById('problematic-products-list');
        probList.innerHTML = res.problematicProducts.slice(0, 3).map(p => `
            <div class="alert-item">
                <span>${p.name}</span>
                <span class="badge badge-danger">${translations[lang][p.reason] || p.reason}</span>
            </div>
        `).join('') || `<p style="color:var(--text-dim);">${translations[lang].noProblems}</p>`;

        // 7. Replenishment
        const replenishmentTable = document.getElementById('replenishment-body');
        replenishmentTable.innerHTML = res.replenishmentPredictions.map(p => {
            let badgeClass = 'badge-success';
            let actionText = translations[lang][p.action] || p.action;
            if (p.action === 'orderNow') {
                badgeClass = 'badge-danger';
            } else if (p.action === 'plan') {
                badgeClass = 'badge-warning';
            }

            return `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.daysRemaining === Infinity ? '∞' : p.daysRemaining} ${translations[lang].days}</td>
                    <td>${Math.round(p.suggestedOrder)} un.</td>
                    <td><span class="badge ${badgeClass}">${actionText}</span></td>
                </tr>
            `;
        }).join('') || `<tr><td colspan="4" style="text-align:center; color:var(--text-dim);">${translations[lang].healthyStock}</td></tr>`;

        // 8. Time Analysis
        renderTimeAnalysisChart(res.timeAnalysis);

        // 9. Efficiency
        document.getElementById('stockout-rate').textContent = `${res.efficiencyMetrics.stockoutRate.toFixed(1)}%`;
        document.getElementById('service-level').textContent = `${res.efficiencyMetrics.inventoryAccuracy}%`;

        // 10. Insights
        const insightsContainer = document.getElementById('insights-container');
        insightsContainer.innerHTML = '';
        
        if (res.automaticInsights.length === 0) {
            insightsContainer.innerHTML = `<p class="insight-text">${translateInsight('insightHealthy', {})}</p>`;
        } else {
            res.automaticInsights.forEach(insight => {
                const div = document.createElement('div');
                div.className = 'insight-text';
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.marginBottom = '0.5rem';
                div.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem; color:var(--primary);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <span>${translateInsight(insight.key, insight.data)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:0.5rem; opacity:0.5;"><polyline points="9 18 15 12 9 6"/></svg>
                `;
                div.onclick = () => showModal('modalTitle', insight.products);
                insightsContainer.appendChild(div);
            });
        }
    };

    const renderAlertList = (id, list, badgeClass) => {
        const lang = localStorage.getItem('language') || 'es';
        const el = document.getElementById(id);
        el.innerHTML = list.slice(0, 5).map(name => `
            <li class="alert-item">
                <span>${name}</span>
                <span class="badge ${badgeClass}">${translations[lang].critical}</span>
            </li>
        `).join('') || `<li class="alert-item" style="color:var(--text-dim);">${translations[lang].noAlerts}</li>`;
    };

    const showDashboard = () => {
        uploadSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        resetButton.style.display = 'inline-block';
    };

    const resetToUpload = () => {
        uploadSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        resetButton.style.display = 'none';
        fileInput.value = '';
        feedback.style.display = 'none';
        destroyCharts();
    };

    const showFeedback = (msg, type) => {
        feedback.textContent = msg;
        feedback.className = `feedback-message ${type}`;
        feedback.style.display = 'block';
        feedback.style.color = type === 'error' ? 'var(--danger)' : 'var(--success)';
    };

    // Events
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    resetButton.addEventListener('click', resetToUpload);
    langSwitcher.addEventListener('change', (e) => {
        setLanguage(e.target.value);
        if (window.lastResults) {
            destroyCharts();
            populateDashboard(window.lastResults);
        }
    });

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    // Init
    initLocalization();
});
