💊 MedVault --- Pharmacy Management System

MedVault is a full-stack Pharmacy Management System developed during my
internship at JASS Logics as a Python Developer Intern.

The project is designed to help pharmacies manage medicines, inventory,
suppliers, purchases, sales, billing, expiry alerts, staff access, and
business analytics through a centralized web application.

🚀 Project Overview

MedVault combines a Django REST Framework backend with a React.js
frontend to provide a modern pharmacy management experience.

The system includes secure authentication, role-based access control,
inventory management, sales and billing, purchase orders, supplier
management, expiry and low-stock alerts, and analytics.

✨ Key Features

🔐 Authentication & Authorization

JWT-based authentication

Secure login system

HTTP-only authentication cookies

CSRF protection

Role-based access control

Protected frontend routes

Backend permission classes

Different page access based on user roles

💊 Inventory Management

Add, update, view, and manage medicines

Medicine categories

Stock quantity tracking

Batch management

Stock monitoring

Low-stock identification

🧾 Sales & Billing

Create and manage sales

Invoice management

Customer information

Multiple payment methods

Sale item and quantity tracking

Billing history

Paginated sales records

📦 Purchase & Supplier Management

Purchase order management

Supplier records

Medicine purchasing workflow

Stock updates from purchases

⚠️ Expiry & Stock Alerts

Track medicine expiry dates

Identify medicines approaching expiry

Low-stock alerts

Reorder-level monitoring

📊 Dashboard & Analytics

Inventory statistics

Sales statistics

Revenue trends

Inventory category analysis

Recent billing activity

Low-stock overview

Business performance insights

👥 Staff & Role Management

Staff management

Different staff roles

Role-based page permissions

Access control for pharmacy operations

🛠️ Tech Stack

Backend

Python

Django

Django REST Framework

JWT Authentication

RESTful APIs

Frontend

React.js

Tailwind CSS

React Router

Axios / Fetch API

Database

PostgreSQL

Data Visualization

Recharts

🏗️ Architecture

                    ┌──────────────────────┐
                    │      React.js        │
                    │    Frontend UI       │
                    └──────────┬───────────┘
                               │
                         RESTful APIs
                               │
                    ┌──────────▼───────────┐
                    │ Django REST Framework│
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │     PostgreSQL       │
                    │      Database        │
                    └──────────────────────┘

📁 Main Backend Apps

The Django backend is organized into separate applications for different
business responsibilities:

backend/
├── accounts/
├── inventory/
├── suppliers/
├── orders/
├── expiry/
├── billing/
├── analytics/
├── staff/
└── settingsapp/

📁 Frontend Structure

The React application contains separate pages and reusable components:

frontend/
├── components/
├── pages/
├── context/
├── data/
├── App.jsx
└── main.jsx

Main application pages include:

Login

Dashboard

Inventory

Purchase Orders

Suppliers

Expiry Alerts

Sales & Billing

Reports

Staff Management

🔑 Authentication Flow

MedVault uses JWT authentication with HTTP-only cookies.

User
  │
  ▼
Login Page
  │
  ▼
Django Authentication API
  │
  ▼
JWT Access / Refresh Tokens
  │
  ▼
HTTP-only Cookies
  │
  ▼
Protected API Requests
  │
  ▼
Role & Permission Validation
  │
  ▼
Authorized Dashboard / Pages

🔒 Security

The project implements several security mechanisms:

JWT authentication

HTTP-only cookies

CSRF token protection

Protected API endpoints

Role-based permissions

Protected React routes

Backend authorization checks

⚙️ Local Setup

1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MedVault

2. Backend Setup

Create and activate a virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run migrations:

python manage.py makemigrations
python manage.py migrate

Create a superuser if required:

python manage.py createsuperuser

Start the Django server:

python manage.py runserver

Backend will normally run at:

http://127.0.0.1:8000/

3. Frontend Setup

Open the frontend directory:

cd frontend

Install dependencies:

npm install

Start the React development server:

npm run dev

🌐 API

The frontend communicates with the Django backend through RESTful APIs.

Example API areas:

/api/login/
/api/register/
/api/inventory/
/api/products/
/api/suppliers/
/api/orders/
/api/billing/
/api/analytics/dashboard/

API routes may vary depending on the final project configuration.

📸 Project Dashboard

The MedVault dashboard provides an overview of:

Total medicines

Low-stock alerts

Expiring medicines

Sales

Revenue trends

Inventory categories

Recent billing activity

Stock alerts

🎯 Learning & Internship Experience

This project was developed as part of my internship at JASS Logics
as a Python Developer Intern.

Working on MedVault provided practical experience with:

Python development

Django application architecture

Django REST Framework

REST API development

JWT authentication

Role-based authorization

PostgreSQL database management

React frontend integration

API consumption

State management

Responsive UI development

Debugging and problem solving

Full-stack application development

🔮 Future Improvements

Potential future enhancements include:

Automated email notifications

Advanced sales reports

PDF invoice generation

Barcode scanning

Medicine supplier price tracking

Automated reorder suggestions

Audit logs

Deployment with Docker

Cloud deployment

Automated testing and CI/CD

👨‍💻 Developer

Ahmad Ameen

Python Developer Intern
JASS Logics

📌 Project

MedVault --- Pharmacy Management System

Built with ❤️ using Python, Django, Django REST Framework, React.js,
PostgreSQL, and Tailwind CSS.

📄 License

This project was developed for internship and learning purposes.
