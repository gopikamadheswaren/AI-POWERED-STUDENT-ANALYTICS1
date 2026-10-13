import sqlite3
import csv
import io
from pathlib import Path
from flask import Flask, render_template, jsonify, request, Response

app = Flask(__name__, static_folder="static", template_folder="templates")
DB_PATH = Path(__file__).with_name("students.db")


# ---------------- DATABASE MANAGEMENT ----------------

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roll_no TEXT DEFAULT '',
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            email TEXT DEFAULT '',
            mentor_name TEXT DEFAULT '',
            attendance REAL DEFAULT 0,
            marks REAL DEFAULT 0,
            previous_marks REAL DEFAULT 0,
            assignment_completion REAL DEFAULT 0,
            lms_logins REAL DEFAULT 0,
            engagement_score REAL DEFAULT 0,
            placement_score REAL DEFAULT 0,
            skills_score REAL DEFAULT 0,
            feedback_score REAL DEFAULT 0,
            backlogs INTEGER DEFAULT 0
        )
    """)

    # Safe migration: add missing columns if upgrading an older DB schema
    existing_cols = {
        row[1] for row in conn.execute("PRAGMA table_info(students)").fetchall()
    }
    for col, col_type in [
        ("roll_no", "TEXT DEFAULT ''"),
        ("reg_no", "TEXT DEFAULT ''"),
        ("email", "TEXT DEFAULT ''"),
        ("phone", "TEXT DEFAULT ''"),
        ("year", "TEXT DEFAULT '1st Year'"),
        ("semester", "TEXT DEFAULT 'Sem 2'"),
        ("mentor_name", "TEXT DEFAULT ''"),
        ("cgpa", "REAL DEFAULT 0.0"),
        ("fee_status", "TEXT DEFAULT 'Paid'"),
        ("fee_amount", "REAL DEFAULT 85000"),
        ("fee_paid", "REAL DEFAULT 85000"),
        ("fee_due", "REAL DEFAULT 0")
    ]:
        if col not in existing_cols:
            try:
                conn.execute(f"ALTER TABLE students ADD COLUMN {col} {col_type}")
            except Exception:
                pass

    count = conn.execute("SELECT COUNT(*) FROM students").fetchone()[0]

    if count < 100:
        seed_demo_data(conn)

    conn.commit()
    conn.close()


def seed_demo_data(conn=None):
    close_at_end = False
    if conn is None:
        conn = get_db()
        close_at_end = True

    conn.execute("DELETE FROM students")

    depts = [
        {"name": "CSE AIML", "prefix": "AIML", "mentor": "Dr. Arvind Rao"},
        {"name": "CSBS", "prefix": "CSBS", "mentor": "Prof. Meenakshi S"},
        {"name": "CSE Core", "prefix": "CSE", "mentor": "Dr. Rajesh Gupta"},
        {"name": "IT", "prefix": "IT", "mentor": "Prof. Suresh Nair"},
        {"name": "ECE", "prefix": "ECE", "mentor": "Dr. Geetha K"}
    ]

    first_names = [
        "Priya", "Arun", "Kavin", "Meena", "Rahul", "Sneha", "Vikram", "Ananya", "Karthik", "Divya",
        "Rohit", "Tanvi", "Aaditya", "Deepa", "Vignesh", "Pooja", "Sanjay", "Lavanya", "Ashwin", "Swathi",
        "Naveen", "Harini", "Gautam", "Keerthana", "Manoj", "Aishwarya", "Dinesh", "Preeti", "Siddharth", "Nandhini",
        "Abhishek", "Shreya", "Pranav", "Varsha", "Rajesh", "Pavithra", "Ganesh", "Gayathri", "Surya", "Sandhya",
        "Akash", "Anu", "Hari", "Monica", "Ajay", "Kavya", "Vijay", "Archana", "Kishore", "Sowmya",
        "Tarun", "Divyashree", "Kiran", "Nithya", "Vimal", "Reshma", "Sudhir", "Bhavana", "Mohan", "Sindhu",
        "Chetan", "Madhumitha", "Nitin", "Shalini", "Vivek", "Saranya", "Praveen", "Kalyani", "Ramesh", "Deepika",
        "Girish", "Yamini", "Lokesh", "Kavitha", "Sharath", "Bhavani", "Raghav", "Sangeetha", "Shankar", "Vandana",
        "Manish", "Sunita", "Harish", "Aparna", "Vinay", "Hemalatha", "Ranjith", "Geethanjali", "Umesh", "Manju",
        "Mukesh", "Vasuki", "Sunil", "Revathi", "Suresh", "Roshni", "Anand", "Sowparnika", "Deepak", "Aarthy"
    ]

    last_names = [
        "Sharma", "Kumar", "Raj", "Sundaram", "Varma", "Patel", "Malhotra", "Iyer", "Raja", "Nambiar",
        "Sen", "Deshmukh", "Nair", "Krishnan", "Pillai", "Ranganathan", "Menon", "Suresh", "Balaji", "Ramachandran",
        "Reddy", "Choudhury", "Bose", "Gowda", "Bhat", "Kulkarni", "Joshi", "Mishra", "Pandey", "Chatterjee",
        "Venkatesh", "Shetty", "Hebbar", "Naidu", "Sethi", "Mukherjee", "Banerjee", "Das", "Dutta", "Roy",
        "Gupta", "Agarwal", "Saxena", "Srivastava", "Verma", "Tiwari", "Dubey", "Shukla", "Tripathi", "Chauhan"
    ]

    demo_students = []
    years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
    sems = ["Sem 2", "Sem 4", "Sem 6", "Sem 8"]

    for i in range(1, 101):
        dept_idx = (i - 1) // 20
        dept = depts[dept_idx]
        f_name = first_names[i - 1]
        l_name = last_names[(i * 3 + 7) % len(last_names)]
        name = f"{f_name} {l_name}"
        roll_no = f"2024{dept['prefix']}{i:03d}"
        reg_no = f"REG2024{7800 + i}"
        year_idx = ((i % 4) or 4) - 1
        year = years[year_idx]
        sem = sems[year_idx]
        email = f"{f_name.lower()}.{l_name.lower()}{i}@campus.edu"
        phone = f"+91 98401 {10000 + (i * 739) % 90000}"

        marks = round(55.0 + float((i * 17) % 41) - (15.0 if i % 6 == 0 else 0.0), 1)
        attendance = round(62.0 + float((i * 19) % 36) - (16.0 if i % 8 == 0 else 0.0), 1)
        prev_marks = round(marks + float(((i % 3) - 1) * 3), 1)
        cgpa = round(max(4.2, min(9.85, (marks / 10.0) + float(((i % 5) - 2) * 0.12))), 2)
        backlogs = ((i % 3) + 1) if (cgpa < 5.5 or marks < 50 or attendance < 65) else 0

        placement = round(max(35.0, min(98.0, marks * 0.9 + float((i * 7) % 15))), 1)
        skills = round(max(40.0, min(96.0, placement * 0.95 + float((i * 11) % 10))), 1)
        feedback = round(max(55.0, min(98.0, 70.0 + float((i * 13) % 28))), 1)
        lms = round(max(25.0, min(145.0, 45.0 + float((i * 23) % 95))), 1)
        assign = round(max(50.0, min(100.0, attendance * 0.95 + float((i * 3) % 10))), 1)
        eng = round((attendance + assign) / 2.0, 1)

        fee_status = "Overdue" if (i % 10 == 0) else ("Pending" if (i % 5 == 0) else "Paid")
        fee_amount = 85000.0
        fee_paid = 85000.0 if fee_status == "Paid" else (42500.0 if fee_status == "Pending" else 0.0)
        fee_due = fee_amount - fee_paid

        demo_students.append((
            roll_no, reg_no, name, dept["name"], year, sem, cgpa, email, phone, dept["mentor"],
            attendance, marks, prev_marks, assign, lms, eng, placement, skills, feedback, backlogs,
            fee_status, fee_amount, fee_paid, fee_due
        ))

    conn.executemany("""
        INSERT INTO students (
            roll_no, reg_no, name, department, year, semester, cgpa, email, phone, mentor_name,
            attendance, marks, previous_marks, assignment_completion,
            lms_logins, engagement_score, placement_score,
            skills_score, feedback_score, backlogs,
            fee_status, fee_amount, fee_paid, fee_due
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, demo_students)

    conn.commit()
    if close_at_end:
        conn.close()


# ---------------- ADVANCED AI ANALYTICS ENGINE ----------------

def analyze_student(student):
    """
    Multi-dimensional composite scoring & intelligent risk evaluation.
    Evaluates academic trajectory, attendance discipline, LMS consistency,
    placement readiness, and backlogs penalty.
    """
    marks = float(student.get("marks", 0))
    prev_marks = float(student.get("previous_marks", 0))
    attendance = float(student.get("attendance", 0))
    assign = float(student.get("assignment_completion", 0))
    lms = float(student.get("lms_logins", 0))
    eng = float(student.get("engagement_score", 0))
    placement = float(student.get("placement_score", 0))
    skills = float(student.get("skills_score", 0))
    feedback = float(student.get("feedback_score", 0))
    backlogs = int(student.get("backlogs", 0))

    # Dimension 1: Academic Index (35%)
    academic_index = (marks * 0.25) + (prev_marks * 0.10)

    # Dimension 2: Attendance & Discipline (20%)
    attendance_index = attendance * 0.20

    # Dimension 3: Digital Engagement & Consistency (15%)
    engagement_index = (assign * 0.10) + (min(lms, 100) * 0.05)

    # Dimension 4: Career & Placement Readiness (15%)
    career_index = (placement * 0.10) + (skills * 0.05)

    # Dimension 5: Faculty & Soft Skills Feedback (15%)
    softskills_index = (eng * 0.08) + (feedback * 0.07)

    # Raw composite score (0 - 100)
    raw_score = (
        academic_index
        + attendance_index
        + engagement_index
        + career_index
        + softskills_index
    )

    # Backlog penalty (-5 points per backlog)
    backlog_penalty = backlogs * 5.0
    final_score = round(max(0, min(100, raw_score - backlog_penalty)), 1)

    # Trajectory & Projections
    mark_delta = round(marks - prev_marks, 1)
    projected_final_marks = round(max(0, min(100, marks + (mark_delta * 0.4))), 1)

    placement_chance = round(max(5, min(98, (
        placement * 0.45 + skills * 0.35 + (marks * 0.20) - (backlogs * 12)
    ))), 1)

    # Warning flags & Diagnostics
    warning_flags = []
    reasons = []
    recommendations = []

    if attendance < 65:
        warning_flags.append({"type": "critical", "label": "Severe Attendance Shortage (<65%)"})
        reasons.append("Attendance is critically low at " + str(attendance) + "%, risking exam debarment")
        recommendations.append("Immediate attendance recovery contract and mandatory daily check-ins")
    elif attendance < 75:
        warning_flags.append({"type": "warning", "label": "Attendance Below 75%"})
        reasons.append("Attendance (" + str(attendance) + "%) is under the university mandatory 75% cutoff")
        recommendations.append("Counsel student on class engagement and track weekly attendance")

    if marks < 50:
        warning_flags.append({"type": "critical", "label": "Failing / High Academic Distress (<50)"})
        reasons.append("Latest examination score (" + str(marks) + "/100) indicates acute learning gaps")
        recommendations.append("Assign peer tutor, provide remedial question banks, and schedule faculty doubt clearing")
    elif marks < 60:
        warning_flags.append({"type": "warning", "label": "Marginal Exam Score (<60)"})
        reasons.append("Marks (" + str(marks) + "/100) are near the pass border")
        recommendations.append("Conduct topic-wise revision and monitor next internal assessment")

    if mark_delta <= -8:
        warning_flags.append({"type": "critical", "label": f"Sharp Score Drop ({mark_delta} pts)"})
        reasons.append(f"Performance plunged by {abs(mark_delta)} marks compared to prior assessment")
        recommendations.append("Conduct 1-on-1 mentor intervention to identify personal or conceptual roadblocks")
    elif mark_delta < -3:
        warning_flags.append({"type": "warning", "label": f"Declining Marks Trend ({mark_delta} pts)"})
        reasons.append(f"Gradual decline of {abs(mark_delta)} marks observed")
        recommendations.append("Review mid-term test papers and reinforce weak topics")

    if backlogs > 0:
        severity = "critical" if backlogs >= 2 else "warning"
        warning_flags.append({"type": severity, "label": f"{backlogs} Active Backlog(s)"})
        reasons.append(f"{backlogs} uncleared backlog subject(s) hindering semester progression")
        recommendations.append(f"Formulate a structured {backlogs}-subject backlog clearance roadmap before finals")

    if assign < 70:
        warning_flags.append({"type": "warning", "label": "Low Assignment Completion (<70%)"})
        reasons.append(f"Assignment submission rate is {assign}%, reflecting lagging coursework homework")
        recommendations.append("Break pending submissions into bite-sized milestones with weekly deadlines")

    if placement < 50:
        warning_flags.append({"type": "warning", "label": "Placement Readiness Deficit (<50)"})
        reasons.append(f"Placement score ({placement}/100) indicates lack of interview and aptitude preparation")
        recommendations.append("Enroll in technical coding bootcamp and aptitude problem-solving series")

    if lms < 40:
        warning_flags.append({"type": "warning", "label": "Low Digital Platform Activity"})
        reasons.append(f"LMS logins ({int(lms)} total) show minimal usage of online course resources")
        recommendations.append("Mandate completion of asynchronous LMS modules and quiz checks")

    # Status determination
    if final_score < 55 or backlogs >= 2 or (attendance < 65 and marks < 60):
        status = "Needs support"
        status_color = "red"
        risk_badge = "High Risk"
    elif final_score < 75 or len(warning_flags) >= 1:
        status = "Monitor"
        status_color = "orange"
        risk_badge = "Moderate Risk"
    else:
        status = "On track"
        status_color = "green"
        risk_badge = "Low Risk"

    if not reasons:
        reasons.append("Exemplary academic trajectory and consistent behavioral engagement")
        recommendations.append("Encourage participation in advanced honors projects, research, and hackathons")
        recommendations.append("Maintain high-performance momentum and peer mentoring activities")

    # Radar profile metrics (0 - 100 for visual charts)
    radar_data = {
        "Academics": round(marks, 1),
        "Attendance": round(attendance, 1),
        "Assignments": round(assign, 1),
        "Engagement": round(eng, 1),
        "Placement": round(placement, 1),
        "Tech Skills": round(skills, 1)
    }

    # Mentor Auto-Draft Memo
    student_name = student.get("name", "Student")
    faculty_note = (
        f"Automated AI Advisory for {student_name}: Current Success Index is {final_score}/100 ({status}). "
        f"Primary concern: {reasons[0]}. "
        f"Immediate suggested action: {recommendations[0]}."
    )

    # Explicit 7 Data Categories (Academic, Attendance, LMS, Engagement, Placement, Skills, Feedback)
    cgpa_val = round(max(2.0, min(10.0, marks / 10.0)), 2)
    categories = {
        "academic": {
            "cgpa": cgpa_val,
            "marks": marks,
            "previous_marks": prev_marks,
            "backlogs": backlogs,
            "subjects": [
                {"name": "Data Structures & Algorithms", "score": min(100, int(marks * 1.02)), "grade": "A+" if marks >= 85 else ("A" if marks >= 70 else "B")},
                {"name": "Database Management Systems", "score": min(100, int(marks * 0.98)), "grade": "A" if marks >= 80 else "B"},
                {"name": "AI & Machine Learning", "score": min(100, int(marks * 1.05)), "grade": "O" if marks >= 90 else "A"},
                {"name": "Operating Systems", "score": min(100, int(marks * 0.95)), "grade": "A" if marks >= 75 else "C"},
                {"name": "Computer Networks", "score": min(100, int(marks * 0.92)), "grade": "B+" if marks >= 65 else "P"}
            ]
        },
        "attendance": {
            "overall": attendance,
            "is_shortage": attendance < 75,
            "is_critical": attendance < 65,
            "classes_attended": int(attendance * 0.9),
            "total_classes": 90,
            "subjects": [
                {"name": "Data Structures", "pct": min(100, int(attendance * 1.03))},
                {"name": "Database Systems", "pct": min(100, int(attendance * 0.98))},
                {"name": "AI & ML", "pct": min(100, int(attendance * 1.01))},
                {"name": "Operating Systems", "pct": min(100, int(attendance * 0.95))},
                {"name": "Computer Networks", "pct": min(100, int(attendance * 0.92))}
            ]
        },
        "lms": {
            "login_frequency": int(lms),
            "weekly_streak": int(lms / 6) + 2,
            "assignment_completion": assign,
            "assignments_submitted": int(assign * 0.2),
            "total_assignments": 20,
            "pending_modules": max(0, int((100 - assign) / 10))
        },
        "engagement": {
            "events_attended": int(eng / 12) + 1,
            "clubs": ["Google Developer Student Club", "AI Innovation Society"] if eng >= 75 else ["Tech & Coding Society"],
            "hackathons": 2 if eng >= 85 else (1 if eng >= 65 else 0),
            "certifications": (
                ["AWS Certified Cloud Practitioner", "LeetCode 100-Day Badge", "DeepLearning.AI Spec"]
                if skills >= 80 else ["HackerRank Python 5-Star", "Coursera Web Dev"]
            )
        },
        "placement": {
            "aptitude_score": placement,
            "coding_score": skills,
            "mock_interviews": feedback,
            "chance_pct": placement_chance,
            "tier_eligibility": (
                "Tier-1 Product Companies" if (cgpa_val >= 8.0 and backlogs == 0 and placement >= 75)
                else ("Tier-2 Core & IT Services" if backlogs <= 1 and placement >= 50 else "Requires Aptitude Bootcamp")
            )
        },
        "skills": {
            "score": skills,
            "technical": skills,
            "soft_skills": feedback,
            "assessments": [
                {"skill": "Python / Java", "score": min(100, int(skills * 1.04))},
                {"skill": "SQL & Data Modeling", "score": min(100, int(skills * 0.98))},
                {"skill": "Problem Solving (DSA)", "score": min(100, int(skills * 0.92))},
                {"skill": "Communication", "score": min(100, int(feedback * 1.02))},
                {"skill": "Teamwork & Adaptability", "score": min(100, int(feedback * 0.95))}
            ]
        },
        "feedback": {
            "student_satisfaction": round(feedback / 20.0, 1),
            "faculty_feedback": faculty_note,
            "mentor_remarks": (
                "Excellent academic consistency and technical initiative."
                if final_score >= 80 else
                f"Requires structured attention on {reasons[0].lower()}."
            )
        }
    }

    return {
        "success_score": final_score,
        "status": status,
        "status_color": status_color,
        "risk_badge": risk_badge,
        "warning_flags": warning_flags,
        "reasons": reasons,
        "recommendations": recommendations,
        "mark_delta": mark_delta,
        "projected_final_marks": projected_final_marks,
        "placement_chance": placement_chance,
        "radar": radar_data,
        "faculty_note": faculty_note,
        "categories": categories
    }


def get_students(query_params=None):
    conn = get_db()
    rows = conn.execute("SELECT * FROM students ORDER BY id").fetchall()
    conn.close()

    students = []
    for row in rows:
        student = dict(row)
        student["cgpa"] = round(float(student.get("cgpa") or (float(student.get("marks", 0)) / 10.0)), 2)
        student["analysis"] = analyze_student(student)
        students.append(student)

    if not query_params:
        return students

    search = query_params.get("search", "").strip().lower()
    dept = query_params.get("dept", "").strip()
    status = query_params.get("status", "").strip()
    sort_by = query_params.get("sort", "").strip()

    filtered = students
    if search:
        filtered = [
            s for s in filtered
            if search in s["name"].lower()
            or search in s.get("roll_no", "").lower()
            or search in s["department"].lower()
            or search in str(s["id"])
        ]
    if dept and dept != "All":
        filtered = [s for s in filtered if s["department"] == dept]
    if status and status != "All":
        filtered = [s for s in filtered if s["analysis"]["status"].lower() == status.lower()]

    if sort_by == "name":
        filtered.sort(key=lambda s: s["name"].lower())
    elif sort_by == "marks":
        filtered.sort(key=lambda s: s["marks"], reverse=True)
    elif sort_by == "attendance":
        filtered.sort(key=lambda s: s["attendance"], reverse=True)
    elif sort_by == "score":
        filtered.sort(key=lambda s: s["analysis"]["success_score"], reverse=True)
    elif sort_by == "cgpa":
        filtered.sort(key=lambda s: s["cgpa"], reverse=True)

    return filtered


# ---------------- HTTP ROUTES (PORTALS + LOGIN + ALIASES) ----------------

@app.route("/", strict_slashes=False)
def home():
    return render_template("login.html")

@app.route("/login", strict_slashes=False)
@app.route("/login.html", strict_slashes=False)
@app.route("/login-pages", strict_slashes=False)
@app.route("/login-pages.html", strict_slashes=False)
@app.route("/loginpages", strict_slashes=False)
@app.route("/login-page", strict_slashes=False)
@app.route("/logins", strict_slashes=False)
def login_portal():
    return render_template("login.html")

@app.route("/student-login", strict_slashes=False)
@app.route("/student-login.html", strict_slashes=False)
@app.route("/student/login", strict_slashes=False)
@app.route("/student_login", strict_slashes=False)
@app.route("/login/student", strict_slashes=False)
@app.route("/login/student-login.html", strict_slashes=False)
def student_login_page():
    return render_template("student-login.html")

@app.route("/faculty-login", strict_slashes=False)
@app.route("/faculty-login.html", strict_slashes=False)
@app.route("/faculty/login", strict_slashes=False)
@app.route("/faculty_login", strict_slashes=False)
@app.route("/facalty-login", strict_slashes=False)
@app.route("/facalty-login.html", strict_slashes=False)
@app.route("/login/faculty", strict_slashes=False)
@app.route("/login/faculty-login.html", strict_slashes=False)
def faculty_login_page():
    return render_template("faculty-login.html")

@app.route("/placement-login", strict_slashes=False)
@app.route("/placement-login.html", strict_slashes=False)
@app.route("/placement/login", strict_slashes=False)
@app.route("/placement_login", strict_slashes=False)
@app.route("/login/placement", strict_slashes=False)
@app.route("/login/placement-login.html", strict_slashes=False)
def placement_login_page():
    return render_template("placement-login.html")

@app.route("/admin-login", strict_slashes=False)
@app.route("/admin-login.html", strict_slashes=False)
@app.route("/admin/login", strict_slashes=False)
@app.route("/admin_login", strict_slashes=False)
@app.route("/administrator-login", strict_slashes=False)
@app.route("/administrator-login.html", strict_slashes=False)
@app.route("/adminstator-login", strict_slashes=False)
@app.route("/login/admin", strict_slashes=False)
@app.route("/login/admin-login.html", strict_slashes=False)
def admin_login_page():
    return render_template("admin-login.html")

@app.route("/student", strict_slashes=False)
@app.route("/student.html", strict_slashes=False)
def student_portal():
    return render_template("student.html")

@app.route("/faculty", strict_slashes=False)
@app.route("/faculty.html", strict_slashes=False)
@app.route("/facalty", strict_slashes=False)
@app.route("/facalty.html", strict_slashes=False)
def faculty_portal():
    return render_template("faculty.html")

@app.route("/placement", strict_slashes=False)
@app.route("/placement.html", strict_slashes=False)
def placement_portal():
    return render_template("placement.html")

@app.route("/admin", strict_slashes=False)
@app.route("/admin.html", strict_slashes=False)
@app.route("/administrator", strict_slashes=False)
@app.route("/administrator.html", strict_slashes=False)
@app.route("/adminstator", strict_slashes=False)
@app.route("/adminstator.html", strict_slashes=False)
def administrator_portal():
    return render_template("administrator.html")


@app.route("/api/students", methods=["GET"])
def students_api():
    query_params = {
        "search": request.args.get("search", ""),
        "dept": request.args.get("dept", ""),
        "status": request.args.get("status", ""),
        "sort": request.args.get("sort", "")
    }
    return jsonify(get_students(query_params))


@app.route("/api/students/<int:student_id>", methods=["GET"])
def get_student_by_id(student_id):
    students = get_students()
    match = next((s for s in students if s["id"] == student_id), None)
    if not match:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(match)


@app.route("/api/summary", methods=["GET"])
def summary_api():
    students = get_students()
    total = len(students)

    if total == 0:
        return jsonify({
            "total": 0,
            "average_marks": 0,
            "average_attendance": 0,
            "average_success_score": 0,
            "needs_support": 0,
            "monitor": 0,
            "on_track": 0,
            "placement_ready_pct": 0,
            "departments": {},
            "top_dept": "N/A"
        })

    avg_marks = round(sum(s["marks"] for s in students) / total, 1)
    avg_att = round(sum(s["attendance"] for s in students) / total, 1)
    avg_score = round(sum(s["analysis"]["success_score"] for s in students) / total, 1)

    needs_support = sum(1 for s in students if s["analysis"]["status"] == "Needs support")
    monitor = sum(1 for s in students if s["analysis"]["status"] == "Monitor")
    on_track = sum(1 for s in students if s["analysis"]["status"] == "On track")

    placement_ready = sum(1 for s in students if s["analysis"]["placement_chance"] >= 70)
    placement_ready_pct = round((placement_ready / total) * 100, 1)

    # Department breakdown
    depts = {}
    for s in students:
        d = s["department"]
        if d not in depts:
            depts[d] = {"count": 0, "marks_sum": 0, "att_sum": 0, "score_sum": 0}
        depts[d]["count"] += 1
        depts[d]["marks_sum"] += s["marks"]
        depts[d]["att_sum"] += s["attendance"]
        depts[d]["score_sum"] += s["analysis"]["success_score"]

    dept_summary = {}
    top_dept = "N/A"
    top_dept_score = -1

    for d, stats in depts.items():
        c = stats["count"]
        d_avg_score = round(stats["score_sum"] / c, 1)
        dept_summary[d] = {
            "count": c,
            "avg_marks": round(stats["marks_sum"] / c, 1),
            "avg_attendance": round(stats["att_sum"] / c, 1),
            "avg_score": d_avg_score
        }
        if d_avg_score > top_dept_score:
            top_dept_score = d_avg_score
            top_dept = d

    return jsonify({
        "total": total,
        "average_marks": avg_marks,
        "average_attendance": avg_att,
        "average_success_score": avg_score,
        "needs_support": needs_support,
        "monitor": monitor,
        "on_track": on_track,
        "placement_ready_pct": placement_ready_pct,
        "departments": dept_summary,
        "top_dept": top_dept
    })


@app.route("/api/predict", methods=["POST"])
def predict_what_if():
    """
    Simulation sandbox: computes instantaneous predicted score
    and trajectory changes when hypothetical inputs are adjusted.
    """
    data = request.get_json(silent=True) or {}
    analysis = analyze_student(data)
    return jsonify({
        "input": data,
        "analysis": analysis
    })


@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Send student data as JSON"}), 400

    name = data.get("name", "").strip()
    department = data.get("department", "").strip()
    roll_no = data.get("roll_no", "").strip() or f"STU-{len(get_students()) + 101}"
    email = data.get("email", "").strip() or f"{name.lower().replace(' ', '.')}@campus.edu"
    mentor_name = data.get("mentor_name", "").strip() or "Faculty Advisor"

    if not name:
        return jsonify({"error": "Student name is required"}), 400
    if not department:
        return jsonify({"error": "Department is required"}), 400

    numeric_fields = {
        "attendance": 80.0,
        "marks": 70.0,
        "previous_marks": 70.0,
        "assignment_completion": 75.0,
        "lms_logins": 60.0,
        "engagement_score": 70.0,
        "placement_score": 65.0,
        "skills_score": 70.0,
        "feedback_score": 75.0,
        "backlogs": 0
    }

    values = {}
    for field, default in numeric_fields.items():
        try:
            val = float(data.get(field, default))
        except (TypeError, ValueError):
            return jsonify({"error": f"Invalid numeric value for {field}"}), 400

        if field == "backlogs":
            if val < 0:
                return jsonify({"error": "Backlogs cannot be negative"}), 400
            values[field] = int(val)
        else:
            if not 0 <= val <= 100:
                return jsonify({"error": f"{field} must be between 0 and 100"}), 400
            values[field] = val

    conn = get_db()
    cursor = conn.execute("""
        INSERT INTO students (
            roll_no, name, department, email, mentor_name,
            attendance, marks, previous_marks, assignment_completion,
            lms_logins, engagement_score, placement_score,
            skills_score, feedback_score, backlogs
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        roll_no, name, department, email, mentor_name,
        values["attendance"], values["marks"], values["previous_marks"],
        values["assignment_completion"], values["lms_logins"],
        values["engagement_score"], values["placement_score"],
        values["skills_score"], values["feedback_score"], values["backlogs"]
    ))

    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    created_student = next(s for s in get_students() if s["id"] == new_id)
    return jsonify({
        "message": "Student record created successfully",
        "student": created_student
    }), 201


@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Send student data as JSON"}), 400

    conn = get_db()
    existing = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Student not found"}), 404

    allowed_text = {"name", "department", "roll_no", "email", "mentor_name"}
    allowed_numbers = {
        "attendance", "marks", "previous_marks", "assignment_completion",
        "lms_logins", "engagement_score", "placement_score",
        "skills_score", "feedback_score", "backlogs"
    }

    updates = {}
    for key, val in data.items():
        if key in allowed_text:
            if isinstance(val, str) and val.strip():
                updates[key] = val.strip()
        elif key in allowed_numbers:
            try:
                num = float(val)
            except (TypeError, ValueError):
                conn.close()
                return jsonify({"error": f"Invalid value for {key}"}), 400

            if key == "backlogs":
                if num < 0:
                    conn.close()
                    return jsonify({"error": "Backlogs cannot be negative"}), 400
                updates[key] = int(num)
            else:
                if not 0 <= num <= 100:
                    conn.close()
                    return jsonify({"error": f"{key} must be between 0 and 100"}), 400
                updates[key] = num

    if not updates:
        conn.close()
        return jsonify({"error": "No valid fields to update"}), 400

    set_clause = ", ".join(f"{field} = ?" for field in updates)
    conn.execute(
        f"UPDATE students SET {set_clause} WHERE id = ?",
        (*updates.values(), student_id)
    )
    conn.commit()
    conn.close()

    updated = next(s for s in get_students() if s["id"] == student_id)
    return jsonify({
        "message": "Student updated successfully",
        "student": updated
    })


@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    conn = get_db()
    cursor = conn.execute("DELETE FROM students WHERE id = ?", (student_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({"error": "Student not found"}), 404

    return jsonify({
        "message": "Student removed successfully",
        "total": len(get_students())
    })


@app.route("/api/reset", methods=["POST"])
def reset_database():
    seed_demo_data()
    return jsonify({
        "message": "Database reset to rich standard demo dataset",
        "total": len(get_students())
    })


@app.route("/api/export/csv", methods=["GET"])
def export_csv():
    students = get_students()
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "ID", "Roll No", "Name", "Department", "Email", "Mentor",
        "Attendance (%)", "Marks", "Previous Marks", "Assignments (%)",
        "LMS Logins", "Engagement Score", "Placement Score", "Skills Score",
        "Feedback Score", "Backlogs", "Success Score", "Status", "Risk Badge",
        "Placement Chance (%)", "Projected Final Marks", "Key Diagnostic"
    ])

    for s in students:
        a = s["analysis"]
        writer.writerow([
            s["id"], s.get("roll_no", ""), s["name"], s["department"],
            s.get("email", ""), s.get("mentor_name", ""),
            s["attendance"], s["marks"], s["previous_marks"],
            s["assignment_completion"], s["lms_logins"], s["engagement_score"],
            s["placement_score"], s["skills_score"], s["feedback_score"],
            s["backlogs"], a["success_score"], a["status"], a["risk_badge"],
            a["placement_chance"], a["projected_final_marks"],
            "; ".join(a["reasons"])
        ])

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=student_analytics_export.csv"}
    )


# ---------------- CATCH-ALL & 404 ERROR RECOVERY ----------------

@app.route("/<path:subpath>", methods=["GET"], strict_slashes=False)
def catch_all_routes(subpath):
    if subpath.startswith("api/"):
        return jsonify({"error": "API endpoint not found"}), 404
        
    cleaned = subpath.strip("/").lower()
    last_seg = Path(cleaned).name.lower()
    
    # 1. Login hub matches
    if any(k in cleaned for k in ["login-page", "loginpages", "login-pages", "logins", "portal", "gateway", "auth"]):
        return render_template("login.html")
        
    # 2. Student login matches
    if "student" in cleaned and "login" in cleaned:
        return render_template("student-login.html")
        
    # 3. Faculty login matches (including facalty typo)
    if ("faculty" in cleaned or "facalty" in cleaned) and "login" in cleaned:
        return render_template("faculty-login.html")
        
    # 4. Placement login matches
    if "placement" in cleaned and "login" in cleaned:
        return render_template("placement-login.html")
        
    # 5. Admin login matches (including adminstator typo)
    if ("admin" in cleaned or "dean" in cleaned) and "login" in cleaned:
        return render_template("admin-login.html")
        
    # 6. Portal page aliases
    if cleaned in ["student", "student.html"]:
        return render_template("student.html")
    if cleaned in ["faculty", "faculty.html", "facalty", "facalty.html"]:
        return render_template("faculty.html")
    if cleaned in ["placement", "placement.html"]:
        return render_template("placement.html")
    if cleaned in ["admin", "admin.html", "administrator", "administrator.html", "adminstator", "adminstator.html"]:
        return render_template("administrator.html")
        
    # 7. Check if file exists directly in templates folder
    template_dir = Path(app.template_folder)
    for cand in [last_seg, f"{last_seg}.html", cleaned, f"{cleaned}.html"]:
        if (template_dir / cand).is_file():
            return render_template(cand)
            
    # Default graceful fallback to campus login portal
    return render_template("login.html")

@app.errorhandler(404)
def handle_404_not_found(e):
    path = request.path.strip("/").lower()
    if path.startswith("api/"):
        return jsonify({"error": "Resource not found"}), 404
        
    if "student" in path and "login" in path:
        return render_template("student-login.html")
    if ("faculty" in path or "facalty" in path) and "login" in path:
        return render_template("faculty-login.html")
    if "placement" in path and "login" in path:
        return render_template("placement-login.html")
    if "admin" in path and "login" in path:
        return render_template("admin-login.html")
    if path in ["student", "student.html"]:
        return render_template("student.html")
    if path in ["faculty", "faculty.html", "facalty", "facalty.html"]:
        return render_template("faculty.html")
    if path in ["placement", "placement.html"]:
        return render_template("placement.html")
    if path in ["admin", "admin.html", "administrator", "administrator.html"]:
        return render_template("administrator.html")
        
    return render_template("login.html"), 200


# ---------------- INITIALIZATION ----------------

init_db()

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
