
---

## Modules Overview

### 1. OTP Login Service (NestJS + Redis)
- Users enter their mobile number.
- OTP is generated and stored in Redis with 2 min TTL.
- OTP verification API issues a JWT token.
- Redis is used for session/OTP management.
- **Endpoints:**
  - `POST /auth/send-otp` → Request OTP
  - `POST /auth/verify-otp` → Verify OTP and get JWT

---

### 2. Order Management API (NestJS + MySQL + Kafka)
- Authenticated users can:
  - Place an order: `order_id`, `user_id`, `amount`, `created_at`
  - View their order history
- Each new order emits an event to Kafka (logging `order_id` + timestamp)
- **Endpoints:**
  - `POST /orders/place` → Create order
  - `GET /orders` → Get user's order history
- **Kafka Integration:**
  - Topic: `orders.created`
  - Sample Payload:
    ```json
    {
       "order_id": "ord_0001",
       "user_id": 12,
       "amount": 199.99,
       "created_at": "2025-09-02T12:34:56Z"
     }
    ```

---

### 3. Frontend UI (Next.js)
- **Page 1: Login with OTP**
  - User enters mobile number
  - OTP simulated and logged in console
- **Page 2: Create Order**
  - Input field for `amount`
  - Submit order via REST API
- **Page 3: View Order History**
  - Fetch orders from backend and display

---

### 4. Legacy PHP Integration
- `order_summary.php?order_id=...`
- Fetch order details from NestJS Order API and display in HTML

---

## Setup Instructions
clone the repository -: 
### Backend (NestJS)
1.make sure before using backend kafka, redis, and mysql is in running state
2. create tables in database mysql

user table;
 CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       mobile VARCHAR(20) NOT NULL UNIQUE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
order table;
  CREATE TABLE orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       order_id VARCHAR(64) NOT NULL UNIQUE,
       user_id INT NOT NULL,
       amount DECIMAL(10,2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
     );
3. Navigate to backend folder:
   cd backend-nestjs
2. install dependancy
   npm install
   npm run start:dev
now backend is run on http://localhost:3001/

you can now check backend apis
postman collection -: https://api.postman.com/collections/11075682-b1629f38-02a0-4fc8-9e73-1756359b5e09?access_key=PMAT-01K45X0BDZS87HJWNTMFR9KD7Y

##frontend setup

1. Navigate to frontend folder:
   cd frontend-nextjs

2. run command
   npm install
   npm run dev

now your application start and you can use it.


