# Inventory-Predict 📈

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4.svg?logo=php)](https://www.php.net/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E.svg?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A lightweight, high-performance inventory forecasting engine built from the ground up for modern browsers. This project features a clean, decoupled architecture with a native ES6+ frontend and a robust PHP MVC backend, designed to provide actionable business insights without the weight of heavy frameworks.

---

## ✨ Core Features
- **Dual Analytical Engines**:
    - **Offline (Client-Side)**: Uses Papa Parse for 100% private, instant forecasting directly in the browser. Perfect for private data analysis.
    - **Online (Server-Side)**: Leverages a PHP 8.2 backend for high-precision calculations and reorder point identification.
- **Smart Forecasting**: Predicts stock depletion dates and calculates safety stock levels based on historical sales velocity.
- **Interactive Data Viz**: Real-time sales trends and inventory health charts powered by Chart.js.
- **Privacy First**: Data only leaves the user's machine if "Online Mode" is explicitly enabled, ensuring total control over sensitive business information.

---

## 🏛️ Technical Highlights
### Frontend (Native SPA)
- **Built with Vanilla JavaScript (ES6+)**: Developed without third-party frameworks to demonstrate deep language proficiency and ensure maximum performance.
- **Mobile-First Design**: Implemented with native CSS Grid and Flexbox for a premium, responsive experience.
- **Efficient Parsing**: Client-side CSV processing allows for immediate data interaction.

### Backend (Clean PHP MVC)
- **Modern PHP Architecture**: Follows a strict Controller-Service pattern for maintainability and clear separation of concerns.
- **Stateless REST API**: Designed to be scalable and modular, making it easy to integrate with other systems or expand into a full SaaS platform.
- **Data Integrity**: Uses structured models/DTOs for reliable data transmission between the server and the UI.

---

## 🛠️ Setup & Local Development

### Prerequisites
- PHP 8.2 or higher (XAMPP, Docker, or local install).
- A modern web browser.

### Quick Start
1. **Clone the repository.**
2. **Launch Offline Mode**: Open `frontend/index.html` in your browser. Upload any CSV file with the data in the order like the file ejemplo.csv (or use `examples/ejemplo.csv`) to see the dashboard.
3. **Configure Online Mode**:
   - Point your local server web root to `backend/public`.
   - Update `API_ENDPOINT` in `frontend/js/api.js` to match your local setup.

---

## 📝 Future Roadmap
- [ ] **Database Integration**: Transition from CSV uploads to persistent MySQL/PostgreSQL storage.
- [ ] **User Authentication**: Implement JWT-based sessions for multi-user support.
- [ ] **Advanced Analytics**: Integration of machine learning models for even more accurate long-term forecasting.

---

## 👤 Author
**Ronald Mora**  
*Software Developer specialized in clean architecture and performant web solutions.*

- [LinkedIn](https://www.linkedin.com/in/ronald-mora-09458263/)
- [Portfolio](https://github.com/ronaldfmorac)

