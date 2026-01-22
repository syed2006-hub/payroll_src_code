# 💼 PayrollPro - Payroll Management System

A full-stack MERN (MongoDB, Express, React, Node.js) payroll management application with role-based access control and Google OAuth authentication.

## ✨ Features

- 🔐 **Authentication**
  - Email/Password login
  - Google OAuth integration
  - JWT-based secure authentication
  
- 👥 **User Management**
  - 5 Role types: Super Admin, Payroll Admin, HR Admin, Employee, Finance
  - Role-based access control
  - User CRUD operations

- 🏢 **Organization Setup**
  - Multi-step onboarding wizard
  - Company profile configuration
  - Statutory setup (PF, ESI, Professional Tax)
  - Access level management

- 🎨 **Modern UI**
  - Beautiful Tailwind CSS design
  - Responsive layout
  - Dynamic role-based sidebar

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Google OAuth Library
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js (Google OAuth)
- JWT Authentication
- Bcrypt for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)
- Google OAuth credentials

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Create `.env` file in `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

3. Start backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Create `.env` file in `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

3. Start frontend server:
```bash
npm run dev
```

## 🚀 Usage

1. Open browser and go to `http://localhost:5173`
2. Click "Register as Super Admin" to create your organization
3. Complete the 3-step onboarding wizard
4. Add users from the User Management page
5. Users can login with email/password or Google OAuth

## 📱 User Roles

- **Super Admin**: Full system access, organization setup, user management
- **Payroll Admin**: Payroll processing and approvals
- **HR Admin**: Employee and salary structure management
- **Employee**: View payslips and tax details
- **Finance**: Financial reports and audits

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Role-based authorization
- Secure Google OAuth integration

## 📁 Project Structure
```
payroll-management/
├── backend/
│   ├── config/
│   │   └── passport.js
│   ├── models/
│   │   ├── User.js
│   │   └── Organization.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── onboarding.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── config/
│   │   └── App.jsx
│   ├── .env
│   └── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Syed Sameer S**
- Email: sameeraalimec786@gmail.com

## 🙏 Acknowledgments

- Built with guidance from Claude AI
- Inspired by Zoho Payroll

---

⭐ If you find this project helpful, please give it a star!