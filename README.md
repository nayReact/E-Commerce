# 🛍️ ShopHub — Full-Stack E-Commerce Platform

A feature-rich, Advanced full-stack e-commerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). ShopHub supports three distinct user roles — Customer, Seller, and Admin — each with dedicated dashboards and capabilities.

---

## 🚀 Live Demo

> _Coming soon

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with protected routes
- Role-based access control (Customer / Seller / Admin)
- Email OTP login — passwordless login via email verification
- Password change with secure hashing (bcrypt)

### 🛒 Shopping Experience
- Product listing with search (MongoDB text index) and category filters
- Product detail page with image gallery (Cloudinary hosted)
- Star rating & review system per product
- Wishlist — save and manage favourite products
- Cart with real-time quantity updates and subtotal calculation
- Checkout with saved address autofill
- Indian pincode validation — auto city/state fill on checkout

### 📦 Orders
- Cash on Delivery (COD) order placement
- Order history with status tracking
- Order detail view with item breakdown
- Order cancellation flow
- Order invoice PDF download
- Expected delivery date display

### 👤 User Profile
- Edit name, email, profile picture
- Address management — add, edit, delete saved addresses
- Use saved address at checkout

### 🏪 Seller Dashboard
- Add, edit, and delete products with image upload (Cloudinary)
- Manage product categories and subcategories
- View orders placed for seller's products
- Order status management (Processing → Shipped → Delivered)

### 🛠️ Admin Panel
- View and manage all users (activate / deactivate accounts)
- Full category management (create, edit, delete with parent/sub support)
- Platform-wide order visibility
- User role management

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| State Management | React Context API (Auth, Cart) |
| HTTP Client | Axios (with JWT interceptor) |
| Notifications | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Image Hosting | Cloudinary |
| Email | Nodemailer |
| PDF Generation | (Invoice export) |

---

## 📁 Project Structure

```
ecommerce-platform/
├── client/                         # React frontend (Vite)
│   └── src/
│       ├── api/                    # Axios instance + API modules
│       ├── components/
│       │   ├── common/             # Navbar, Footer, Layout, Loader
│       │   ├── product/            # ProductCard, ProductGrid
│       │   ├── cart/               # CartItem, CartSummary
│       │   └── dashboard/          # DashboardCard, Charts
│       ├── context/                # AuthContext, CartContext
│       ├── pages/
│       │   ├── auth/               # Login, Register
│       │   ├── Home.jsx
│       │   ├── ProductList.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Orders.jsx
│       │   ├── OrderDetails.jsx
│       │   ├── Profile.jsx
│       │   ├── Wishlist.jsx
│       │   └── Dashboard.jsx       # Seller / Admin
│       └── utils/
│
└── server/                         # Express backend
    ├── config/
    │   ├── database.js             # MongoDB connection
    │   └── nodemailer.js           # Email config
    ├── controllers/                # authController, productController, ...
    ├── middleware/
    │   ├── authMiddleware.js       # protect + authorize
    │   ├── errorMiddleware.js
    │   └── uploadMiddleware.js     # Cloudinary upload
    ├── models/                     # User, Product, Category, Cart, Order, Review, Wishlist
    ├── routes/                     # All Express routers
    ├── utils/
    │   ├── emailTemplates.js
    │   └── cloudinary.js
    └── server.js
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Gmail account (or SMTP provider for email OTP)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shophub.git
cd shophub
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shophub
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend:

```bash
nodemon server.js
```

### 3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

The app runs at `http://localhost:5173` and the API at `http://localhost:5000`.

---

## 🔑 User Roles & Access

| Role | Capabilities |
|---|---|
| **Customer** | Browse, cart, checkout, orders, wishlist, profile, reviews |
| **Seller** | All customer features + product management + seller order view |
| **Admin** | All features + user management + category management + all orders |

Register an account and update the `role` field directly in MongoDB to `seller` or `admin` to test those dashboards.

---

## 🗺️ API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with password |
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP and login |
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create product (Seller) |
| GET | `/api/orders/my-orders` | Get customer orders |
| POST | `/api/orders` | Place order |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| GET | `/api/admin/users` | Get all users (Admin) |

---

## 🔭 Roadmap

- [ ] Order return & refund flow
- [ ] Expected delivery date on order details
- [ ] Platform revenue analytics with charts (Admin)
- [ ] Full mobile responsiveness (44px touch targets)
- [ ] Search results page (backend text index ready)
- [ ] Seller earnings dashboard

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 👨‍💻 Author

**NayReact**
> Built as a learning project to master full-stack development with the MERN stack.
