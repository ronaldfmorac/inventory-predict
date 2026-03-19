// --- Language Translations ---
const translations = {
    en: {
        // ... (existing keys) ...
        appTitle: "ROI Inventory Intelligence",
        statusTitle: "Current Inventory Status",
        totalStock: "Total Stock",
        product: "Product",
        inventoryValue: "Inventory Value",
        availableStock: "Available Stock",
        committedStock: "Committed Stock",
        alertsTitle: "Critical Alerts",
        lowStock: "Low Stock",
        outOfStock: "Out of Stock",
        excessStock: "Excess Stock",
        deadStock: "Dead Stock",
        turnoverTitle: "Inventory Turnover",
        daysToSell: "Avg Days to Sell",
        turnoverRatio: "Turnover Index",
        valCategoryTitle: "Value by Category",
        frozenCapital: "Frozen Capital",
        performanceTitle: "Product Performance",
        starProductsTitle: "Star Products",
        problematicTitle: "Problematic Products",
        topRevenue: "Top Revenue",
        topMargin: "Top Margin",
        replenishmentTitle: "Replenishment Prediction",
        stockLeft: "Days Left",
        suggestedOrder: "Suggested Order",
        demandAnalysisTitle: "Demand Analysis",
        action: "Action",
        efficiencyTitle: "Efficiency Control",
        stockoutRate: "Stockout Rate",
        serviceLevel: "Service Level",
        insightsTitle: "Automatic Insights",
        uploadPrompt: "Upload your inventory CSV to get started",
        csvFormatNote: "Required: producto, fecha, cantidad. Recommended: categoria, stock_actual, stock_comprometido, costo, precio.",
        // Keep old keys for compatibility
        offlineMode: "Offline Mode",
        onlineMode: "Online Mode",
        uploadHeader: "Inventory Intelligence",
        uploadSubheader: "Upload a single CSV with your sales history and current stock levels.",
        browseFiles: "Browse Files",
        dashboardTitle: "Smart Inventory Dashboard",
        resetButton: "New Analysis",
        footerText: "Premium Inventory Tool",
        // Insights Templates
        insightFrozenCapital: "You would free up ${amount} in cash by reducing dead stock.",
        insightOutOfStock: "You are losing sales in ${count} products due to lack of stock.",
        insightLowMargin: "You have ${count} products operating with zero or negative margin.",
        insightHealthy: "Your purchases are well aligned with demand.",
        modalTitle: "Affected Products",
        closeModal: "Close",
        // Efficiency Sub-labels
        stockoutRateDesc: "Current products with 0 stock",
        serviceLevelDesc: "Percentage of demand satisfied",
        demandChartLabel: "Units Sold",
        demandChartCategory: "By Category",
        downloadExample: "Download Sample CSV",
        noStars: "No stars detected yet.",
        noProblems: "No problematic products detected.",
        healthyStock: "Healthy stock levels",
        // Dynamic labels
        orderNow: "Order NOW",
        plan: "Plan",
        days: "days",
        critical: "Critical",
        noAlerts: "No alerts",
        // Analytics specific
        lowMarginReason: "Low Margin",
        slowMovementReason: "Slow Movement",
        ok: "OK",
        csvError: "The CSV must contain at least the columns: 'producto', 'fecha' and 'cantidad'."
    },
    es: {
        appTitle: "ROI Inteligencia de Inventario",
        statusTitle: "Estado del Inventario",
        totalStock: "Stock Total",
        product: "Producto",
        inventoryValue: "Valor Inventario",
        availableStock: "Stock Disponible",
        committedStock: "Stock Comprometido",
        alertsTitle: "Alertas Críticas",
        lowStock: "Stock Bajo",
        outOfStock: "Agotados",
        excessStock: "Exceso de Stock",
        deadStock: "Sin Movimiento",
        turnoverTitle: "Rotación de Inventario",
        daysToSell: "Días Prom. p/ Venta",
        turnoverRatio: "Índice de Rotación",
        valCategoryTitle: "Valor por Categoría",
        frozenCapital: "Capital Inmovilizado",
        problematicTitle: "Productos Problemáticos",
        performanceTitle: "Rendimiento de Productos",
        starProductsTitle: "Productos Estrella",
        topRevenue: "Mayores Ventas",
        topMargin: "Mayor Margen",
        replenishmentTitle: "Predicción de Reposición",
        stockLeft: "Días Restantes",
        suggestedOrder: "Pedido Sugerido",
        demandAnalysisTitle: "Análisis de la Demanda",
        action: "Acción",
        efficiencyTitle: "Control de Eficiencia",
        stockoutRate: "Tasa de Quiebre",
        serviceLevel: "Nivel de Servicio",
        insightsTitle: "Insights Automáticos",
        uploadPrompt: "Sube tu CSV de inventario para comenzar",
        csvFormatNote: "Requerido: producto, fecha, cantidad. Recomendado: categoria, stock_actual, stock_comprometido, costo, precio.",
        offlineMode: "Modo Offline",
        onlineMode: "Modo Online",
        uploadHeader: "Inteligencia de Inventario",
        uploadSubheader: "Sube un único CSV con tu historial de ventas y niveles actuales de stock.",
        browseFiles: "Buscar Archivos",
        dashboardTitle: "Panel de Inventario Inteligente",
        resetButton: "Nuevo Análisis",
        footerText: "Herramienta de Inventario Premium",
        // Insights Templates
        insightFrozenCapital: "Liberarías ${amount} en efectivo si reduces el dead stock.",
        insightOutOfStock: "Estás perdiendo ventas en ${count} productos por falta de stock.",
        insightLowMargin: "Tienes ${count} productos operando con margen negativo o cero.",
        insightHealthy: "Tus compras están bien alineadas con la demanda.",
        modalTitle: "Productos Afectados",
        closeModal: "Cerrar",
        // Efficiency Sub-labels
        stockoutRateDesc: "Productos actuales con stock 0",
        serviceLevelDesc: "Porcentaje de demanda satisfecha",
        demandChartLabel: "Unidades Vendidas",
        demandChartCategory: "Por Categoría",
        downloadExample: "Descargar CSV de Ejemplo",
        noStars: "No hay productos estrella detectados aún.",
        noProblems: "No hay productos problemáticos detectados.",
        healthyStock: "Niveles de stock saludables",
        // Dynamic labels
        orderNow: "Solicitar YA",
        plan: "Planificar",
        days: "días",
        critical: "Crítico",
        noAlerts: "Sin alertas",
        // Analytics specific
        lowMarginReason: "Bajo Margen",
        slowMovementReason: "Lento Movimiento",
        ok: "OK",
        csvError: "El CSV debe contener al menos las columnas: 'producto', 'fecha' y 'cantidad'."
    },
    it: {
        appTitle: "ROI Intelligenza di Inventario",
        statusTitle: "Stato dell'Inventario",
        totalStock: "Stock Totale",
        product: "Prodotto",
        inventoryValue: "Valore Inventario",
        availableStock: "Stock Disponibile",
        committedStock: "Stock Impegnato",
        alertsTitle: "Avvisi Critici",
        lowStock: "Sottoscorta",
        outOfStock: "Esaurito",
        excessStock: "Eccesso di Stock",
        deadStock: "Senza Movimento",
        turnoverTitle: "Rotazione Inventario",
        daysToSell: "Giorni Medi Vendita",
        turnoverRatio: "Indice di Rotazione",
        valCategoryTitle: "Valore per Categoria",
        frozenCapital: "Capitale Immobilizzato",
        performanceTitle: "Rendimento Prodotti",
        starProductsTitle: "Prodotti Stella",
        problematicTitle: "Prodotti Problematici",
        topRevenue: "Maggiori Ricavi",
        topMargin: "Maggior Margine",
        replenishmentTitle: "Previsione di Rifornimento",
        stockLeft: "Giorni Rimanenti",
        suggestedOrder: "Ordine Suggerito",
        demandAnalysisTitle: "Analisi della Domanda",
        action: "Azione",
        efficiencyTitle: "Controllo Efficienza",
        stockoutRate: "Tasso di Rottura",
        serviceLevel: "Livello di Servizio",
        insightsTitle: "Approfondimenti Automatici",
        uploadPrompt: "Carica il tuo CSV dell'inventario per iniziare",
        csvFormatNote: "Richiesto: prodotto, data, quantità. Consigliato: categoria, stock_attuale, stock_impegnato, costo, prezzo.",
        offlineMode: "Modalità Offline",
        onlineMode: "Modalità Online",
        uploadHeader: "Intelligenza di Inventario",
        uploadSubheader: "Carica un singolo CSV con la tua cronologia delle vendite e i livelli attuali di stock.",
        browseFiles: "Sfoglia File",
        dashboardTitle: "Dashboard Inventario Intelligente",
        resetButton: "Nuova Analisi",
        footerText: "Strumento Inventario Premium",
        // Insights Templates
        insightFrozenCapital: "Libereresti ${amount} in contanti riducendo lo stock inattivo.",
        insightOutOfStock: "Stai perdendo vendite in ${count} prodotti a causa della mancanza di stock.",
        insightLowMargin: "Hai ${count} prodotti che operano con margine zero o negativo.",
        insightHealthy: "I tuoi acquisti sono ben allineati con la domanda.",
        modalTitle: "Prodotti Interessati",
        closeModal: "Chiudi",
        // Efficiency Sub-labels
        stockoutRateDesc: "Prodotti attuali con stock 0",
        serviceLevelDesc: "Percentuale di domanda soddisfatta",
        demandChartLabel: "Unità Vendute",
        demandChartCategory: "Per Categoria",
        downloadExample: "Scarica CSV di esempio",
        noStars: "Ancora nessun prodotto stella rilevato.",
        noProblems: "Nessun prodotto problematico rilevato.",
        healthyStock: "Livelli di stock sani",
        // Dynamic labels
        orderNow: "Ordina ORA",
        plan: "Pianifica",
        days: "giorni",
        critical: "Critico",
        noAlerts: "Nessun avviso",
        // Analytics specific
        lowMarginReason: "Basso Margine",
        slowMovementReason: "Movimento Lento",
        ok: "OK",
        csvError: "Il CSV deve contenere almeno le colonne: 'prodotto', 'data' e 'quantità'."
    }
};

/**
 * Sets the language of the UI by updating all elements with a data-lang-key attribute.
 * @param {string} lang - The language code (e.g., 'en', 'es', 'it').
 */
function setLanguage(lang) {
    // Save preference to localStorage
    localStorage.setItem('language', lang);

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Update dynamic text if needed (e.g., placeholders)
    // document.getElementById('some-input').placeholder = translations[lang]['somePlaceholderKey'];
}

/**
 * Initializes the localization system.
 * Checks localStorage for a saved language or defaults to English.
 */
function initLocalization() {
    const savedLang = localStorage.getItem('language') || 'en';
    const langSwitcher = document.getElementById('lang-switcher');
    
    if (langSwitcher) {
        langSwitcher.value = savedLang;
    }
    
    setLanguage(savedLang);
}
