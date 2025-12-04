
# 🔗 LinkedIn Clone Web Application

## 📌 Team Members

- **Ναταλία Κρικέλλη** [https://github.com/nataliakrik]
- **Σωκράτης Παπαργύρης** [https://github.com/soc9999] 

---

## 🎯 Project Overview

This is a **LinkedIn-inspired** full-stack web application designed as part of an academic project. The platform allows users to register, connect, post articles and job listings, comment, message each other, and more — closely mimicking key features of a professional social network.

---

## 💻 Technologies Used

- **Frontend:** React with Vite
- **Backend:** Django
- **Database:** SQLite (Python built-in)
- **API:** Django REST Framework

---

## 🚀 How to Run the Application

### 🔧 Backend (Django)

1. Navigate to the backend directory.
2. Activate the virtual environment:
   ```bash
   source env/bin/activate
   ```

3. Start the Django server:

   ```bash
   python manage.py runserver
   ```

### 🌐 Frontend (React)

1. Navigate to the frontend directory.
2. Start the React development server:

   ```bash
   npm run dev
   ```

---

## 📄 Application Pages Overview

| Page                    | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| **Welcome Page**        | Introduction page for new users                                 |
| **Login Page**          | User authentication via username                                |
| **Register Page**       | New user registration                                           |
| **Home Page**           | User's dashboard — shows profile details and a feed of articles |
| **Read Article Page**   | View full article, comments, and add a new comment              |
| **Post Article Page**   | Publish a new article                                           |
| **Jobs Page**           | View job listings prioritized by user skills                    |
| **Post Job Page**       | Post a new job listing                                          |
| **Messages Page**       | Private chats between users                                     |
| **My Network Page**     | Search for users and view your connections                      |
| **Notifications Page**  | Manage connection requests and see article interactions         |
| **Me Page**             | Personal profile page to edit details and manage posts          |
| **Other Profiles Page** | View public profiles of other users                             |
| **Settings Page**       | Change email/password (with current password for verification)  |
| **Admin Page**          | (Admins only) View and export user data in JSON or XML format   |

---

## 📝 Application Flow

1. Users **register** and **log in** using their credentials.
2. Upon login, they are redirected to the **Home Page**, where they can:

   * View profile details
   * Publish and read articles
   * Interact via likes and comments
   * Navigate to different sections via the top navigation bar
3. In the **Jobs Page**, users can:

   * View job posts filtered by their profile skills
   * Publish new job listings
4. The **Messages Page** displays previous conversations.
5. In **My Network**, users can:

   * Search for others by username
   * Send connection requests
   * View public profiles and send messages
6. On **Notifications**, users manage:

   * Friend requests
   * Activity on their articles (comments, likes)
7. In **Me Page** and **Settings**, users can:

   * View/edit profile information
   * Change email and password
8. **Admins** can view all users' data and export it as **JSON** or **XML**.

---

## 📂 Repository Structure (Suggested)

```
project-root/
│
├── backend/            # Django backend
│   └── manage.py
│
├── frontend/           # React frontend
│   └── src/
│
├── env/                # Python virtual environment
│
├── README.md           # This file
└── requirements.txt    # Python dependencies
```

