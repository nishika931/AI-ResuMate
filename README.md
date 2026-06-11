# AI-ResuMate
Developed an AI-powered Resume Analyzer using the MERN stack and Cohere API to assess resumes against job descriptions. Implemented ATS scoring, skill-gap analysis, personalized recommendations, analysis history tracking, secure authentication, an admin panel for user management, and a responsive UI with seamless frontend-backend integration.

---

## 🧠 About the Project

The AI Resume Analyzer helps users improve their resumes for job applications by comparing them with job descriptions using AI.

It uses **Cohere AI (NLP model)** with custom prompt engineering to generate:

- ATS (Applicant Tracking System) Score
- Missing Skills
- Strengths of Resume
- Personalized Improvement Suggestions

---

## ⚙️ Tech Stack

### Frontend
- React.js
- Tailwind CSS / CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### AI Integration
- Cohere AI API
- Prompt Engineering for resume evaluation

---

## 🔥 Features

### 👤 User Features
- Upload and analyze resumes
- ATS score generation (0–100)
- Skill-gap detection
- AI-generated feedback & suggestions
- Analysis history tracking
- Secure authentication (Login/Register)

### 🛠 Admin Panel
- View all users
- Monitor resume analyses
- Manage user data
- Access stored analysis history

---

## 🤖 AI Integration (Cohere API)

This project uses Cohere AI to analyze resumes against job descriptions.

### Workflow:
1. User uploads resume text
2. Job description is provided
3. Backend sends data to Cohere API
4. AI processes and returns:
   - ATS Score
   - Missing Skills
   - Strengths
   - Improvement Suggestions

---

****Backend Architecture:**
REST API built with Express.js
**MongoDB stores:**
Users
Resume analysis history
JWT Authentication for security
Protected routes for users and admin

---

🔄** Frontend–Backend Integration**
React frontend communicates with Express backend using Axios
Flow:
React UI → Backend API → Cohere AI → MongoDB → Response → UI

**📊 Database Structure**
Users Collection
name
email
password (hashed)
role (user/admin)
**Analysis Collection**
userId
resume name
job description
feedback
timestamp

---

**🔐 Authentication**
JWT-based authentication system
Secure login & registration
Role-based access (User / Admin)
📁 Project Structure

---

**Resume-Analyzer/**
│
├── frontend/ # React app
├── backend/ # Node + Express API
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── utils/
└── README.md

Linkedin:- www.linkedin.com/in/nishika-sahu-644a64332
