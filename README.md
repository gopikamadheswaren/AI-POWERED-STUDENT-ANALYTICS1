# NexusEdu AI: Student Success Analytics & Early Warning Platform

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.x-black.svg)
![Frontend](https://img.shields.io/badge/UI%2FUX-Executive%20SaaS%20Design-indigo.svg)
![Nimbus](https://img.shields.io/badge/ByteXL%20Nimbus-Pre--configured-orange.svg)
![Netlify](https://img.shields.io/badge/Netlify-1--Click%20Deploy-00C7B7.svg)

NexusEdu AI is an enterprise-grade **AI-Powered Student Analytics, Early Warning, and Academic Success Platform** built for universities, faculty advisors, and academic leadership. It moves beyond static gradebooks by integrating predictive risk assessment, multi-dimensional competency radar tracking, an interactive "What-If" intervention simulator, and automated personalized study action plans.

---

## 🌟 Key Features

### 1. Multi-Dimensional AI Success Index (0 - 100)
- **Holistic Metric Evaluation**: Combines internal assessment marks, previous exam trend momentum, attendance discipline, LMS digital activity, assignment submission timeliness, placement aptitude, and faculty feedback.
- **Explainable Diagnostics**: Clearly pinpoints why a student is flagged (*e.g., "Attendance critically low at 64%", "8-point plunge vs prior midterm", "2 uncleared backlogs"*).
- **Early Warning Risk Matrix**: Classifies students into **High Risk (Needs Support)**, **Moderate Risk (Monitor)**, and **Low Risk (On Track)**.

### 2. Interactive "What-If" Success Simulator
- A real-time sandbox for mentors and students to model academic turnaround scenarios.
- Sliders for attendance targets, assignment completion, LMS logins, placement prep, and clearing backlogs.
- Dynamic gauge calculates the projected change in AI Success Score, updated risk tier, and placement conversion probability.

### 3. Student 360° Diagnostic Profile & Radar Chart
- Interactive modal / drawer displaying 6-axis performance radar: *Academics, Attendance, Assignments, Engagement, Placement Readiness, and Technical Skills*.
- **Automated 4-Step Personalized Action Plan** with interactive milestone checklist.
- **Auto-Drafted Faculty Mentor Advisory Memo** with one-click copy and print options.

### 4. Cohort & Department Benchmarking
- Cross-department comparison analytics (*CSE AIML, CSBS, CSE Core, IT, ECE*).
- Performance trajectory comparing midterm exams vs current test scores.
- Live AI Early Warning feed streaming immediate attention alerts.

### 5. Dual-Engine Architecture (Nimbus & Netlify Ready)
- **ByteXL Nimbus Mode**: Connects directly to the Flask backend with persistent SQLite database storage and REST APIs.
- **Netlify Standalone Mode**: Automatically engages the client-side heuristic AI engine with LocalStorage persistence when hosted on static / Jamstack platforms.

---

## 📐 AI Scoring Algorithm

The platform computes an explainable composite **Success Index** using weighted multi-factor evaluation:

$$\text{Success Score} = \min\Big(100, \max\big(0, S_{\text{academic}} + S_{\text{attendance}} + S_{\text{engagement}} + S_{\text{career}} + S_{\text{softskills}} - P_{\text{backlogs}}\big)\Big)$$

Where:
- **Academic Index ($35\%$)**: $(0.25 \times \text{Marks}) + (0.10 \times \text{Previous Marks})$
- **Attendance Discipline ($20\%$)**: $0.20 \times \text{Attendance}$
- **Consistency & Effort ($15\%$)**: $(0.10 \times \text{Assignments}) + (0.05 \times \min(100, \text{LMS Logins}))$
- **Career & Placement Readiness ($15\%$)**: $(0.10 \times \text{Placement Score}) + (0.05 \times \text{Skills Score})$
- **Soft Skills & Engagement ($15\%$)**: $(0.08 \times \text{Engagement Score}) + (0.07 \times \text{Feedback Score})$
- **Backlog Penalty ($P_{\text{backlogs}}$)**: $5.0 \times \text{Backlogs}$

---

## 🚀 Deployment Options

### 1. ByteXL Nimbus (Cloud IDE)
Pre-configured with `.vscode/.studio/studio-manager.json` and `Dockerfile`.
1. Open in ByteXL Nimbus workspace.
2. In the terminal, run:
   ```bash
   python main.py
   ```
3. Click the notification to open port `5000` in the preview pane.

### 2. Netlify (1-Click Deployment)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `AI_Student_Analytics_Success_Platform` folder.
3. Your site goes live instantly at a free public URL with full interactive capabilities!

*(For full details and Docker commands, see [DEPLOYMENT.md](DEPLOYMENT.md))*

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students` | Get all students with AI analysis (supports search, dept, status filters) |
| `GET` | `/api/students/<id>` | Get individual student profile with radar breakdown |
| `POST` | `/api/students` | Create new student record with real-time AI scoring |
| `PUT` | `/api/students/<id>` | Update student metrics and re-compute AI score |
| `DELETE` | `/api/students/<id>` | Delete student record |
| `GET` | `/api/summary` | Get aggregated dashboard KPIs and department stats |
| `POST` | `/api/predict` | Simulate hypothetical What-If scenario |
| `GET` | `/api/export/csv` | Download full student cohort CSV export |
| `POST` | `/api/reset` | Restore standard 12-student demo dataset |

---

## 🛠️ Tech Stack
- **Backend**: Python 3.11+, Flask 3.0, SQLite3, Gunicorn
- **Frontend**: Modern Vanilla JS (ES6+), HTML5, CSS3 Custom Properties (Dark/Light SaaS Themes)
- **Data Visualizations**: Chart.js 4.4 (Bar, Doughnut, Radar)
- **Deployment**: ByteXL Nimbus Studio, Netlify, Docker