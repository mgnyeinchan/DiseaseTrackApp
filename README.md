# DiseaseTrackApp

A full-stack disease tracking system built with React Native, TypeScript, Node.js, and PostgreSQL.  
The system is designed for reporting, monitoring, and managing disease-related data in real time.

---

## 📌 Overview

DiseaseTrackApp is a mobile and backend-based application that allows users to submit, track, and manage disease reports efficiently.  
It provides a structured system for data collection and monitoring with secure authentication and role-based access control.

---

## 🚀 Features

- User authentication (login/register)
- Role-based access (Owner, App User, Read-only)
- Create, update, delete disease reports
- Real-time API communication
- Secure password handling & user lock system
- Scalable backend architecture

---

## 🏗️ Tech Stack

**Frontend (App)**
- React Native
- TypeScript
- Axios
- React Navigation

**Backend**
- Node.js
- Express.js
- TypeScript

**Database**
- PostgreSQL

---

## 📁 Project Structure


---

## ⚙️ Installation & Setup

### 1. Clone repository

git clone https://github.com/mgnyeinchan/DiseaseTrackApp.git
cd DiseaseTrackApp

### Backend setup
cd Backend
npm install
npm run dev

### Frontend setup
cd App
npm install
npx react-native run-android


## 🗄️ Database Setup

The database scripts are organized into schema and seed folders:

```
backend/
└── database/
    ├── schema/
    │   ├── create_tables.sql
    │   ├── constraints.sql
    ├── seed/
    │   └── insert_data.sql
```

## 📱 Android Setup

### Prerequisites
- Install Android Studio
- Setup Android SDK
- Create an Emulator (AVD Manager)

---

### Run Emulator
Start emulator from Android Studio (AVD Manager)

---

### Run App
```bash
npx react-native run-android