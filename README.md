# 🌾 UZHAVAN — Direct Farm-to-Table Platform

**UZHAVAN** is an integrated direct-to-consumer digital agriculture platform that connects local farmers directly with buyers. By eliminating unnecessary intermediaries and middlemen, UZHAVAN empowers farmers with better profit margins, enables buyers to purchase fresh quality produce, and provides real-time market intelligence.

---

## 🚀 Key Features

### 👨‍🌾 For Farmers
* **Crop Inventory Management**: Easily list, update, and manage available crop stocks, units, and descriptions.
* **Earnings Dashboard**: Track total revenue, successful deliveries, pending payments, and view dynamic daily sales graphs.
* **Order Pipeline**: Live status tracking from confirmation, shipping, to delivery.

### 🛒 For Customers
* **Interactive Farm Shop**: Browse and search fresh agricultural items directly from trusted local farms.
* **Responsive Category Filters**: Quick-filter options across *Vegetables, Fruits, Grains, and Pulses*.
* **Secure Checkout & Cart**: Managed shopping cart, order history, and personal wishlists.

### 🔑 For Admins
* **Market Pricing Intelligence Desk**: Publish and broadcast official district-wise crop rates (Min, Max, and Average prices) to guide local trade.
* **Verification Controls**: Approve registered farmers and monitor system orders.

---

## 🛠️ Technology Stack

* **Backend Framework**: Spring Boot 3.2.5 (Java JDK 23)
* **Security & Authentication**: Spring Security + Stateless JWT Token Filters
* **Database & Persistence**: Hibernate ORM / Spring Data JPA + MySQL
* **Frontend Framework**: React (Vite) + Material-UI (MUI)
* **Visualizations**: Recharts (Interactive SVG Charts)

---

## ⚙️ Getting Started

### 📋 Prerequisites
Ensure you have the following installed locally:
* **Java Development Kit (JDK)**: v17 or higher (v23 recommended)
* **Node.js**: v18 or higher (with npm)
* **MySQL Server**: v8.0 or higher

---

### 🗄️ 1. Database Setup
1. Open your MySQL client and create a new database schema:
   ```sql
   CREATE DATABASE uzhavan_db;
   ```
2. Configure database credentials in `/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/uzhavan_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

---

### ☕ 2. Running the Java Backend
Open a terminal in the project root directory and execute:
```bash
# Clean and boot the application using the Maven wrapper
./mvnw spring-boot:run
```
The server will start up and listen on port **`8098`**. Database tables and seeder rates will auto-generate on first boot.

---

### ⚛️ 3. Running the React Frontend
Open a separate terminal in the project root directory and execute:
```bash
# Install package dependencies
npm install

# Start the Vite React development server
npm run dev
```
The application will launch on your local host at **`http://localhost:5173/`**.

---

## 📂 Project Structure

```
uzhavan/
├── src/
│   ├── main/
│   │   ├── java/com/uzhavan/uzhavan/
│   │   │   ├── controller/      # REST API Controllers (Orders, Farmers, Products)
│   │   │   ├── entity/          # JPA Database Entities
│   │   │   ├── repository/      # Spring Data JPA repositories
│   │   │   ├── security/        # JWT Authentication configuration
│   │   │   └── service/         # Business logic layer implementations
│   │   └── resources/
│   │       └── application.properties # Application database parameters
│   └── test/                    # Unit testing configurations
│
├── src/ (Frontend Assets)
│   ├── api/                     # Axios API endpoints mappings
│   ├── layouts/                 # Farmer, Customer, and Admin templates
│   ├── pages/                   # User interface pages (Dashboard, Shop, Pricing)
│   ├── routers/                 # App routes configurations
│   └── App.jsx                  # Root React component
├── pom.xml                      # Maven project dependencies file
└── package.json                 # Node modules configuration file
```

---

## 📄 License
This project is open-source and available under the MIT License.
