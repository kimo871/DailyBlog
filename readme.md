# 🕒 Scribble – 24-Hour Blog Platform

**Scribble** is a modern full-stack blog application where posts automatically disappear after 24 hours.  
It is built using **Laravel**, **React**, **Docker**, and **MySQL**, focusing on clean architecture, authentication, and automated background processing.

---

## ✨ Features Overview

### 🔐 User Authentication
- **Sign Up** – Users register with name, email, and password
- **Log In** – Secure authentication using email/password and JWT tokens
- **Protected API** – All endpoints except login/signup require authentication

---

### 📝 Blog Posts
- **Create Posts** – Write posts with title, content, and tags
- **24-Hour Expiry** – Posts are automatically deleted after 24 hours
- **Author Permissions** – Users can edit or delete only their own posts
- **Tag Requirement** – Each post must have at least one tag

---

### 💬 Comments System
- **Add Comments** – Users can comment on any post
- **Comment Management** – Users can edit/delete only their own comments
- **Real-time Updates** – Comments appear instantly without page refresh

---

### 🏷️ Tags Management
- **Tag Creation** – Add multiple tags to posts
- **Required Tags** – Every post must include at least one tag
- **Tag Updates** – Authors can update post tags at any time

---

## 🧠 Automatic Post Deletion (24-Hour Rule)

BlogFlow uses:
- **Laravel Scheduler** to run periodic tasks
- **Queue Workers** to process background jobs
- **Redis** as the queue backend

Expired posts are checked and deleted automatically without user interaction.

---

## 🛠 Tech Stack

### Backend
- Laravel 11
- MySQL
- Redis (Queues)
- JWT Authentication
- Laravel Scheduler & Queue Workers

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Axios

### Infrastructure
- Docker & Docker Compose


