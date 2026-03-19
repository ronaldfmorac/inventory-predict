/**
 * This module handles communication with the backend API for "Online Mode".
 */

// IMPORTANT: This URL must be configured to point to your PHP backend's public directory.
// For example, if you set up the backend at http://localhost/my-project/backend/
// then the endpoint should be 'http://localhost/my-project/backend/public/'
const API_ENDPOINT = 'http://localhost/inventory-predict/backend/public/api/predict';


/**
 * Sends sales data to the backend API and retrieves predictions.
 * @param {Array<Object>} data The parsed sales data to be sent.
 * @returns {Promise<Object>} A promise that resolves with the structured analysis from the API.
 */
async function getApiPrediction(data) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ salesData: data })
        });

        if (!response.ok) {
            // Try to get a more detailed error from the response body
            const errorBody = await response.json().catch(() => null);
            const errorMessage = errorBody ? errorBody.error : `HTTP error! Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('API Communication Error:', error);
        // Provide a user-friendly error message
        throw new Error(`Could not connect to the server or an API error occurred. Please check the API endpoint configuration and ensure the server is running. Details: ${error.message}`);
    }
}
