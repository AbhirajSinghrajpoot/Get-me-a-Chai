# ☕ Get Me a Chai

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

Welcome to **Get Me a Chai**! A full-stack, donation-based crowdfunding platform designed for creators, developers, and artists to easily receive support from their fans. 

*Because developers run on caffeine, and creators need funding!* 🚀

---

## 🌟 Project Overview

This application serves as a centralized hub where fans can fund their favorite creators. Built with modern web technologies, it leverages the power of **Next.js (App Router)** for seamless frontend rendering and backend API routes, alongside **MongoDB** for robust data management.

### Key Features
* 👤 **Creator Profiles:** Dedicated pages for creators to showcase their work and receive donations.
* 🔒 **Secure Data Flow:** Utilizes Next.js Server Actions for optimized and secure backend mutations.
* 🗄️ **Database Integration:** Structured Mongoose models for user authentication and transaction tracking.
* ⚡ **Responsive UI:** A clean, modern interface built with highly reusable React components.

---

## 📂 Repository Architecture

Here is a breakdown of the project's core structure:

```text
📦 Get-me-a-Chai
 ┣ 📂 actions/           # Next.js Server Actions for handling form submissions & DB operations
 ┣ 📂 app/               # Next.js App Router (Pages, Layouts, API routes)
 ┣ 📂 components/        # Reusable UI components (Navbar, Footer, Modals)
 ┣ 📂 db/                # Database connection utilities (MongoDB)
 ┣ 📂 models/            # Mongoose schemas (Users, Payments/Donations)
 ┣ 📂 public/            # Static assets and images
 ┣ 📜 eslint.config.mjs  # ESLint configuration for code quality
 ┗ 📜 jsconfig.json      # JavaScript path mapping and compiler options

```
## 🚀 Getting Started
Want to run this project on your local machine? Follow these simple steps:
**1. Clone the repository:**
```bash
git clone [https://github.com/AbhirajSinghrajpoot/Get-me-a-Chai.git](https://github.com/AbhirajSinghrajpoot/Get-me-a-Chai.git)
cd Get-me-a-Chai

```
**2. Install dependencies:**
```bash
npm install

```
**3. Environment Setup:**
Create a .env.local file in the root directory and add your MongoDB connection string and any required API keys:
```env
MONGODB_URI=your_mongodb_connection_string
# Add payment gateway or auth secrets if applicable

```
**4. Run the development server:**
```bash
npm run dev

```
Open http://localhost:3000 with your browser to see the result.
## 👨‍💻 About the Developer
**Abhiraj Singh Rajpoot** | *Full-Stack Developer*
I specialize in turning ideas into interactive, efficient, and user-friendly digital experiences. This project highlights my ability to integrate frontend design with complex backend logic and database management using the Next.js ecosystem.
📫 **Let's Connect:**
 * **Portfolio:** wizards-portfolio.vercel.app
 * **LinkedIn:** Abhiraj Singh Rajpoot
 * **GitHub:** @AbhirajSinghrajpoot
