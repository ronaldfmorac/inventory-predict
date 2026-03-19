<?php

use Controllers\PredictionController;
use Services\PredictionService;

// Ensure this script is not accessed directly
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    http_response_code(403);
    die('Forbidden');
}

// Set content type to JSON
header('Content-Type: application/json');

// --- Request Method Validation ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST method is accepted.']);
    exit;
}

// --- Dependency Injection ---
// In a larger framework, this would be handled by a DI container.
// Here, we manually instantiate the dependencies.
$predictionService = new PredictionService();
$predictionController = new PredictionController($predictionService);

// --- Handle Request ---
// Get raw POST data
$jsonPayload = file_get_contents('php://input');
$data = json_decode($jsonPayload, true);

// Check if JSON is valid and has the 'salesData' key
if (json_last_error() !== JSON_ERROR_NONE || !isset($data['salesData'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'error' => 'Invalid JSON payload or missing "salesData" key.'
    ]);
    exit;
}

// Call the controller method to handle the request
$response = $predictionController->handlePredictionRequest($data['salesData']);

// --- Send Response ---
http_response_code($response['statusCode']);
echo json_encode($response['body']);

