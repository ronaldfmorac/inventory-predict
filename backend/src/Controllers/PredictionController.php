<?php

namespace Controllers;

use Services\PredictionService;
use Throwable;

require_once __DIR__ . '/../Models/SalesData.php';

class PredictionController
{
    private PredictionService $predictionService;

    /**
     * Constructor to inject the PredictionService dependency.
     * @param PredictionService $predictionService
     */
    public function __construct(PredictionService $predictionService)
    {
        $this->predictionService = $predictionService;
    }

    /**
     * Handles the incoming prediction request, validates data,
     * calls the service, and formats the response.
     * @param array $salesData
     * @return array A response array with statusCode and body.
     */
    public function handlePredictionRequest(array $salesData): array
    {
        try {
            // --- Input Validation ---
            if (empty($salesData)) {
                return $this->createResponse(400, ['error' => 'Sales data cannot be empty.']);
            }

            // Map raw array data to SalesData model objects for type safety and clarity
            $salesModels = [];
            foreach ($salesData as $row) {
                if (!isset($row['producto'], $row['fecha'], $row['cantidad'])) {
                    return $this->createResponse(400, ['error' => 'Each sales record must contain "producto", "fecha", and "cantidad".']);
                }
                $salesModels[] = new \Models\SalesData($row['producto'], $row['fecha'], $row['cantidad']);
            }

            // --- Delegate to Service Layer ---
            $result = $this->predictionService->generatePredictions($salesModels);

            // --- Format and Return Response ---
            return $this->createResponse(200, $result);

        } catch (Throwable $e) {
            // In a real app, log the error ($e->getMessage(), $e->getTraceAsString())
            return $this->createResponse(500, ['error' => 'An internal error occurred during prediction.']);
        }
    }

    /**
     * Helper function to create a consistent response structure.
     * @param int $statusCode
     * @param array $body
     * @return array
     */
    private function createResponse(int $statusCode, array $body): array
    {
        return [
            'statusCode' => $statusCode,
            'body' => $body
        ];
    }
}
