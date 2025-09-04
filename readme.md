# Node.js Single-Vendor E-commerce API

A robust, scalable, and secure **RESTful API** for managing single-vendor e-commerce operations, built with **Node.js**, **Express**, and **MongoDB**.

---

## **Tech Stack**

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT
- **File Uploads:** Cloudinary
- **API Documentation:** Swagger
- **Redis** server for caching (Optional)

---

## **Getting Started**

### **Prerequisites**

- Node.js (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- Cloudinary Account (for image uploads)

---

### **Installation**

**Clone the repository**

```bash
git clone https://github.com/Jerom05/node-ecommerce-backend.git
cd node-ecommerce-backend
```

**Install dependencies**

```bash
npm install
```

**Create a `.env` file** in the root directory and add:

```jsx
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10

# Database
MONGODB_URI=mongodb+srv://your-db-uri

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=your_folder_name

# Redis (optional)
REDIS_URL=redis_server_url(local or cloud)

```

**Start the server**

```bash
npm start
```

Server will run on:

```
http://localhost:3000
```

---

## **Redis Caching (Optional)**

- If a `REDIS_URL` is provided in the `.env`, the app will:
  - Connect to Redis at startup.
  - Use caching middleware for performance.
  - Support **event-driven cache invalidation** (cache is cleared automatically whenever CRUD operations (create, update, delete) occur).
- If `REDIS_URL` is **not set**, Redis will be skipped and the app will run without caching.

This ensures caching is **optional** and does not block development or deployment.

---

---

## **API Documentation (Swagger)**

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

If you modify the Swagger files, run the following command to regenerate the bundled file:

```bash
npm run bundle
```

---

## **Database Seeding**

To insert initial data into your database (for testing or setup), run:

```bash
npm run seed
```
