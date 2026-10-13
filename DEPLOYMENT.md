# 🚀 Deployment & Operations Guide
## AI Student Analytics & Success Platform (NexusEdu AI)

This platform features an intelligent **Dual-Engine Architecture**:
1. **Cloud Flask API + SQLite Engine**: Active when deployed in containerized cloud environments like **ByteXL Nimbus**, Docker, Render, or Localhost.
2. **Autonomous Client-Side AI Engine + LocalStorage**: Active when hosted on static / Jamstack platforms like **Netlify** or run directly in the browser.

---

## 1. Deploying on ByteXL Nimbus

ByteXL Nimbus is a cloud workspace environment for students and instructors. The repository is pre-configured for Nimbus using `.vscode/.studio/studio-manager.json` and `Dockerfile`.

### Automatic Startup in Nimbus:
When you load the repository in ByteXL Nimbus, the studio manager automatically:
- Opens `main.py`
- Launches an integrated terminal and executes `python main.py`
- Detects the web server listening on port `5000` (`0.0.0.0:5000`)

### Manual Startup (if needed):
1. Open the Nimbus integrated terminal (`Ctrl + ~` or Terminal &rarr; New Terminal).
2. Install dependencies (if not pre-installed):
   ```bash
   pip install -r requirements.txt
   ```
3. Start the application:
   ```bash
   python main.py
   ```
   *(or `python app.py`)*
4. ByteXL Nimbus will prompt you with a notification: **"A service is listening on port 5000"**. Click **Open in Browser** or open the **Ports** tab and click the web icon next to port `5000`.

---

## 2. Deploying on Netlify

Netlify is the fastest way to showcase your project live on the internet with a public URL (`https://your-app.netlify.app`).

### Method A: 1-Click Drag & Drop (Easiest & Fastest - 30 seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and log in.
2. Drag and drop the entire project folder (`AI_Student_Analytics_Success_Platform`) directly into the upload box.
3. Netlify will deploy your site in ~5 seconds!
4. Click your generated URL (e.g., `https://sparkling-student-success.netlify.app`).
5. **Notice the Status Pill**: It will display `● Netlify Standalone Mode (Client-Side AI Active)`. All features (KPI cards, What-If simulator, Chart.js radar & trajectories, adding/editing students, CSV export) work **100% interactively** with browser persistence!

### Method B: Git Integration (Continuous Deployment)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Complete AI Student Analytics Platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In Netlify Dashboard, click **Add new site** &rarr; **Import an existing project** &rarr; **GitHub**.
3. Select your repository.
4. Netlify will automatically detect `netlify.toml`:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.` (or root)
5. Click **Deploy Site**. Every future git push will automatically update your live site!

---

## 3. Running with Docker

A production-ready `Dockerfile` is included:

```bash
# Build Docker image
docker build -t student-analytics-platform .

# Run container on port 5000
docker run -d -p 5000:5000 --name student-ai student-analytics-platform
```
Open [http://localhost:5000](http://localhost:5000) in your web browser.

---

## 4. Running Locally on Your Computer

### Prerequisites:
- Python 3.10+ installed

### Steps:
```bash
# 1. Open terminal inside project directory
cd AI_Student_Analytics_Success_Platform

# 2. (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the platform
python main.py
```
Open [http://localhost:5000](http://localhost:5000) to view your live dashboard.

---

## 5. Verification Checklist

| Feature | ByteXL Nimbus | Netlify |
| :--- | :---: | :---: |
| Real-time KPI Ribbon & Counters | ✅ | ✅ |
| Performance Trajectory Bar Chart | ✅ | ✅ |
| Risk Segmentation Doughnut Chart | ✅ | ✅ |
| Department Benchmark Comparison | ✅ | ✅ |
| AI Early Warning Stream | ✅ | ✅ |
| Student 360° Profile & Radar Chart | ✅ | ✅ |
| Interactive What-If Success Simulator | ✅ | ✅ |
| Add / Edit / Delete Student Records | ✅ (SQLite) | ✅ (LocalStorage) |
| CSV Data Export | ✅ | ✅ |
| Dark / Light SaaS Theme Switcher | ✅ | ✅ |
| Responsive Mobile / Tablet Layout | ✅ | ✅ |
