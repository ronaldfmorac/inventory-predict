# Architecture Documentation: Inventory-Predict

This document outlines the software architecture for the Inventory-Predict application, covering the separation of concerns, data flow, and potential for future evolution.

## 1. Core Architectural Principle: Decoupled Frontend and Backend

The system is designed as two distinct applications:

1.  **Frontend (Client)**: A static web application responsible for user interface, user experience, and client-side data processing.
2.  **Backend (Server)**: A stateless REST API responsible for server-side processing, business logic, and preparing for future data persistence.

This separation is a key principle of modern web development and provides several advantages:
- **Independent Development**: Frontend and backend teams can work in parallel with minimal friction.
- **Scalability**: The frontend can be served from a simple CDN (like Netlify or Vercel), while the backend API can be scaled independently on servers based on load.
- **Technology Flexibility**: The frontend could be rewritten in a framework like React or Vue without impacting the backend. Similarly, the backend could be migrated to another language (like Node.js or Python) without requiring changes to the frontend, as long as the API contract is maintained.
- **Maintainability**: Codebases are smaller and more focused, making them easier to understand, debug, and update.

---

## 2. Data Flow

The application supports two distinct data flow models, corresponding to its two operational modes.

### 2.1. Offline Mode Data Flow

In this mode, no server is involved. All processing occurs within the user's browser.

1.  **User Action**: The user drags and drops or selects a CSV file.
2.  **Parsing**: The JavaScript `parser.js` module, using the Papa Parse library, reads the file from the user's memory. It parses the raw text into a structured JavaScript array of objects.
3.  **Analysis**: The `analytics.js` module receives the parsed data. It performs all calculations: grouping data by product, calculating sales velocity, identifying top sellers, and forecasting future demand.
4.  **Visualization**: The `charts.js` module and the main `app.js` logic take the analyzed data. They render charts using Chart.js and populate the dashboard's HTML elements with the calculated metrics and predictions.

```
[User's Computer]
      |
(1) CSV File --> [Browser] --(2)--> [Papa Parse] --> (Parsed JSON)
                                                         |
                                                        (3)
                                                         |
                                                         V
                                                  [analytics.js] --> (Analyzed Data)
                                                         |
                                                        (4)
                                                         |
                                                         V
                                    [DOM & Chart.js] --> (Dashboard UI)
```

### 2.2. Online Mode Data Flow

This mode offloads the analytical work to the server.

1.  **User Action & Parsing**: Same as Offline Mode. The browser first parses the CSV to create a structured JSON payload.
2.  **API Request**: The `api.js` module sends the JSON payload to the PHP backend via an asynchronous `fetch` POST request to the `/api/predict` endpoint.
3.  **Backend Processing**:
    a. The `public/index.php` acts as a router, directing the request to `routes/api.php`.
    b. The `PredictionController.php` receives the HTTP request. It validates the incoming data.
    c. The controller delegates the core logic to `PredictionService.php`.
    d. The service performs the complex calculations (demand, reorder points, etc.) and returns a structured result, potentially using `Models` to define the data shape.
4.  **API Response**: The controller receives the result from the service, encodes it as a JSON string, and sends it back to the client with a `200 OK` status.
5.  **Visualization**: The frontend's `api.js` module receives the JSON response. The `app.js` logic then uses this data to populate the dashboard and render the charts, similar to the final step of the offline flow.

```
[Browser]                                       [Server (PHP)]
   |                                                   |
(1) Parsed JSON --(2)--> POST /api/predict ----------> [Controller]
   |                                                   |
   |                                                  (3)
   |                                                   |
(5) JSON Response <--(4)-- GET Response <------------ [Service] --> (Analyzed Data)
   |
   V
[DOM & Chart.js] --> (Dashboard UI)
```

---

## 3. Backend Architecture: Controller, Service, Model

The PHP backend is intentionally kept simple but follows professional design patterns to ensure it's easy to maintain and extend.

- **Controllers (`/src/Controllers`)**: Their sole responsibility is to handle HTTP requests and responses. They should be "thin," meaning they contain minimal business logic. They parse input, call a service, and format the output.
- **Services (`/src/Services`)**: This is where the core business logic lives. All calculations, data aggregation, and decision-making for predictions happen here. They are completely unaware of the HTTP context. This makes them highly reusable and easy to test independently.
- **Models (`/src/Models`)**: These are simple classes (Data Transfer Objects or DTOs) that define the "shape" of data. For example, a `SalesData` model could define what a single sales record looks like. This promotes type safety and makes the code more self-documenting.

---

## 4. Possible Evolution to a Full SaaS Platform

This architecture is the perfect foundation for evolving into a full-featured Software as a Service (SaaS) product.

- **Step 1: Database Integration**:
    - The `PredictionService` would be updated to interact with a database (e.g., MySQL, PostgreSQL) via a new `Repository` layer.
    - Sales data would be saved for each user, allowing for historical analysis without needing to re-upload files.
    - User predictions and settings would be persisted.

- **Step 2: User Authentication**:
    - A `UserController` and `AuthService` would be added to manage user registration, login, and sessions (e.g., using JWT - JSON Web Tokens).
    - All API endpoints would be protected, requiring a valid token.

- **Step 3: Multi-Tenancy**:
    - The database schema and application logic would be updated to ensure that users can only access their own data.

- **Step 4: Background Jobs**:
    - For very large datasets, a queue system (like Redis or RabbitMQ) could be introduced. The user would upload a file, the API would return an immediate "Processing" response, and a background worker would handle the analysis and notify the user when the dashboard is ready.

This evolutionary path is possible because the initial design is modular and respects the separation of concerns.
