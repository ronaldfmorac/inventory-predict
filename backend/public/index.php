<?php

// --- Basic Security Headers ---
header("Content-Security-Policy: default-src 'self'");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

// --- CORS Handling for Frontend Development ---
// WARNING: For production, you should restrict this to your specific frontend domain.
// Example: header("Access-Control-Allow-Origin: https://your-frontend-app.com");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// --- Autoloader and Configuration ---
// A simple autoloader for our class structure (Controller, Service, Model)
spl_autoload_register(function ($class) {
    // Project-specific namespace prefix
    $prefix = ''; // This project doesn't use a formal namespace like App

    // Base directory for the namespace prefix
    $base_dir = __DIR__ . '/../src/';

    // Does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // no, move to the next registered autoloader
        return;
    }

    // Get the relative class name
    $relative_class = substr($class, $len);

    // Replace the namespace prefix with the base directory, replace namespace
    // separators with directory separators in the relative class name, append
    // with .php
    $file = $base_dir . str_replace('', '/', $relative_class) . '.php';

    // If the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});

// Load configuration
require_once __DIR__ . '/../config/config.php';


// --- Simple Routing ---
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = str_replace('/index.php', '', $_SERVER['SCRIPT_NAME']);
$route = str_replace($basePath, '', $requestUri);

// Define API routes
$apiRoutes = [
    '/api/predict' => __DIR__ . '/../routes/api.php',
];

// --- Route Matching and Dispatching ---
if (isset($apiRoutes[$route])) {
    try {
        require $apiRoutes[$route];
    } catch (Throwable $e) {
        // Generic error handler
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'error' => 'An internal server error occurred.',
            'details' => $e->getMessage() // On a production system, you might want to log this instead of showing it
        ]);
    }
} else {
    // Handle 404 Not Found
    header("Content-Type: application/json");
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found.']);
}
