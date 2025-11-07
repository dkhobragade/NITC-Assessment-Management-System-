# NITC Assessment Management System

## 📌 Project Overview
The **NITC Assessment Management System** is a generalized platform designed to plan, organize, and conduct academic evaluations such as lab assessments, project reviews, and admission tests at NITC.
It provides a centralized system for faculty members to create evaluation tasks, assign evaluators, manage candidate details, and generate automated reports.

---

## 🎯 Objectives
- Provide a **generalized platform** for conducting any type of academic evaluation.
- Enable **secure faculty authentication** via NITC email.
- Simplify **management of candidates and evaluators** using bulk uploads (CSV/Excel).
- Automate **candidate–evaluator mapping** (random/manual).
- Support **automatic seating arrangements** for candidates.
- Provide evaluators with a dashboard to **view assigned students and record scores**.
- Generate **summarized reports** for faculty.

---

## ✨ Features
- **Faculty Authentication**
  - Email-based login restricted to official NITC IDs.

- **Evaluation Task Management**
  - Faculty can create, view, and manage tasks.
  - Candidate and evaluator data import from CSV/Excel.

- **Candidate–Evaluator Mapping**
  - Random mapping ensures fair distribution of evaluations.
  - Manual mapping option available for custom control.

- **Seating Arrangement**
  - Automatic seating plan generation for candidates if required.

- **Evaluator Dashboard**
  - View assigned candidates.
  - Enter and manage evaluation scores.

- **Faculty Dashboard**
  - Generate and download summarized reports of tasks.

---

## 🏗️ System Modules
1. **Authentication Module** – Email-based faculty login.
2. **Task Creation Module** – Create and configure evaluation tasks.
3. **Data Upload Module** – Import candidate and evaluator details.
4. **Mapping Module** – Random/manual evaluator–candidate allocation.
5. **Seating Arrangement Module** – Auto-generate candidate seating layouts.
6. **Evaluation Module** – Evaluators enter scores.
7. **Reporting Module** – Faculty view/download reports.


---

## 🛠️ Technology Stack (Suggested)
- **Frontend:** React.js / Vue.js
- **Backend:**  Node.js (JavaScript)
- **Database:** MongoDB
- **Authentication:** Email-based (NITC domain validation)
- **File Handling:** CSV & Excel support (Pandas / SheetJS)
- **Password hashing:** bcryptjs
- **User authentication & authorization:** jsonwebtoken (JWT)
- **Cookie management:** cookie-parser
- **PDF:** multer
- **Excel:** xlsx
- **Icon:** react-icons


---

## Dependinces
- **Environment_Variables:**  dotenv
- **Database:**  MongoDb - mongoose
- **Global State Management:**  Jotai
- **Toastify:**  React-Toastify


## 🚀 Installation & Setup
### Prerequisites
- MongoDB
- Git
- React
-

### Steps
```bash
# Clone repository
git clone https://github.com/<your-repo>/nitc-assessment-system.git
cd nitc-assessment-system

# Backend setup
pip install -r requirements.txt      # If using Python backend
# OR
npm install                          # If using Node.js backend

# Frontend setup
cd frontend
npm install

# Run servers
npm start                            # Frontend
python manage.py runserver           # Django backend (example)


Created Task JSON
{message: "Task created successfully",…}
message
:
"Task created successfully"
task
:
{title: "Task Json", description: "Desp JSON", dueDate: "2045-12-12T00:00:00.000Z",…}
createdAt
:
"2025-11-05T19:37:22.358Z"
createdBy
:
"690b9ee04eeb76b430547451"
description
:
"Desp JSON"
dueDate
:
"2045-12-12T00:00:00.000Z"
pdfUrl
:
"uploads\\1762371442104.pdf"
title
:
"Task Json"
updatedAt
:
"2025-11-05T19:37:22.358Z"
__v
:
0
_id
:
"690ba77204f99f3143f45bb9"