# Layman's Vacation - Project Documentation

## Project Overview
**Layman's Vacation** is a modern, full-stack travel and tourism platform designed to provide users with a seamless experience for exploring destinations, viewing vacation packages, and making inquiries. The project leverages a high-performance technology stack to deliver a premium, visually engaging interface with smooth 3D visualizations and animations.

---

## 🛠 Technology Stack

### **Frontend (Client)**
The frontend is built for speed and interactivity, utilizing modern React patterns and specialized visualization libraries.

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/) (Lightning-fast development and bundling)
*   **Animations:**
    *   **GSAP (GreenSock Animation Platform):** Used for complex, high-performance scroll-triggered and timeline-based animations.
    *   **Motion:** For fluid UI transitions and micro-interactions.
*   **3D & Visualization:**
    *   **Three.js / React-Globe.gl:** Powering the interactive 3D globe and spatial visualizations.
*   **State & Data Handling:**
    *   **Axios:** For robust HTTP requests to the backend API.
    *   **React Router Dom:** Managing client-side routing.
*   **UI/UX Enhancements:**
    *   **Lenis:** Providing smooth, buttery scroll experiences.
    *   **FontAwesome:** Extensive iconography system.
    *   **Dnd-kit:** For drag-and-drop interactions.

### **Backend (Server)**
A robust and scalable Node.js backend providing RESTful endpoints for authentication, content management, and inquiries.

*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **ORM:** [Prisma](https://www.prisma.io/) (Typescript-first ORM for database modeling and type-safety)
*   **Authentication:** [JWT (JSON Web Tokens)](https://jwt.io/) with `cookie-parser` for secure session management.
*   **Security:** `bcryptjs` for industry-standard password hashing.

---

## 🌐 Platforms & Hosting

*   **Backend Hosting:** [Railway](https://railway.app/) - Deployed at `laymans-vacation-production.up.railway.app`.
*   **Custom Domain:** [laymansvacation.com](https://laymansvacation.com)
*   **Database Hosting:** [MongoDB Atlas](https://www.mongodb.com/atlas/database) - Multi-cloud managed database service.

---

## ☁️ Integrated Services

| Service | Purpose |
| :--- | :--- |
| **MongoDB Atlas** | Primary NoSQL database for storing destinations, packages, blogs, and user data. |
| **Resend** | High-deliverability email API used for contact form submissions and automated notifications. |
| **Nodemailer (Gmail SMTP)** | Fallback or specific transactional email handling via Google's SMTP servers. |
| **Prisma Client** | Unified interface for database queries and schema management. |
| **EmailJS** | Client-side email integration for quick contact interactions without immediate backend overhead. |

---

## 📂 Key Modules & Features

1.  **Auth System:** Secure admin login and session management.
2.  **Destination Explorer:** Dynamic listing and detailed view of travel locations.
3.  **Package Management:** CRUD operations for vacation packages with varying tiers.
4.  **Inquiry System:** Automated email notifications for user leads and booking requests.
5.  **State Explorer:** specialized navigation or filtering based on geographical states.
6.  **Audit Logs:** Internal tracking for administrative actions.
7.  **Interactive 3D Globe:** A visual centerpiece for destination selection.

---

## 🚀 Environment Configuration
The project uses a structured `.env` system to manage sensitive keys for:
*   `DATABASE_URL` (Prisma/MongoDB connection string)
*   `JWT_SECRET` (Token signing)
*   `RESEND_API_KEY` (Email delivery)
*   `EMAIL_USER`/`EMAIL_PASS` (SMTP credentials)
