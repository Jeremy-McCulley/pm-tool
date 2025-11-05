# 🚀 Project Management Tool

**A streamlined, feature-rich project management solution built with React and Firebase.**

| Metadata | Value |
| :--- | :--- |
| **Author** | Jeremy McCulley |
| **Live Demo** | Coming Soon |
| **Website** | [Placeholder Link](placeholder) |
| **Portfolio** | [Placeholder Link](placeholder) |
| **LinkedIn** | [Placeholder Link](placeholder) |

***Note: This project is currently under active development. Some of the information contained in this README may change. Check back for future updates.***

---

## 📝 Description

This project is a modern Project Management Tool designed to provide a visually intuitive and highly functional task-tracking experience. It utilizes a Kanban board interface where users can easily organize tasks into customizable stages.

Key features include dynamic color coding for projects and tasks, and an interactive drag-and-drop system to manage workflow progress. All project and task data is persisted securely in a **Firebase** database, ensuring data integrity across sessions.

---

## ✨ Features

Based on the application code and provided information, the key features include:

* **Kanban Board Interface:** Visually manage tasks using an industry-standard board layout with customizable columns (stages) defined per project.
* **Drag and Drop Functionality:** Effortlessly move tasks between stages using the `react-beautiful-dnd` library (via `@hello-pangea/dnd`) for a seamless workflow update.
* **Project & Task Color Coding:** Apply unique colors to both projects (via `ProjectForm` and `ColorPicker`) and individual tasks, providing clear visual separation and priority indication.
* **Persistent Storage (Firebase):** All projects, tasks, and stage changes are stored and synchronized in a Firebase database.
* **User Authentication & Context:** Utilizes `AuthContext` and `ProjectContext` to manage user sessions and stream project/task data specific to the authenticated user.
* **CRUD Operations:** Full capability to Create, Read, Update (stage, details), and Delete projects and tasks.
* **Responsive Modals:** Uses a dedicated `Modal` component (rendered via `createPortal`) for forms like `ProjectForm` and `TaskForm`.

---

## ⚙️ Project Setup and Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have Node.js and npm installed on your system. It is highly recommended to use a Node.js version of 18 or higher.

### Installation Steps
There are two scenarios: starting from scratch or cloning this repository.
1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPO_URL_HERE]
    cd project-management-tool
    ```

2.  **Install Dependencies:**
    The project uses several dependencies for the UI, state management, and Firebase integration.
    ```bash
    npm install
    ```

3.  **Firebase Configuration:**
    Create a new file in `src/firebase/` named `firebaseConfig.js` (if it's not already there) and add your unique Firebase configuration details.

    ```javascript
    // src/firebase/firebaseConfig.js
    // NOTE: This must be filled in with your actual credentials
    const firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "..."
    };
    ```

4.  **Start the Development Server:**
    The project is built with Vite.
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

---

## 💻 Technologies Used

This project leverages a modern stack centered around React and Firebase:

| Category | Technology | Purpose / Dependencies |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Core JavaScript library for building the user interface. |
| **Build Tool** | **Vite** | Fast development server and build tool. |
| **Language** | **JavaScript (ES6+)** | Used for all application logic. |
| **Styling** | **.LESS** | CSS preprocessor for modular and maintainable styles. |
| **Database** | **Firebase (Firestore, Auth)** | Backend-as-a-Service for authentication and real-time data persistence. |
| **Drag & Drop** | `@hello-pangea/dnd` | Robust library for drag-and-drop functionality on the Kanban board. |
| **Icons** | `react-icons/fi`, `lucide-react` | High-quality, modern icon sets. |

---

## 📁 File Structure

<pre>

root/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── Project/
│ │ │ ├── ProjectCard.jsx
│ │ │ ├── ProjectForm.jsx
│ │ │ └── ProjectList.jsx
│ │ ├── Task/
│ │ │ ├── KanbanColumn.jsx
│ │ │ ├── TaskCard.jsx
│ │ │ └── TaskForm.jsx
│ │ ├── UI/
│ │ │ ├── Button.jsx
│ │ │ ├── ColorPicker.jsx
│ │ │ └── Modal.jsx
│ │ └── KanbanBoard.jsx
│ ├── contexts/
│ │ ├── AuthContext.jsx
│ │ └── ProjectContext.jsx
│ ├── firebase/
│ │ ├── dbServices.js
│ │ └── firebaseConfig.js
│ ├── styles/
│ │ ├── global.less
│ │ ├── mixins.less
│ │ ├── Project.less
│ │ ├── Task.less
│ │ └── variables.less
│ ├── App.jsx
│ └── main.jsx
├── .gitignore
├── package.json
└── README.md
</pre>
