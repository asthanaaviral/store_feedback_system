# 🏪 Store Rating Platform - Roxiler Systems Assessment

A full-stack Store Rating Platform developed as part of the **Roxiler Systems Full Stack Intern Assessment**.

The platform enables users to discover stores, submit ratings, and manage store-related data through a secure role-based system. It supports three user roles — **System Administrator**, **Store Owner**, and **Normal User** — each with dedicated dashboards and permissions.

As part of the assessment, only the source code submission was required. To demonstrate production-readiness and deployment skills, I additionally deployed the complete application live with separate frontend, backend, and database infrastructure.

### 👨‍💻 Developed By
**Aviral Asthana**

### 🔗 Live Demo
* **Application:** https://store-feedback-system.vercel.app
* **Backend API:** https://store-feedback-system-api.onrender.com/api

### 🚀 Deployment Infrastructure

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Railway (MySQL)

<br>

---

# 🧪 Demo Accounts

Use the following accounts to test the live application:

| Role                 | Email                                         | Password     |
| -------------------- | --------------------------------------------- | ------------ |
| System Administrator | [admin@store-rating.com]                      | Admin@1234   |
| Store Owner          | [rajesh@gmail.com]                            | Rajesh@1234  |
| Normal User          | [ananya@gmai.com]                             | Ananya@1234  |


<br><br>

---

# ✨ Key Features

### 🔐 Authentication & Security

* JWT-based authentication and authorization
* Secure role-based access control (RBAC)
* Protected routes on both frontend and backend
* Password validation following assessment requirements
* Secure password hashing using industry-standard practices

### 👥 Multi-Role System

Supports **3 distinct user roles** with dedicated permissions:

#### System Administrator

* Dashboard with platform statistics

  * Total Users
  * Total Stores
  * Total Ratings Submitted
* Create and manage:

  * Admin Users
  * Normal Users
  * Store Owners
  * Stores
* View complete user directory
* View complete store directory
* Search, filter and sort data efficiently
* Access user details and store performance metrics

#### Normal User

* Self-registration and login
* Browse all registered stores
* Search stores by name and address
* Submit ratings (1–5)
* Update previously submitted ratings
* View personal rating history
* Change password securely

#### Store Owner

* Dedicated dashboard
* View users who rated their store
* Monitor store performance
* View real-time average store rating
* Change password securely

### ⭐ Store Rating System

* Ratings range from **1 to 5**
* One rating per user per store
* Rating updates supported
* Automatic average rating calculation
* Real-time rating aggregation

### 📊 Data Management

* Server-side filtering and searching
* Sorting support across listings
* Optimized relational database design
* Scalable REST API architecture

### 🎨 Modern User Experience

* Responsive UI across desktop and mobile devices
* Clean dashboard-based workflow
* Fast SPA experience using React + Vite
* Modern Tailwind CSS design system

### 🏗️ Engineering Highlights

* Full-stack architecture
* RESTful API design
* Modular backend structure
* Environment-based configuration
* Production deployment across multiple cloud platforms
* MySQL relational database with normalized schema


<br><br>

---

# 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MySQL

### Deployment

* Vercel
* Render
* Railway

<br><br>

---

# 📂 Project Structure

```text
roxiler_assessment/
├── backend/      # Express.js REST API
├── frontend/     # React.js Application
└── database/     # MySQL Schema & Seed Data
```

<br><br>

---

# ⚙️ Local Development Setup

## Prerequisites

* Node.js v18+
* MySQL 8+

## 1. Database Setup

```bash
mysql -u root -p
source database/schema.sql
```

## 2. Backend Setup

```bash
cd backend

npm install
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

## 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

<br><br>

---

# 🔧 Environment Variables

## Backend (`backend/.env`)

| Variable       | Description        |
| -------------- | ------------------ |
| DB_HOST        | MySQL host         |
| DB_PORT        | MySQL port         |
| DB_USER        | MySQL username     |
| DB_PASSWORD    | MySQL password     |
| DB_NAME        | Database name      |
| JWT_SECRET     | JWT signing secret |
| JWT_EXPIRES_IN | Token expiration   |
| CLIENT_URL     | Frontend URL       |
| NODE_ENV       | Environment        |

## Frontend (`frontend/.env`)

| Variable     | Description     |
| ------------ | --------------- |
| VITE_API_URL | Backend API URL |

<br><br>

---
# 🎯 Additional Work Beyond Assessment Scope

To demonstrate production readiness and engineering ownership, the project includes several enhancements beyond the original assessment requirements:

* Live production deployment
* Separate cloud infrastructure for frontend, backend, and database
* Environment-based configuration
* Production-ready API hosting
* Publicly accessible demo environment
* Deployment documentation and testing accounts


This project was built as a technical assessment submission for **Roxiler Systems** and showcases full-stack development, database design, authentication, authorization, deployment, and application architecture skills.