function analyzeDataOffline(data) {
    const products = groupDataByProduct(data);
    
    return {
        stockStatus: calculateStockStatus(products),
        criticalAlerts: identifyCriticalAlerts(products),
        turnoverAnalytics: calculateTurnover(products),
        inventoryValue: calculateInventoryValue(products),
        problematicProducts: identifyProblematicProducts(products),
        starProducts: identifyStarProducts(products),
        replenishmentPredictions: generateReplenishmentPredictions(products),
        timeAnalysis: calculateTimeAnalysis(data),
        efficiencyMetrics: calculateEfficiency(products, data),
        automaticInsights: generateInsights(products, data)
    };
}

function groupDataByProduct(data) {
    const products = {};
    data.forEach(row => {
        const name = row.producto;
        if (!products[name]) {
            products[name] = {
                name: name,
                category: row.categoria,
                stockActual: row.stock_actual,
                stockComprometido: row.stock_comprometido,
                costo: row.costo,
                precio: row.precio,
                sales: [],
                totalSold: 0
            };
        }
        products[name].sales.push({ date: new Date(row.fecha), quantity: row.cantidad });
        products[name].totalSold += row.cantidad;
    });
    return products;
}

function calculateStockStatus(products) {
    let totalUnits = 0;
    let totalValue = 0;
    let available = 0;
    let committed = 0;

    Object.values(products).forEach(p => {
        totalUnits += p.stockActual;
        totalValue += p.stockActual * p.costo;
        available += Math.max(0, p.stockActual - p.stockComprometido);
        committed += p.stockComprometido;
    });

    return { totalUnits, totalValue, available, committed };
}

function identifyCriticalAlerts(products) {
    const alerts = { lowStock: [], outOfStock: [], excessStock: [], deadStock: [] };
    const now = new Date();

    Object.values(products).forEach(p => {
        const avgDemand = calculateAvgDemand(p.sales);
        const daysOfStock = avgDemand > 0 ? p.stockActual / avgDemand : 999;
        const lastSaleDate = p.sales.length > 0 ? new Date(Math.max(...p.sales.map(s => s.date))) : null;
        const daysSinceLastSale = lastSaleDate ? (now - lastSaleDate) / (1000 * 60 * 60 * 24) : 999;

        // 1. Out of Stock (Only if it's a product that moves)
        if (p.stockActual <= 0) {
            if (avgDemand > 0.1 || daysSinceLastSale < 30) {
                alerts.outOfStock.push(p.name);
            }
        } 
        // 2. Low Stock
        else if (daysOfStock < 7) {
            alerts.lowStock.push(p.name);
        }
        
        // 3. Excess Stock (High stock compared to demand)
        if (p.stockActual > 0 && daysOfStock > 180 && avgDemand > 0) {
            alerts.excessStock.push(p.name);
        }

        // 4. Dead Stock (Stock > 0 AND no sales in 90 days)
        if (p.stockActual > 0 && daysSinceLastSale > 90) {
            alerts.deadStock.push(p.name);
        }
    });
    return alerts;
}

function calculateTurnover(products) {
    return Object.values(products).map(p => {
        const avgDemand = calculateAvgDemand(p.sales);
        return {
            name: p.name,
            frequency: p.sales.length,
            avgDaysToSell: avgDemand > 0 ? 1 / avgDemand : 0,
            turnoverRatio: avgDemand > 0 ? (avgDemand * 365) / (p.stockActual || 1) : 0
        };
    }).sort((a, b) => b.turnoverRatio - a.turnoverRatio);
}

function calculateInventoryValue(products) {
    const byCategory = {};
    let frozenCapital = 0;
    const now = new Date();

    Object.values(products).forEach(p => {
        if (!byCategory[p.category]) byCategory[p.category] = 0;
        const val = p.stockActual * p.costo;
        byCategory[p.category] += val;

        const avgDemand = calculateAvgDemand(p.sales);
        const lastSaleDate = p.sales.length > 0 ? new Date(Math.max(...p.sales.map(s => s.date))) : null;
        const daysSinceLastSale = lastSaleDate ? (now - lastSaleDate) / (1000 * 60 * 60 * 24) : 999;

        // Frozen Capital: Stock > 0 AND (No demand OR No sales in 90 days)
        if (p.stockActual > 0 && (avgDemand < 0.01 || daysSinceLastSale > 90)) {
            frozenCapital += val;
        }
    });

    return { total: calculateStockStatus(products).totalValue, byCategory, frozenCapital };
}

function identifyProblematicProducts(products) {
    return Object.values(products).filter(p => {
        const margin = p.precio - p.costo;
        const avgDemand = calculateAvgDemand(p.sales);
        return (margin <= 0) || (avgDemand < 0.1 && p.stockActual > 50);
    }).map(p => ({ name: p.name, reason: p.precio <= p.costo ? "Bajo Margen" : "Lento Movimiento" }));
}

function identifyStarProducts(products) {
    return Object.values(products).map(p => {
        const margin = p.precio - p.costo;
        const revenue = p.totalSold * p.precio;
        return { name: p.name, margin, revenue, totalSold: p.totalSold };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
}

function generateReplenishmentPredictions(products) {
    return Object.values(products).map(p => {
        const avgDemand = calculateAvgDemand(p.sales);
        const daysRemaining = avgDemand > 0 ? Math.floor(p.stockActual / avgDemand) : Infinity;
        return {
            name: p.name,
            daysRemaining,
            suggestedOrder: avgDemand * 30, // Order for next 30 days
            action: daysRemaining < 10 ? "Solicitar YA" : (daysRemaining < 20 ? "Planificar" : "OK")
        };
    }).filter(p => p.daysRemaining < 30);
}

function calculateTimeAnalysis(data) {
    const daily = {};
    data.forEach(d => {
        if (!daily[d.fecha]) daily[d.fecha] = {};
        if (!daily[d.fecha][d.categoria]) daily[d.fecha][d.categoria] = 0;
        daily[d.fecha][d.categoria] += d.cantidad;
    });
    return daily;
}

function calculateEfficiency(products, data) {
    const totalProducts = Object.keys(products).length;
    if (totalProducts === 0) return { stockoutRate: 0, inventoryAccuracy: 100 };

    // Stockout Rate: % of items currently at 0 stock
    const outOfStockCount = Object.values(products).filter(p => p.stockActual <= 0).length;
    const stockoutRate = (outOfStockCount / totalProducts) * 100;

    // Service Level: (Actual Sales / (Actual Sales + Estimated Lost Sales)) * 100
    // We estimate lost sales as: AvgDailyDemand * 7 days (if stock is 0 and it's a moving product)
    let totalRealSales = 0;
    let totalEstimatedLostSales = 0;

    Object.values(products).forEach(p => {
        totalRealSales += p.totalSold;
        if (p.stockActual <= 0) {
            const avgDemand = calculateAvgDemand(p.sales);
            if (avgDemand > 0.1) {
                // Estimate lost sales for a week of stockout
                totalEstimatedLostSales += avgDemand * 7; 
            }
        }
    });

    const totalDemand = totalRealSales + totalEstimatedLostSales;
    const serviceLevel = totalDemand > 0 ? (totalRealSales / totalDemand) * 100 : 100;

    return {
        stockoutRate,
        inventoryAccuracy: Math.round(serviceLevel) // Using service level as the primary KPI here
    };
}

function generateInsights(products, data) {
    const insights = [];
    const val = calculateInventoryValue(products);
    const alerts = identifyCriticalAlerts(products);

    if (val.frozenCapital > 1000) {
        insights.push({
            key: 'insightFrozenCapital',
            data: { amount: val.frozenCapital },
            products: [...alerts.excessStock, ...alerts.deadStock]
        });
    }

    if (alerts.outOfStock.length > 0) {
        insights.push({
            key: 'insightOutOfStock',
            data: { count: alerts.outOfStock.length },
            products: alerts.outOfStock
        });
    }

    const lowMarginProducts = identifyProblematicProducts(products).filter(p => p.reason === "Bajo Margen");
    if (lowMarginProducts.length > 0) {
        insights.push({
            key: 'insightLowMargin',
            data: { count: lowMarginProducts.length },
            products: lowMarginProducts.map(p => p.name)
        });
    }

    return insights;
}

// Helper: Average Daily Demand
function calculateAvgDemand(sales) {
    if (sales.length === 0) return 0;
    const sorted = [...sales].sort((a, b) => a.date - b.date);
    const first = sorted[0].date;
    const last = sorted[sorted.length - 1].date;
    const diffDays = Math.max(1, (last - first) / (1000 * 60 * 60 * 24));
    const total = sales.reduce((sum, s) => sum + s.quantity, 0);
    return total / diffDays;
}
