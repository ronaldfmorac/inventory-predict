<?php

namespace Services;

use DateTime;

class PredictionService
{
    /**
     * Main service method to generate predictions from sales data.
     * @param \Models\SalesData[] $salesData
     * @return array
     */
    public function generatePredictions(array $salesData): array
    {
        // 1. Group sales by product
        $salesByProduct = $this->groupSalesByProduct($salesData);

        // 2. Perform calculations for each product
        $predictions = [];
        foreach ($salesByProduct as $productName => $productData) {
            $productSales = $productData['sales'];
            
            $dailyDemand = $this->calculateAverageDailyDemand($productSales);
            $movingAverage = $this->calculateMovingAverage($productSales, 30);
            
            // The concept of "stock left" is hypothetical without a current inventory level.
            // We'll use the total sales as a hypothetical stock number to calculate depletion rate.
            $daysOfStockLeft = $dailyDemand > 0 ? $productData['totalSales'] / $dailyDemand : INF;
            
            $reorderPoint = $this->calculateReorderPoint($dailyDemand);

            // Determine status based on thresholds from config
            $status = 'OK';
            if ($daysOfStockLeft < CRITICAL_STOCK_THRESHOLD_DAYS) {
                $status = 'Critical';
            } elseif ($daysOfStockLeft < WARNING_STOCK_THRESHOLD_DAYS) {
                $status = 'Warning';
            }

            $predictions[] = [
                'product' => $productName,
                'avgDailyDemand' => $dailyDemand,
                'movingAverage' => $movingAverage,
                'daysOfStockLeft' => is_infinite($daysOfStockLeft) ? null : $daysOfStockLeft,
                'reorderPoint' => $reorderPoint,
                'status' => $status
            ];
        }
        
        // 3. Prepare data for other dashboard components
        return [
            'keyMetrics' => $this->calculateKeyMetrics($salesData, $salesByProduct),
            'salesTrend' => $this->getSalesTrend($salesData),
            'topProducts' => $this->getTopProducts($salesByProduct, 5),
            'predictions' => $predictions,
        ];
    }

    private function groupSalesByProduct(array $salesData): array
    {
        $grouped = [];
        foreach ($salesData as $sale) {
            $productName = $sale->producto;
            if (!isset($grouped[$productName])) {
                $grouped[$productName] = ['totalSales' => 0, 'sales' => []];
            }
            $grouped[$productName]['totalSales'] += $sale->cantidad;
            $grouped[$productName]['sales'][] = ['date' => new DateTime($sale->fecha), 'quantity' => $sale->cantidad];
        }
        return $grouped;
    }

    private function calculateAverageDailyDemand(array $sales): float
    {
        if (count($sales) < 2) {
            return count($sales) === 1 ? $sales[0]['quantity'] : 0.0;
        }

        usort($sales, fn($a, $b) => $a['date'] <=> $b['date']);
        $firstDay = $sales[0]['date'];
        $lastDay = end($sales)['date'];
        
        $diff = $lastDay->diff($firstDay);
        $totalDays = $diff->days + 1;
        
        $totalQuantity = array_reduce($sales, fn($sum, $s) => $sum + $s['quantity'], 0);

        return $totalDays > 0 ? (float)$totalQuantity / $totalDays : 0.0;
    }
    
    private function calculateMovingAverage(array $sales, int $periodDays): float
    {
        $endDate = new DateTime();
        $startDate = (new DateTime())->modify("-{$periodDays} days");

        $recentSales = array_filter($sales, fn($s) => $s['date'] >= $startDate && $s['date'] <= $endDate);
        if (empty($recentSales)) return 0.0;
        
        $totalRecentQuantity = array_reduce($recentSales, fn($sum, $s) => $sum + $s['quantity'], 0);
        
        // This calculates the average *per sale day*, not per day in the period.
        return (float)$totalRecentQuantity / count($recentSales);
    }

    private function calculateReorderPoint(float $avgDailyDemand): int
    {
        $demandDuringLeadTime = $avgDailyDemand * DEFAULT_LEAD_TIME;
        $safetyStock = $avgDailyDemand * SAFETY_STOCK_DAYS;
        return (int)ceil($demandDuringLeadTime + $safetyStock);
    }

    private function calculateKeyMetrics(array $data, array $salesByProduct): array
    {
        $topProduct = ['name' => null, 'totalSales' => 0];
        foreach ($salesByProduct as $name => $prodData) {
            if ($prodData['totalSales'] > $topProduct['totalSales']) {
                $topProduct = ['name' => $name, 'totalSales' => $prodData['totalSales']];
            }
        }

        $highestSale = ['name' => null, 'quantity' => 0, 'date' => null];
        foreach ($data as $sale) {
            if ($sale->cantidad > $highestSale['quantity']) {
                $highestSale = ['name' => $sale->producto, 'quantity' => $sale->cantidad, 'date' => $sale->fecha];
            }
        }

        return [
            'topProduct' => $topProduct,
            'highestSingleDaySale' => $highestSale,
            'totalUniqueProducts' => count($salesByProduct),
        ];
    }

    private function getSalesTrend(array $data): array
    {
        $trend = [];
        foreach ($data as $sale) {
            $date = $sale->fecha;
            if (!isset($trend[$date])) $trend[$date] = 0;
            $trend[$date] += $sale->cantidad;
        }
        ksort($trend);
        return ['labels' => array_keys($trend), 'values' => array_values($trend)];
    }

    private function getTopProducts(array $salesByProduct, int $count): array
    {
        uasort($salesByProduct, fn($a, $b) => $b['totalSales'] <=> $a['totalSales']);
        $top = array_slice($salesByProduct, 0, $count, true);
        
        return [
            'labels' => array_keys($top),
            'values' => array_map(fn($p) => $p['totalSales'], $top)
        ];
    }
}
