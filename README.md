# 🧠 TeamSimple Platform

**TeamSimple** is a unified, AI-driven content and collaboration platform designed to simplify how tech teams manage and showcase their work — blogs, podcasts, writeups, events, achievements, and internal collaboration — all in one place.

> 🔍 **Philosophy**: "Simple technology for powerful impact."  
> 🚀 **Target Users**: Tech teams, open-source contributors, cybersecurity researchers, startups.

---

## 🌐 Live Demo

_Coming soon..._

---

## 📆 Features

| Module              | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Blog**            | Markdown-based blog management with contributor roles and publication states. |
| **Podcast**         | Publish and manage podcast episodes with transcript support.                 |
| **Writeups**        | Share technical CTFs and research writeups in clean, readable markdown.      |
| **Events**          | Plan and publish online/offline events with registration management.         |
| **Achievements**    | Highlight personal or team milestones like certifications, awards, etc.      |
| **Team Hub**        | Add contributors, manage profiles, assign roles, and highlight expertise.    |
| **Dashboard**       | Admin panel to manage all content modules, analytics, and quick actions.     |
| **Markdown Editor** | Reusable markdown editor with image upload, preview, and formatting tools.   |
| **Search & Filter** | Global search with contextual filters for each module.                       |

---

## ⚙️ Tech Stack

### Frontend

- React.js + Vite  
- Tailwind CSS (centralized styling via `Style.js`)  
- Headless UI for accessible modal components  
- React Router v6+ for SPA routing  
- Axios for REST API communication  

### Backend

- Flask REST API with JWT authentication and role-based access control  
- PostgreSQL / MySQL (configurable)  
- Cloudinary or Amazon S3 for image storage (optional)  
- AdminGuard middleware for protecting routes  

---

## 📁 Project Structure

```text
team-simple/
├── app/
│   ├── components/
│   │   ├── blogs/
│   │   ├── podcasts/
│   │   ├── writeups/
│   │   ├── events/
│   │   └── dashboard/
│   ├── public/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── backend/
│   ├── api/
│   ├── models/
│   ├── services/
│   └── tests/
├── .env
├── README.md
└── CONTRIBUTING.md
