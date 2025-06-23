# 🎓 EduPlatform – Frontend (Vite + React.js + Bootstrap + Axios)

This is the frontend for **EduPlatform**, a student-instructor portal with integrated AI assistance. Built using **Vite**, **React.js**, **Bootstrap** and **Axios** the application enables seamless interaction between students and instructors while supporting a GPT-powered AI chatbot for academic help.

---

## 🛠️ Tech Stack

- ⚛️ **React.js** – UI library
- ⚡ **Vite** – Fast build tool and development server
- 🎨 **Bootstrap 5** – UI styling framework
- 🔐 **JWT** – Auth-based route protection
- 📦 **Axios** – HTTP requests
- 🤖 **OpenAI API** – GPT-3.5-turbo integration

---

## 🚀 Features

- 🔐 **Authentication**:
  - Register and login with role-based access
- 🧑‍🎓 **Student Dashboard**:
  - View enrolled courses
  - Course thumbnail
  - Due date
  - Progress bar to show course completion status.
  - AI chat assistant for learning support
- 🧑‍🏫 **Instructor Dashboard**:
  - Create and view courses
  - Displayed the number of students enrolled in each course
  - Progress of each student for the courses they are enrolled in.
- 🤖 **AI Chat Assistant**:
  - Powered by OpenAI's GPT
  - Persists chat history per student
- ✅ Protected Routes using `ProtectedRoute.jsx`

---

## 📁 Folder Structure
```bash
src/
├── api/
│ └── axios.js # Axios config with baseURL
├── components/
│ ├── Chatbot.jsx # Chat Assistant modal
│ └── ProtectedRoute.jsx # Role-based routing
├── pages/
│ ├── instructor/ # Instructor views
│ ├── student/ # Student views
│ ├── Login.jsx
│ └── Register.jsx
├── assets/ # Images and icons (if any)
├── App.jsx # Routing and layout
├── main.jsx # Vite entry point
├── App.css
└── index.css
```

## ⚙️ Local Setup Instructions
### 1. Clone the Repository

- https://github.com/Yash1thvs/student-dashboard-ui.git
- cd student-dashboard-ui

### 2. Install Dependencies
- npm install

### 3. Start the Development Server
- npm run dev

# 🔗 Backend API
Ensure your Flask backend (student_dashboard API) is running at http://localhost:5000.
- axios.defaults.baseURL = 'http://localhost:5000';

# 🧠 Approach & Implementation
- I chose Vite for its blazing-fast development experience and Bootstrap for rapid responsive design.
- Authentication is implemented using JWT and protected using custom routing logic.
- The chatbot was built using OpenAI's GPT model, with session history saved in the backend and fetched during component mount.
- Role-based dashboards were developed to separate Instructor and Student capabilities cleanly.

⚠️ Challenges Faced
- OpenAI API quota issues caused request failures initially – resolved by verifying billing and regenerating keys.
- Chat duplication occurred due to incorrect frontend mapping of user/bot messages – fixed by refining fetchHistory() logic.
- Styling conflicts between custom elements and Bootstrap required tweaking class names for consistent UI alignment.
