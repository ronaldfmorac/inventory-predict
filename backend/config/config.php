<?php

/**
 * Global configuration settings for the application.
 * In a real-world scenario, you might load these from a .env file.
 */

// --- Prediction Logic Configuration ---

// Default lead time in days for reordering products.
// This represents the time it takes from placing an order to receiving the stock.
define('DEFAULT_LEAD_TIME', 14);

// Number of days of sales to hold as a safety buffer.
// This helps prevent stockouts due to demand variability or supplier delays.
define('SAFETY_STOCK_DAYS', 7);


// --- Status Thresholds ---
// These values determine the "Status" in the prediction table.

// If estimated days of stock are below this value, the status is "Critical".
define('CRITICAL_STOCK_THRESHOLD_DAYS', 15);

// If estimated days of stock are below this value (but above critical), the status is "Warning".
define('WARNING_STOCK_THRESHOLD_DAYS', 30);
