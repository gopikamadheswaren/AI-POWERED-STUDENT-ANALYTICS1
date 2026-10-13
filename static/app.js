/**
 * AI Student Analytics & Success Platform - Modern CAMU-Style College ERP Engine
 * Dual-Engine Architecture: Netlify Standalone (Client-Side AI & LocalStorage) 
 * + ByteXL Nimbus Cloud API (Flask & SQLite).
 * Deterministically generates & manages 100 Fictional Students across 5 Departments & 4 Academic Years.
 */

// ---------------- GLOBAL STATE ----------------
let studentsData = [];
let isCloudMode = false;
let currentDepartmentFilter = "All";
let currentYearFilter = "All";
let currentStatusFilter = "All";
let currentSearchQuery = "";
let currentSort = "id";
let selectedStudentId = 1;

// Pagination state for 100 students directory
let currentPage = 1;
const pageSize = 15;

// Charts instances
let trajectoryChart = null;
let riskChart = null;
let deptChart = null;
let profileRadarChart = null;
let studentPortalRadar = null;
let studentCgpaProgressionChart = null;
let facultyRadarChart = null;
let placementRadarChart = null;

// Active Student for CAMU Student Portal
let activeCamuStudent = null;

// Active faculty department selection
let facultyActiveDept = "CSE AIML";

// Helper for element selection
const $ = (id) => document.getElementById(id);

// ---------------- 100 CAMU STUDENT RECORDS GENERATOR ----------------
function build100CamuStudentRecords() {
  const depts = [
    { name: "CSE AIML", prefix: "AIML", mentor: "Dr. Arvind Rao", hod: "Dr. K. S. Raman" },
    { name: "CSBS", prefix: "CSBS", mentor: "Prof. Meenakshi S", hod: "Dr. V. Sundaram" },
    { name: "CSE Core", prefix: "CSE", mentor: "Dr. Rajesh Gupta", hod: "Dr. P. Venkatesh" },
    { name: "IT", prefix: "IT", mentor: "Prof. Suresh Nair", hod: "Dr. S. Mukherjee" },
    { name: "ECE", prefix: "ECE", mentor: "Dr. Geetha K", hod: "Dr. N. Mohan" }
  ];

  const firstNames = [
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
  ];

  const lastNames = [
    "Sharma", "Kumar", "Raj", "Sundaram", "Varma", "Patel", "Malhotra", "Iyer", "Raja", "Nambiar",
    "Sen", "Deshmukh", "Nair", "Krishnan", "Pillai", "Ranganathan", "Menon", "Suresh", "Balaji", "Ramachandran",
    "Reddy", "Choudhury", "Bose", "Gowda", "Bhat", "Kulkarni", "Joshi", "Mishra", "Pandey", "Chatterjee",
    "Venkatesh", "Shetty", "Hebbar", "Naidu", "Sethi", "Mukherjee", "Banerjee", "Das", "Dutta", "Roy",
    "Gupta", "Agarwal", "Saxena", "Srivastava", "Verma", "Tiwari", "Dubey", "Shukla", "Tripathi", "Chauhan"
  ];

  const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-"];

  const courseCatalog = {
    "CSE AIML": [
      { code: "AI301", title: "Machine Learning & Deep Neural Nets", credits: 4, faculty: "Dr. Arvind Rao" },
      { code: "CS302", title: "Design & Analysis of Algorithms", credits: 4, faculty: "Prof. Sundar C" },
      { code: "CS303", title: "Database Systems & Data Modeling", credits: 3, faculty: "Dr. Geetha K" },
      { code: "AI302", title: "Natural Language Processing (NLP)", credits: 3, faculty: "Dr. Preeti V" },
      { code: "HS301", title: "Universal Human Values & Ethics", credits: 2, faculty: "Prof. Anitha M" }
    ],
    "CSBS": [
      { code: "CB301", title: "Business Analytics & Financial Models", credits: 4, faculty: "Prof. Meenakshi S" },
      { code: "CS302", title: "Design & Analysis of Algorithms", credits: 4, faculty: "Prof. Sundar C" },
      { code: "CB302", title: "Modern Marketing Technology & CRM", credits: 3, faculty: "Prof. Ramesh N" },
      { code: "CS303", title: "Database Systems & Data Modeling", credits: 3, faculty: "Dr. Geetha K" },
      { code: "HS301", title: "Universal Human Values & Ethics", credits: 2, faculty: "Prof. Anitha M" }
    ],
    "CSE Core": [
      { code: "CS301", title: "Compiler Design & Automata Theory", credits: 4, faculty: "Dr. Rajesh Gupta" },
      { code: "CS302", title: "Design & Analysis of Algorithms", credits: 4, faculty: "Prof. Sundar C" },
      { code: "CS303", title: "Operating Systems Architecture", credits: 4, faculty: "Dr. K. Raman" },
      { code: "CS304", title: "Computer Networks & Protocols", credits: 3, faculty: "Prof. Suresh Nair" },
      { code: "HS301", title: "Universal Human Values & Ethics", credits: 2, faculty: "Prof. Anitha M" }
    ],
    "IT": [
      { code: "IT301", title: "Full Stack Web Engineering & Cloud", credits: 4, faculty: "Prof. Suresh Nair" },
      { code: "IT302", title: "Information Security & Cryptography", credits: 4, faculty: "Dr. Ananya B" },
      { code: "CS303", title: "Database Systems & Data Modeling", credits: 3, faculty: "Dr. Geetha K" },
      { code: "IT303", title: "Cloud Microservices & DevOps", credits: 3, faculty: "Prof. Vikram S" },
      { code: "HS301", title: "Universal Human Values & Ethics", credits: 2, faculty: "Prof. Anitha M" }
    ],
    "ECE": [
      { code: "EC301", title: "VLSI Design & Digital Verification", credits: 4, faculty: "Dr. Geetha K" },
      { code: "EC302", title: "Digital Signal Processing (DSP)", credits: 4, faculty: "Dr. Mohan R" },
      { code: "EC303", title: "Embedded Systems & ARM Architecture", credits: 3, faculty: "Prof. Divya N" },
      { code: "EC304", title: "Wireless Communication & 5G", credits: 3, faculty: "Dr. S. Rao" },
      { code: "HS301", title: "Universal Human Values & Ethics", credits: 2, faculty: "Prof. Anitha M" }
    ]
  };

  const list = [];
  for (let i = 1; i <= 100; i++) {
    const deptIdx = Math.floor((i - 1) / 20);
    const dept = depts[deptIdx];
    const fName = firstNames[i - 1];
    const lName = lastNames[(i * 3 + 7) % lastNames.length];
    const fullName = `${fName} ${lName}`;
    const rollNo = `2024${dept.prefix}${String(i).padStart(3, '0')}`;
    const regNo = `REG2024${7800 + i}`;
    const yearIdx = ((i % 4) || 4) - 1;
    const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    const sems = ["Sem 2", "Sem 4", "Sem 6", "Sem 8"];
    const year = years[yearIdx];
    const sem = sems[yearIdx];
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@campus.edu`;
    const phone = `+91 98401 ${String(10000 + (i * 739) % 90000)}`;

    const marks = Math.round((55 + ((i * 17) % 41) + ((i % 6 === 0) ? -15 : 0)) * 10) / 10;
    const attendance = Math.round((62 + ((i * 19) % 36) + ((i % 8 === 0) ? -16 : 0)) * 10) / 10;
    const prevMarks = Math.round((marks + (((i % 3) - 1) * 3)) * 10) / 10;
    const cgpa = Math.round(Math.max(4.2, Math.min(9.85, (marks / 10) + (((i % 5) - 2) * 0.12))) * 100) / 100;
    const backlogs = (cgpa < 5.5 || marks < 50 || attendance < 65) ? ((i % 3) + 1) : 0;
    const placement = Math.round(Math.max(35, Math.min(98, marks * 0.9 + ((i * 7) % 15))));
    const skills = Math.round(Math.max(40, Math.min(96, placement * 0.95 + ((i * 11) % 10))));
    const feedback = Math.round(Math.max(55, Math.min(98, 70 + ((i * 13) % 28))));
    const lms = Math.round(Math.max(25, Math.min(145, 45 + ((i * 23) % 95))));
    const assign = Math.round(Math.max(50, Math.min(100, attendance * 0.95 + ((i * 3) % 10))));

    const feeStatus = (i % 10 === 0) ? "Overdue" : ((i % 5 === 0) ? "Pending" : "Paid");
    const feeAmount = 85000;
    const feePaid = feeStatus === "Paid" ? 85000 : (feeStatus === "Pending" ? 42500 : 0);

    const baseCourses = courseCatalog[dept.name] || courseCatalog["CSE AIML"];
    const courses = baseCourses.map((c, cIdx) => {
      const cAtt = Math.min(100, Math.max(50, Math.round(attendance + ((cIdx - 2) * 3))));
      const cMarks = Math.min(100, Math.max(40, Math.round(marks + ((cIdx - 2) * 4))));
      const grade = cMarks >= 90 ? "O" : (cMarks >= 80 ? "A+" : (cMarks >= 70 ? "A" : (cMarks >= 60 ? "B+" : (cMarks >= 50 ? "B" : "RA"))));
      return {
        code: c.code,
        title: c.title,
        credits: c.credits,
        faculty: c.faculty,
        attendance_pct: cAtt,
        classes_attended: Math.round(cAtt * 0.45),
        total_classes: 45,
        syllabus_pct: Math.min(100, 70 + (cIdx * 6) + (i % 5)),
        internal_marks: cMarks,
        grade: grade
      };
    });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const slots = [
      { time: "09:00 - 10:00", type: "Lecture" },
      { time: "10:00 - 11:00", type: "Lecture" },
      { time: "11:15 - 12:15", type: "Tutorial" },
      { time: "13:15 - 14:15", type: "Lab / Practical" },
      { time: "14:15 - 15:15", type: "Seminar / Library" }
    ];

    const timetable = days.map((day, dIdx) => ({
      day: day,
      periods: slots.map((slot, sIdx) => {
        const course = courses[(dIdx + sIdx) % courses.length];
        return {
          time: slot.time,
          code: course.code,
          title: course.title,
          room: sIdx === 3 ? "Specialized Lab 2" : `Hall ${201 + (dIdx * 2)}`,
          faculty: course.faculty,
          type: slot.type
        };
      })
    }));

    const semNum = (yearIdx + 1) * 2;
    const semesterResults = [];
    for (let s = 1; s <= semNum; s++) {
      const sSgpa = Math.round(Math.max(4.5, Math.min(9.9, cgpa + (((s * 7 + i) % 7) - 3) * 0.15)) * 100) / 100;
      semesterResults.push({
        semester: `Semester ${s}`,
        sgpa: sSgpa,
        credits_earned: s === semNum ? 18 : 22,
        status: sSgpa >= 5.0 ? "Passed" : "Arrear"
      });
    }

    const assignments = [
      {
        id: `ASG-${i}-1`,
        course: courses[0].code,
        title: "Programming Assignment 3: Optimal Graph & Tree Search",
        due_date: "Nov 08, 2026",
        status: "Submitted",
        score: "19 / 20"
      },
      {
        id: `ASG-${i}-2`,
        course: courses[1].code,
        title: "Case Analysis: Scalable Microservice Architecture",
        due_date: "Nov 15, 2026",
        status: "Graded",
        score: "23 / 25"
      },
      {
        id: `ASG-${i}-3`,
        course: courses[2].code,
        title: "Lab Practical Report: SQL Optimization & Indexing",
        due_date: "Nov 22, 2026",
        status: "Pending",
        score: "-- / 20"
      },
      {
        id: `ASG-${i}-4`,
        course: courses[3].code,
        title: "Term Paper: Industry Standards in Cyber Security",
        due_date: "Nov 29, 2026",
        status: "Pending",
        score: "-- / 15"
      }
    ];

    list.push({
      id: i,
      roll_no: rollNo,
      reg_no: regNo,
      name: fullName,
      department: dept.name,
      year: year,
      semester: sem,
      section: (i % 2 === 0) ? "A" : "B",
      email: email,
      phone: phone,
      blood_group: bloodGroups[i % bloodGroups.length],
      address: "Campus Residential / Chennai, India",
      mentor_name: dept.mentor,
      guardian_name: `${lName} Senior`,
      guardian_phone: `+91 94440 ${String(20000 + (i * 487) % 70000)}`,
      cgpa: cgpa,
      marks: marks,
      previous_marks: prevMarks,
      attendance: attendance,
      assignment_completion: assign,
      lms_logins: lms,
      engagement_score: Math.round((attendance + assign) / 2),
      placement_score: placement,
      skills_score: skills,
      feedback_score: feedback,
      backlogs: backlogs,
      fee_status: feeStatus,
      fee_amount: feeAmount,
      fee_paid: feePaid,
      fee_due: feeAmount - feePaid,
      fee_due_date: "15 Nov 2026",
      fee_receipt_no: `REC-2024-${1000 + i}`,
      courses: courses,
      timetable: timetable,
      semester_results: semesterResults,
      assignments: assignments
    });
  }

  return list;
}

const DEFAULT_DEMO_STUDENTS = build100CamuStudentRecords();

// ---------------- AI ANALYTICS ENGINE (STANDALONE & CLIENT-SIDE) ----------------

function analyzeStudentClient(s) {
  const marks = Number(s.marks || 0);
  const prevMarks = Number(s.previous_marks || 0);
  const attendance = Number(s.attendance || 0);
  const assign = Number(s.assignment_completion || 0);
  const lms = Number(s.lms_logins || 0);
  const eng = Number(s.engagement_score || 0);
  const placement = Number(s.placement_score || 0);
  const skills = Number(s.skills_score || 0);
  const feedback = Number(s.feedback_score || 0);
  const backlogs = parseInt(s.backlogs || 0, 10);

  const academicIndex = (marks * 0.25) + (prevMarks * 0.10);
  const attendanceIndex = attendance * 0.20;
  const engagementIndex = (assign * 0.10) + (Math.min(lms, 100) * 0.05);
  const careerIndex = (placement * 0.10) + (skills * 0.05);
  const softskillsIndex = (eng * 0.08) + (feedback * 0.07);

  const rawScore = academicIndex + attendanceIndex + engagementIndex + careerIndex + softskillsIndex;
  const backlogPenalty = backlogs * 5.0;
  const finalScore = Math.round(Math.max(0, Math.min(100, rawScore - backlogPenalty)) * 10) / 10;

  const markDelta = Math.round((marks - prevMarks) * 10) / 10;
  const projectedFinalMarks = Math.round(Math.max(0, Math.min(100, marks + (markDelta * 0.4))) * 10) / 10;

  const placementChance = Math.round(Math.max(5, Math.min(98, (
    placement * 0.45 + skills * 0.35 + (marks * 0.20) - (backlogs * 12)
  ))) * 10) / 10;

  const warningFlags = [];
  const reasons = [];
  const recommendations = [];

  if (attendance < 65) {
    warningFlags.push({ type: "critical", label: "Severe Attendance Shortage (<65%)" });
    reasons.push(`Attendance is critically low at ${attendance}%, risking exam debarment`);
    recommendations.push("Immediate attendance recovery contract and mandatory daily check-ins");
  } else if (attendance < 75) {
    warningFlags.push({ type: "warning", label: "Attendance Below 75%" });
    reasons.push(`Attendance (${attendance}%) is under the university mandatory 75% cutoff`);
    recommendations.push("Counsel student on class engagement and track weekly attendance");
  }

  if (marks < 50) {
    warningFlags.push({ type: "critical", label: "Failing / High Academic Distress (<50)" });
    reasons.push(`Latest examination score (${marks}/100) indicates acute learning gaps`);
    recommendations.push("Assign peer tutor, provide remedial question banks, and schedule faculty doubt clearing");
  } else if (marks < 60) {
    warningFlags.push({ type: "warning", label: "Marginal Exam Score (<60)" });
    reasons.push(`Marks (${marks}/100) are near the pass border`);
    recommendations.push("Conduct topic-wise revision and monitor next internal assessment");
  }

  if (markDelta <= -8) {
    warningFlags.push({ type: "critical", label: `Sharp Score Drop (${markDelta} pts)` });
    reasons.push(`Performance plunged by ${Math.abs(markDelta)} marks compared to prior assessment`);
    recommendations.push("Conduct 1-on-1 mentor intervention to identify personal or conceptual roadblocks");
  } else if (markDelta < -3) {
    warningFlags.push({ type: "warning", label: `Declining Marks Trend (${markDelta} pts)` });
    reasons.push(`Gradual decline of ${Math.abs(markDelta)} marks observed`);
    recommendations.push("Review mid-term test papers and reinforce weak topics");
  }

  if (backlogs > 0) {
    const severity = backlogs >= 2 ? "critical" : "warning";
    warningFlags.push({ type: severity, label: `${backlogs} Active Backlog(s)` });
    reasons.push(`${backlogs} uncleared backlog subject(s) hindering semester progression`);
    recommendations.push(`Formulate a structured ${backlogs}-subject backlog clearance roadmap before finals`);
  }

  if (assign < 70) {
    warningFlags.push({ type: "warning", label: "Low Assignment Completion (<70%)" });
    reasons.push(`Assignment submission rate is ${assign}%, reflecting lagging coursework homework`);
    recommendations.push("Break pending submissions into bite-sized milestones with weekly deadlines");
  }

  if (placement < 50) {
    warningFlags.push({ type: "warning", label: "Placement Readiness Deficit (<50)" });
    reasons.push(`Placement score (${placement}/100) indicates lack of interview and aptitude preparation`);
    recommendations.push("Enroll in technical coding bootcamp and aptitude problem-solving series");
  }

  if (lms < 40) {
    warningFlags.push({ type: "warning", label: "Low Digital Platform Activity" });
    reasons.push(`LMS logins (${parseInt(lms, 10)} total) show minimal usage of online course resources`);
    recommendations.push("Mandate completion of asynchronous LMS modules and quiz checks");
  }

  let status = "On track";
  let statusColor = "green";
  let riskBadge = "Low Risk";

  if (finalScore < 55 || backlogs >= 2 || (attendance < 65 && marks < 60)) {
    status = "Needs support";
    statusColor = "red";
    riskBadge = "High Risk";
  } else if (finalScore < 75 || warningFlags.length >= 1) {
    status = "Monitor";
    statusColor = "orange";
    riskBadge = "Moderate Risk";
  }

  if (!reasons.length) {
    reasons.push("Exemplary academic trajectory and consistent behavioral engagement");
    recommendations.push("Encourage participation in advanced honors projects, research, and hackathons");
    recommendations.push("Maintain high-performance momentum and peer mentoring activities");
  }

  const radarData = {
    Academics: marks,
    Attendance: attendance,
    Assignments: assign,
    Engagement: eng,
    Placement: placement,
    "Tech Skills": skills
  };

  const studentName = s.name || "Student";
  const facultyNote = `Automated AI Advisory for ${studentName}: Current Success Index is ${finalScore}/100 (${status}). Primary concern: ${reasons[0]}. Immediate suggested action: ${recommendations[0]}.`;

  const cgpaVal = Number(s.cgpa || (marks / 10.0)).toFixed(2);
  const categories = {
    academic: {
      cgpa: Number(cgpaVal),
      marks: marks,
      previous_marks: prevMarks,
      backlogs: backlogs,
      subjects: s.courses ? s.courses.map(c => ({ name: c.title, score: c.internal_marks, grade: c.grade })) : []
    },
    attendance: {
      overall: attendance,
      is_shortage: attendance < 75,
      is_critical: attendance < 65,
      classes_attended: Math.round(attendance * 0.45 * 2),
      total_classes: 90
    },
    lms: {
      login_frequency: parseInt(lms, 10),
      weekly_streak: Math.round(lms / 6) + 2,
      assignment_completion: assign
    },
    engagement: {
      events_attended: Math.round(eng / 12) + 1,
      clubs: eng >= 75 ? ["Google Developer Student Club", "AI Innovation Society"] : ["Tech & Coding Society"],
      hackathons: eng >= 85 ? 2 : (eng >= 65 ? 1 : 0),
      certifications: skills >= 80 
        ? ["AWS Certified Cloud Practitioner", "LeetCode 100-Day Badge"] 
        : ["HackerRank Python 5-Star", "Coursera Web Dev"]
    },
    placement: {
      aptitude_score: placement,
      coding_score: skills,
      mock_interviews: feedback,
      chance_pct: placementChance,
      tier_eligibility: (Number(cgpaVal) >= 8.0 && backlogs === 0 && placement >= 75)
        ? "Tier-1 Product Companies"
        : (backlogs <= 1 && placement >= 50 ? "Tier-2 Core & IT Services" : "Requires Aptitude Bootcamp")
    },
    skills: {
      score: skills,
      technical: skills,
      soft_skills: feedback,
      assessments: [
        { skill: "Python / Java", score: Math.min(100, Math.round(skills * 1.04)) },
        { skill: "SQL & Data Modeling", score: Math.min(100, Math.round(skills * 0.98)) },
        { skill: "Problem Solving (DSA)", score: Math.min(100, Math.round(skills * 0.92)) },
        { skill: "Communication", score: Math.min(100, Math.round(feedback * 1.02)) },
        { skill: "Teamwork & Adaptability", score: Math.min(100, Math.round(feedback * 0.95)) }
      ]
    },
    feedback: {
      student_satisfaction: Math.round((feedback / 20) * 10) / 10,
      faculty_feedback: facultyNote,
      mentor_remarks: finalScore >= 80 
        ? "Excellent academic consistency and technical initiative." 
        : `Requires structured attention on ${reasons[0].toLowerCase()}.`
    }
  };

  return {
    success_score: finalScore,
    status: status,
    status_color: statusColor,
    risk_badge: riskBadge,
    warning_flags: warningFlags,
    reasons: reasons,
    recommendations: recommendations,
    mark_delta: markDelta,
    projected_final_marks: projectedFinalMarks,
    placement_chance: placementChance,
    radar: radarData,
    faculty_note: facultyNote,
    categories: categories
  };
}

// Ensure CAMU student schema compliance
function ensureCamuStudentFields(s) {
  if (!s.courses || !s.courses.length || !s.timetable || !s.semester_results) {
    const fallbackTemplate = DEFAULT_DEMO_STUDENTS.find(d => d.id === s.id) || DEFAULT_DEMO_STUDENTS[(s.id - 1) % DEFAULT_DEMO_STUDENTS.length];
    if (fallbackTemplate) {
      if (!s.courses) s.courses = JSON.parse(JSON.stringify(fallbackTemplate.courses));
      if (!s.timetable) s.timetable = JSON.parse(JSON.stringify(fallbackTemplate.timetable));
      if (!s.semester_results) s.semester_results = JSON.parse(JSON.stringify(fallbackTemplate.semester_results));
      if (!s.assignments) s.assignments = JSON.parse(JSON.stringify(fallbackTemplate.assignments));
      if (!s.fee_status) s.fee_status = fallbackTemplate.fee_status;
      if (!s.fee_amount) s.fee_amount = fallbackTemplate.fee_amount;
      if (!s.fee_paid) s.fee_paid = fallbackTemplate.fee_paid;
      if (!s.fee_due) s.fee_due = fallbackTemplate.fee_due;
      if (!s.fee_due_date) s.fee_due_date = fallbackTemplate.fee_due_date;
      if (!s.fee_receipt_no) s.fee_receipt_no = fallbackTemplate.fee_receipt_no;
      if (!s.year) s.year = fallbackTemplate.year;
      if (!s.semester) s.semester = fallbackTemplate.semester;
      if (!s.section) s.section = fallbackTemplate.section;
      if (!s.blood_group) s.blood_group = fallbackTemplate.blood_group;
      if (!s.guardian_name) s.guardian_name = fallbackTemplate.guardian_name;
      if (!s.guardian_phone) s.guardian_phone = fallbackTemplate.guardian_phone;
      if (!s.reg_no) s.reg_no = fallbackTemplate.reg_no;
    }
  }
  if (s.cgpa === undefined || s.cgpa === null) {
    s.cgpa = Number((Number(s.marks || 70) / 10).toFixed(2));
  }
}

// ---------------- DATA LAYER (DUAL-ENGINE: API & LOCALSTORAGE) ----------------

async function checkBackendEnvironment() {
  try {
    const res = await fetch("/api/students", { method: "HEAD" });
    if (res.ok) {
      isCloudMode = true;
      updateEnvIndicator(true);
      return;
    }
  } catch (e) {
    // Netlify or offline localhost static
  }
  isCloudMode = false;
  updateEnvIndicator(false);
}

function updateEnvIndicator(isCloud) {
  const dot = $("envStatusDot");
  const text = $("envStatusText");
  const sub = $("envStatusSub");

  if (dot && text && sub) {
    if (isCloud) {
      dot.className = "env-status-dot cloud";
      text.textContent = "CAMU Nimbus Cloud Engine";
      sub.textContent = "SQLite Backend Sync Active";
    } else {
      dot.className = "env-status-dot client";
      text.textContent = "CAMU Standalone Engine";
      sub.textContent = "100-Student LocalStorage Store";
    }
  }
}

async function loadData() {
  if (isCloudMode) {
    try {
      const response = await fetch("/api/students");
      if (response.ok) {
        studentsData = await response.json();
      } else {
        throw new Error("Failed to fetch from Cloud API");
      }
    } catch (e) {
      console.warn("Cloud API fallback to local storage:", e);
      loadLocalData();
    }
  } else {
    loadLocalData();
  }

  // Ensure all 100 students have complete CAMU fields & AI analysis
  studentsData.forEach(s => {
    ensureCamuStudentFields(s);
    if (!s.analysis) s.analysis = analyzeStudentClient(s);
  });

  updateDashboard();
}

function loadLocalData() {
  const stored = localStorage.getItem("nimbus_students_data");
  if (stored) {
    try {
      studentsData = JSON.parse(stored);
      if (!Array.isArray(studentsData) || studentsData.length < 100) {
        studentsData = JSON.parse(JSON.stringify(DEFAULT_DEMO_STUDENTS));
        saveLocalData();
      }
    } catch (e) {
      studentsData = JSON.parse(JSON.stringify(DEFAULT_DEMO_STUDENTS));
      saveLocalData();
    }
  } else {
    studentsData = JSON.parse(JSON.stringify(DEFAULT_DEMO_STUDENTS));
    saveLocalData();
  }

  studentsData.forEach(s => {
    ensureCamuStudentFields(s);
    s.analysis = analyzeStudentClient(s);
  });
}

function saveLocalData() {
  localStorage.setItem("nimbus_students_data", JSON.stringify(studentsData));
}

function resetDemoData() {
  if (confirm("Reset demo data to default 100 fictional CAMU students? Any modifications will be refreshed.")) {
    studentsData = JSON.parse(JSON.stringify(DEFAULT_DEMO_STUDENTS));
    saveLocalData();
    studentsData.forEach(s => {
      s.analysis = analyzeStudentClient(s);
    });
    updateDashboard();
    showToast("Successfully reset to 100 CAMU student records", "success");
  }
}

// ---------------- DASHBOARD CALCULATIONS & STATS ----------------

function updateDashboard() {
  const path = (window.location.pathname || "").toLowerCase();
  if (path.includes("login")) return;

  studentsData.forEach(s => {
    ensureCamuStudentFields(s);
    if (!s.analysis) s.analysis = analyzeStudentClient(s);
  });

  const total = studentsData.length;
  if (total === 0) {
    if ($("kpiTotal")) $("kpiTotal").textContent = "0";
    if ($("kpiAvgMarks")) $("kpiAvgMarks").textContent = "0";
    if ($("kpiAvgAtt")) $("kpiAvgAtt").textContent = "0%";
    if ($("kpiCritical")) $("kpiCritical").textContent = "0";
    if ($("kpiPlacement")) $("kpiPlacement").textContent = "0%";
    renderTable();
    return;
  }

  const avgMarks = (studentsData.reduce((acc, s) => acc + Number(s.marks), 0) / total).toFixed(1);
  const avgAtt = (studentsData.reduce((acc, s) => acc + Number(s.attendance), 0) / total).toFixed(1);
  const criticalCount = studentsData.filter(s => s.analysis && s.analysis.status === "Needs support").length;
  const placementReady = studentsData.filter(s => s.analysis && s.analysis.placement_chance >= 70).length;
  const placementPct = Math.round((placementReady / total) * 100);

  // Update KPI counters safely
  if ($("kpiTotal")) $("kpiTotal").textContent = total;
  if ($("kpiAvgMarks")) $("kpiAvgMarks").textContent = avgMarks;
  if ($("kpiAvgAtt")) $("kpiAvgAtt").textContent = `${avgAtt}%`;
  if ($("kpiCritical")) $("kpiCritical").textContent = criticalCount;
  if ($("kpiPlacement")) $("kpiPlacement").textContent = `${placementPct}%`;

  // Render components safely
  renderCharts();
  renderAlerts();
  renderTable();
  populateSimulatorDropdown();
}

// ---------------- CHART VISUALIZATIONS ----------------

function renderCharts() {
  if (typeof Chart === "undefined") return;

  // 1. Academic Trajectory Chart (Bar Chart)
  const trajectoryCtx = $("trajectoryChart");
  if (trajectoryCtx) {
    if (trajectoryChart) trajectoryChart.destroy();

    const sample = studentsData.slice(0, 10);
    const labels = sample.map(s => s.name.split(" ")[0]);
    const currentMarks = sample.map(s => s.marks);
    const prevMarks = sample.map(s => s.previous_marks);

    trajectoryChart = new Chart(trajectoryCtx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Midterm Score",
            data: prevMarks,
            backgroundColor: "rgba(148, 163, 184, 0.5)",
            borderColor: "rgba(148, 163, 184, 0.8)",
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: "Current Examination Score",
            data: currentMarks,
            backgroundColor: "rgba(99, 102, 241, 0.85)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#94a3b8", font: { family: "Outfit" } } },
          tooltip: {
            callbacks: {
              afterBody: (context) => {
                const idx = context[0].dataIndex;
                const s = sample[idx];
                const delta = (s.marks - s.previous_marks).toFixed(1);
                const deltaSign = delta >= 0 ? "+" : "";
                return `Delta: ${deltaSign}${delta} pts (${s.department})`;
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { family: "Outfit" } } },
          y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" }, min: 0, max: 100 }
        }
      }
    });
  }

  // 2. Risk Distribution Chart (Doughnut)
  const riskCtx = $("riskChart");
  if (riskCtx) {
    if (riskChart) riskChart.destroy();

    const highRisk = studentsData.filter(s => s.analysis.status === "Needs support").length;
    const moderateRisk = studentsData.filter(s => s.analysis.status === "Monitor").length;
    const onTrack = studentsData.filter(s => s.analysis.status === "On track").length;

    riskChart = new Chart(riskCtx, {
      type: "doughnut",
      data: {
        labels: ["High Risk (Intervention)", "Moderate Risk (Watch)", "On Track (Optimal)"],
        datasets: [{
          data: [highRisk, moderateRisk, onTrack],
          backgroundColor: ["#f43f5e", "#f59e0b", "#10b981"],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#94a3b8", font: { family: "Outfit", size: 11 }, padding: 12 } }
        }
      }
    });
  }

  // 3. Department Comparison Chart (Grouped Bar)
  const deptCtx = $("deptChart");
  if (deptCtx) {
    if (deptChart) deptChart.destroy();

    const depts = ["CSE AIML", "CSBS", "CSE Core", "IT", "ECE"];
    const deptStats = depts.map(d => {
      const cohort = studentsData.filter(s => s.department === d);
      if (!cohort.length) return { marks: 0, att: 0 };
      const avgM = cohort.reduce((acc, s) => acc + s.marks, 0) / cohort.length;
      const avgA = cohort.reduce((acc, s) => acc + s.attendance, 0) / cohort.length;
      return { marks: Number(avgM.toFixed(1)), att: Number(avgA.toFixed(1)) };
    });

    deptChart = new Chart(deptCtx, {
      type: "bar",
      data: {
        labels: depts,
        datasets: [
          {
            label: "Avg Marks",
            data: deptStats.map(s => s.marks),
            backgroundColor: "#06b6d4",
            borderRadius: 4
          },
          {
            label: "Avg Attendance %",
            data: deptStats.map(s => s.att),
            backgroundColor: "#8b5cf6",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#94a3b8", font: { family: "Outfit" } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 10 } } },
          y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94a3b8" }, min: 0, max: 100 }
        }
      }
    });
  }
}

// ---------------- AI EARLY WARNING CENTER ALERTS ----------------

function renderAlerts() {
  const container = $("alertsList");
  if (!container) return;

  const urgentStudents = studentsData.filter(s => s.analysis.status === "Needs support" || s.attendance < 65 || (s.marks - s.previous_marks) <= -8);

  if (urgentStudents.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px">
        <div style="font-size:24px;margin-bottom:6px">✓</div>
        No high-priority warnings detected across the student body.
      </div>
    `;
    return;
  }

  container.innerHTML = urgentStudents.slice(0, 5).map(s => {
    const a = s.analysis;
    const delta = (s.marks - s.previous_marks).toFixed(1);
    const reasonText = a.warning_flags.length ? a.warning_flags[0].label : a.reasons[0];
    const recText = a.recommendations[0] || "Review academic plan";

    return `
      <div class="alert-item critical" onclick="openStudentDrawer(${s.id})">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <div class="alert-title">
            <span>${escapeHtml(s.name)} · <b>${escapeHtml(s.department)}</b></span>
            <span class="status-badge red">Score: ${a.success_score}</span>
          </div>
          <div class="alert-desc">${escapeHtml(reasonText)}. Midterm delta: <b>${delta} pts</b>. Att: <b>${s.attendance}%</b>.</div>
          <div class="alert-action">Recommended Action: ${escapeHtml(recText)}</div>
        </div>
      </div>
    `;
  }).join("");
}

// ---------------- TABLE RENDERING, FILTERING & PAGINATION (100 STUDENTS) ----------------

function renderTable() {
  const tbody = $("studentTableBody");
  if (!tbody) return;

  let filtered = [...studentsData];

  // Department filter
  if (currentDepartmentFilter !== "All") {
    filtered = filtered.filter(s => s.department === currentDepartmentFilter);
  }

  // Year filter
  if (currentYearFilter !== "All") {
    filtered = filtered.filter(s => s.year === currentYearFilter);
  }

  // Status filter
  if (currentStatusFilter !== "All") {
    filtered = filtered.filter(s => s.analysis.status === currentStatusFilter);
  }

  // Search query (search name, department, roll_no, reg_no, email)
  if (currentSearchQuery.trim()) {
    const q = currentSearchQuery.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      (s.roll_no && s.roll_no.toLowerCase().includes(q)) ||
      (s.reg_no && s.reg_no.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (currentSort === "cgpa") {
    filtered.sort((a, b) => Number(b.cgpa || 0) - Number(a.cgpa || 0));
  } else if (currentSort === "marks") {
    filtered.sort((a, b) => b.marks - a.marks);
  } else if (currentSort === "attendance") {
    filtered.sort((a, b) => b.attendance - a.attendance);
  } else if (currentSort === "score") {
    filtered.sort((a, b) => b.analysis.success_score - a.analysis.success_score);
  } else if (currentSort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  if (currentPage > totalPages) currentPage = 1;

  // Pagination slice
  const startIndex = (currentPage - 1) * pageSize;
  const pageSlice = filtered.slice(startIndex, startIndex + pageSize);

  if (totalFiltered === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center;padding:36px;color:var(--text-muted)">
          No matching student records found. Try adjusting your filters or search terms.
        </td>
      </tr>
    `;
    renderPaginationControls(0, 1);
    return;
  }

  tbody.innerHTML = pageSlice.map(s => {
    const initials = s.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const attFillClass = s.attendance >= 75 ? "green" : s.attendance >= 65 ? "amber" : "red";
    const marksFillClass = s.marks >= 70 ? "purple" : s.marks >= 50 ? "amber" : "red";
    const statusColor = s.analysis.status_color;

    const feeBadgeClass = s.fee_status === "Paid" ? "fee-badge-paid" : (s.fee_status === "Pending" ? "fee-badge-pending" : "fee-badge-overdue");

    return `
      <tr>
        <td>
          <div class="student-cell">
            <div class="avatar">${initials}</div>
            <div class="student-meta">
              <b style="cursor:pointer;color:var(--accent-purple-light)" onclick="openStudentDrawer(${s.id})">${escapeHtml(s.name)}</b>
              <span>${escapeHtml(s.roll_no || `ST-${s.id}`)}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="dept-badge">${escapeHtml(s.department)}</span>
        </td>
        <td>
          <span style="font-size:11px;color:var(--text-secondary)">${escapeHtml(s.year || '1st Year')}</span>
        </td>
        <td>
          <b style="color:var(--accent-purple-light);font-family:var(--font-heading);font-size:13px">${(s.cgpa || (s.marks/10)).toFixed(2)}</b>
          <small style="font-size:10px;color:var(--text-muted)">/10</small>
        </td>
        <td>
          <div class="progress-bar-container">
            <b style="color:${s.attendance >= 75 ? 'var(--color-green)' : 'var(--color-rose)'}">${s.attendance}%</b>
            <div class="progress-bar-track">
              <div class="progress-bar-fill ${attFillClass}" style="width:${s.attendance}%"></div>
            </div>
          </div>
        </td>
        <td>
          <div class="progress-bar-container">
            <b>${s.marks}/100</b>
            <div class="progress-bar-track">
              <div class="progress-bar-fill ${marksFillClass}" style="width:${s.marks}%"></div>
            </div>
          </div>
        </td>
        <td>
          ${s.backlogs > 0 
            ? `<span style="color:var(--color-rose);font-weight:700">⚠️ ${s.backlogs}</span>`
            : `<span style="color:var(--color-green)">0</span>`}
        </td>
        <td>
          <span class="${feeBadgeClass}">${s.fee_status}</span>
        </td>
        <td>
          <span class="status-badge ${statusColor}">
            ${s.analysis.success_score} · ${escapeHtml(s.analysis.status)}
          </span>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-table" onclick="openStudentDrawer(${s.id})" title="View 360 Diagnostic Profile">
              👁 View
            </button>
            <button class="btn-table" onclick="loadStudentIntoSimulator(${s.id})" title="What-If Simulator">
              ⚡ Sim
            </button>
            <button class="btn-table" onclick="openEditModal(${s.id})" title="Edit Student">
              ✏️
            </button>
            <button class="btn-table" onclick="deleteStudent(${s.id})" title="Delete Student" style="color:var(--color-rose)">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  renderPaginationControls(totalFiltered, totalPages);
}

function renderPaginationControls(totalFiltered, totalPages) {
  let container = $("adminPagination");
  if (!container) {
    const tablePanel = document.querySelector(".table-responsive");
    if (tablePanel) {
      container = document.createElement("div");
      container.id = "adminPagination";
      container.className = "camu-pagination";
      tablePanel.after(container);
    }
  }
  if (!container) return;

  if (totalFiltered === 0) {
    container.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalFiltered);

  let pageBtnsHtml = "";
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
      pageBtnsHtml += `<button class="btn-page ${p === currentPage ? 'active' : ''}" onclick="changeAdminPage(${p})">${p}</button>`;
    } else if (p === currentPage - 3 || p === currentPage + 3) {
      pageBtnsHtml += `<span style="color:var(--text-muted);font-size:11px">...</span>`;
    }
  }

  container.innerHTML = `
    <div style="font-size:12px;color:var(--text-secondary)">
      Showing <b>${start} - ${end}</b> of <b>${totalFiltered}</b> students
    </div>
    <div class="camu-page-btns">
      <button class="btn-page" onclick="changeAdminPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>&larr; Prev</button>
      ${pageBtnsHtml}
      <button class="btn-page" onclick="changeAdminPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>Next &rarr;</button>
    </div>
  `;
}

function changeAdminPage(newPage) {
  currentPage = newPage;
  renderTable();
  const dirEl = $("adminDirectory");
  if (dirEl) dirEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------------- WHAT-IF POLICY SIMULATOR ----------------

function populateSimulatorDropdown() {
  const sel = $("simStudentSelect");
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Choose Student to Simulate --</option>` +
    studentsData.map(s => `<option value="${s.id}">${escapeHtml(s.roll_no || `ST-${s.id}`)} - ${escapeHtml(s.name)} (${s.department})</option>`).join("");

  if (selectedStudentId) {
    sel.value = selectedStudentId;
    loadStudentIntoSimulator(selectedStudentId);
  }
}

function loadStudentIntoSimulator(studentId) {
  const s = studentsData.find(item => item.id === Number(studentId));
  if (!s) return;

  selectedStudentId = s.id;
  const sel = $("simStudentSelect");
  if (sel) sel.value = s.id;

  if ($("sliderAtt")) $("sliderAtt").value = s.attendance;
  if ($("valAtt")) $("valAtt").textContent = `${s.attendance}%`;

  if ($("sliderMarks")) $("sliderMarks").value = s.marks;
  if ($("valMarks")) $("valMarks").textContent = s.marks;

  if ($("sliderAssign")) $("sliderAssign").value = s.assignment_completion;
  if ($("valAssign")) $("valAssign").textContent = `${s.assignment_completion}%`;

  if ($("sliderLms")) $("sliderLms").value = s.lms_logins;
  if ($("valLms")) $("valLms").textContent = s.lms_logins;

  if ($("sliderPlacement")) $("sliderPlacement").value = s.placement_score;
  if ($("valPlacement")) $("valPlacement").textContent = s.placement_score;

  if ($("sliderBacklogs")) $("sliderBacklogs").value = s.backlogs;
  if ($("valBacklogs")) $("valBacklogs").textContent = s.backlogs;

  runSimulation();
}

function runSimulation() {
  const s = studentsData.find(item => item.id === Number(selectedStudentId)) || studentsData[0];
  if (!s) return;

  const simObj = {
    ...s,
    attendance: Number($("sliderAtt") ? $("sliderAtt").value : s.attendance),
    marks: Number($("sliderMarks") ? $("sliderMarks").value : s.marks),
    previous_marks: s.previous_marks,
    assignment_completion: Number($("sliderAssign") ? $("sliderAssign").value : s.assignment_completion),
    lms_logins: Number($("sliderLms") ? $("sliderLms").value : s.lms_logins),
    placement_score: Number($("sliderPlacement") ? $("sliderPlacement").value : s.placement_score),
    skills_score: s.skills_score,
    feedback_score: s.feedback_score,
    backlogs: Number($("sliderBacklogs") ? $("sliderBacklogs").value : s.backlogs)
  };

  const simAnalysis = analyzeStudentClient(simObj);
  const origScore = s.analysis ? s.analysis.success_score : simAnalysis.success_score;
  const scoreDiff = (simAnalysis.success_score - origScore).toFixed(1);
  const diffSign = scoreDiff >= 0 ? "+" : "";

  if ($("simScore")) $("simScore").textContent = simAnalysis.success_score;
  if ($("simStatus")) {
    $("simStatus").textContent = simAnalysis.status;
    $("simStatus").className = `status-badge ${simAnalysis.status_color}`;
  }
  if ($("simDeltaScore")) {
    $("simDeltaScore").textContent = `${diffSign}${scoreDiff} pts`;
    $("simDeltaScore").style.color = scoreDiff >= 0 ? "var(--color-green)" : "var(--color-rose)";
  }
  if ($("simProjMarks")) $("simProjMarks").textContent = `${simAnalysis.projected_final_marks}/100`;
  if ($("simPlacementChance")) $("simPlacementChance").textContent = `${simAnalysis.placement_chance}%`;

  if ($("simAdvisory")) {
    $("simAdvisory").textContent = simAnalysis.faculty_note;
  }
}

// ---------------- STUDENT 360° DRAWER / PROFILE MODAL (CAMU ACCREDITED) ----------------

function openStudentDrawer(studentId) {
  const student = studentsData.find(s => s.id === Number(studentId));
  if (!student) return;

  ensureCamuStudentFields(student);
  const a = student.analysis || analyzeStudentClient(student);
  const cgpaVal = (student.cgpa || (student.marks / 10)).toFixed(2);
  const initials = student.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  if ($("drawerName")) $("drawerName").textContent = student.name;
  if ($("drawerRoll")) $("drawerRoll").textContent = `${student.roll_no} · ${student.reg_no}`;
  if ($("drawerDept")) $("drawerDept").textContent = `${student.department} · ${student.year} (${student.semester})`;
  if ($("drawerMentor")) $("drawerMentor").textContent = `Faculty Mentor: ${student.mentor_name || 'Dr. Arvind Rao'}`;
  if ($("drawerInitials")) $("drawerInitials").textContent = initials;

  if ($("drawerScore")) $("drawerScore").textContent = a.success_score;
  if ($("drawerStatus")) {
    $("drawerStatus").textContent = a.status;
    $("drawerStatus").className = `status-badge ${a.status_color}`;
  }

  const container = $("drawer7CategoriesContainer") || $("drawerDetailsWrapper");
  const delta = (student.marks - student.previous_marks).toFixed(1);
  const deltaSign = delta >= 0 ? "+" : "";
  const isAttCompliant = student.attendance >= 75;

  const coursesList = student.courses || [];
  const certs = student.skills_score >= 80 
    ? ["AWS Certified Cloud Practitioner", "LeetCode 100-Day Streak", "DeepLearning.AI Spec"]
    : ["HackerRank Python 5-Star", "Coursera Web Dev Essentials"];

  const feeBadgeClass = student.fee_status === "Paid" ? "fee-badge-paid" : (student.fee_status === "Pending" ? "fee-badge-pending" : "fee-badge-overdue");

  if (container) {
    container.innerHTML = `
      <!-- CAMU Student Biodata Header Card -->
      <div style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);margin-bottom:14px;border:1px solid var(--border-subtle);display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px">
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">University Reg No</small><b style="display:block;font-size:13px">${student.reg_no}</b></div>
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Roll Number</small><b style="display:block;font-size:13px">${student.roll_no}</b></div>
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Academic Program</small><b style="display:block;font-size:13px">${student.department}</b></div>
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Class & Section</small><b style="display:block;font-size:13px">${student.year}, Section ${student.section}</b></div>
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Official Email</small><b style="display:block;font-size:12px;color:var(--accent-cyan)">${student.email}</b></div>
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Contact Phone</small><b style="display:block;font-size:12px">${student.phone}</b></div>
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Blood Group</small><b style="display:block;font-size:12px">${student.blood_group}</b></div>
        <div><small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Fee Ledger Status</small><b style="display:block"><span class="${feeBadgeClass}">${student.fee_status} (Due: ₹${student.fee_due.toLocaleString()})</span></b></div>
      </div>

      <!-- Category 1 · Academic -->
      <div class="drawer-cat-block" style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);margin-bottom:14px;border-left:4px solid var(--accent-purple)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span class="cat-tag cat-academic">Category 1 · Academic & CGPA Progression</span>
          <span class="badge-pill" style="color:${student.backlogs > 0 ? 'var(--color-rose)' : 'var(--color-green)'}">
            ${student.backlogs > 0 ? `⚠️ ${student.backlogs} Backlog(s)` : `✓ 0 Backlogs Cleared`}
          </span>
        </div>
        <div class="profile-stats-grid" style="margin-bottom:10px">
          <div class="profile-stat-box"><small>Cumulative CGPA</small><b style="color:var(--accent-purple-light);font-size:20px">${cgpaVal} / 10.0</b></div>
          <div class="profile-stat-box"><small>Exam Marks</small><b>${student.marks} / 100</b></div>
          <div class="profile-stat-box"><small>Midterm Delta</small><b style="color:${delta >= 0 ? 'var(--color-green)' : 'var(--color-rose)'}">${deltaSign}${delta} pts</b></div>
          <div class="profile-stat-box"><small>Active Backlogs</small><b style="color:${student.backlogs > 0 ? 'var(--color-rose)' : 'var(--color-green)'}">${student.backlogs}</b></div>
        </div>
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px">Enrolled Courses & Internal Marks:</div>
        <div style="display:grid;gap:6px">
          ${coursesList.map(c => `
            <div>
              <div class="sub-progress-row">
                <span><b>${c.code}</b>: ${c.title} <small style="color:var(--accent-cyan);font-weight:700">[Grade: ${c.grade}]</small></span>
                <b>${c.internal_marks}/100</b>
              </div>
              <div class="progress-bar-track" style="width:100%">
                <div class="progress-bar-fill ${c.internal_marks >= 75 ? 'purple' : c.internal_marks >= 50 ? 'amber' : 'red'}" style="width:${c.internal_marks}%"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Category 2 · Attendance -->
      <div class="drawer-cat-block" style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);margin-bottom:14px;border-left:4px solid var(--color-green)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span class="cat-tag cat-attendance">Category 2 · Attendance Register</span>
          <span class="badge-pill" style="color:${isAttCompliant ? 'var(--color-green)' : 'var(--color-rose)'}">
            ${isAttCompliant ? '✓ Policy Compliant (&ge;75%)' : '⚠️ Attendance Shortage (&lt;75%)'}
          </span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:12px;color:var(--text-secondary)">Overall Attendance: <b style="color:${isAttCompliant ? 'var(--color-green)' : 'var(--color-rose)'}">${student.attendance}%</b></span>
          <span style="font-size:11px;color:var(--text-muted)">Lectures Attended: ${Math.round(student.attendance * 0.45 * 2)} / 90</span>
        </div>
        <div style="display:grid;gap:6px">
          ${coursesList.map(c => `
            <div>
              <div class="sub-progress-row">
                <span>${c.code} - ${c.title}</span>
                <b style="color:${c.attendance_pct >= 75 ? 'var(--color-green)' : 'var(--color-rose)'}">${c.attendance_pct}% (${c.classes_attended}/${c.total_classes})</b>
              </div>
              <div class="progress-bar-track" style="width:100%">
                <div class="progress-bar-fill ${c.attendance_pct >= 75 ? 'green' : 'red'}" style="width:${c.attendance_pct}%"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Category 3 · LMS -->
      <div class="drawer-cat-block" style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);margin-bottom:14px;border-left:4px solid var(--color-amber)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span class="cat-tag cat-lms">Category 3 · LMS Activity & Coursework</span>
          <span class="badge-pill">${student.lms_logins >= 60 ? 'Active Learner' : 'Low Activity'}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:var(--bg-primary);padding:10px;border-radius:8px">
            <small style="font-size:10px;color:var(--text-muted)">Total LMS Logins</small>
            <b style="font-size:16px;display:block">${student.lms_logins} Logins</b>
            <span style="font-size:10px;color:var(--color-green)">🔥 Weekly study streak active</span>
          </div>
          <div style="background:var(--bg-primary);padding:10px;border-radius:8px">
            <small style="font-size:10px;color:var(--text-muted)">Assignment Completion</small>
            <b style="font-size:16px;display:block">${student.assignment_completion}%</b>
            <span style="font-size:10px;color:var(--text-muted)">4 Semester Assignments Submitted</span>
          </div>
        </div>
      </div>

      <!-- Category 4 · Placement -->
      <div class="drawer-cat-block" style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);margin-bottom:14px;border-left:4px solid var(--accent-cyan)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span class="cat-tag cat-placement">Category 4 · Placement Readiness & Eligibility</span>
          <span class="badge-pill">${a.categories.placement.tier_eligibility}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          <div style="background:var(--bg-primary);padding:8px 12px;border-radius:8px;text-align:center">
            <small style="font-size:10px;color:var(--text-muted)">Aptitude</small>
            <b style="display:block;font-size:16px;color:var(--accent-purple-light)">${student.placement_score} / 100</b>
          </div>
          <div style="background:var(--bg-primary);padding:8px 12px;border-radius:8px;text-align:center">
            <small style="font-size:10px;color:var(--text-muted)">Coding DSA</small>
            <b style="display:block;font-size:16px;color:var(--color-green)">${student.skills_score} / 100</b>
          </div>
          <div style="background:var(--bg-primary);padding:8px 12px;border-radius:8px;text-align:center">
            <small style="font-size:10px;color:var(--text-muted)">Predicted Chance</small>
            <b style="display:block;font-size:16px;color:var(--accent-cyan)">${a.placement_chance}%</b>
          </div>
        </div>
      </div>

      <!-- Category 5 · Advisory & Checklist -->
      <div class="drawer-cat-block" style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);margin-bottom:14px;border-left:4px solid #14b8a6">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span class="cat-tag cat-feedback">Category 5 · Faculty Advisory Action Plan</span>
          <button class="btn btn-secondary" onclick="copyFacultyNote()" style="font-size:10px;padding:3px 8px">📋 Copy Memo</button>
        </div>
        <p style="font-size:12px;line-height:1.5;color:var(--text-main);margin-bottom:10px;background:var(--bg-primary);padding:10px;border-radius:6px;font-style:italic" id="drawerFacultyNote">
          "${a.faculty_note}"
        </p>
        <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px">Agreed Intervention Milestones:</div>
        <div class="action-plan-list">
          ${a.recommendations.map(r => `
            <div class="action-plan-item">
              <input type="checkbox" class="action-checkbox" checked>
              <div class="action-plan-content">
                <b>${escapeHtml(r)}</b>
                <p>Scheduled review milestone with ${escapeHtml(student.mentor_name || 'Department Mentor')}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  const modal = $("studentDrawerModal");
  if (modal) modal.classList.add("active");
}

function closeStudentDrawer() {
  const modal = $("studentDrawerModal");
  if (modal) modal.classList.remove("active");
}

function copyFacultyNote() {
  const noteEl = $("drawerFacultyNote");
  if (noteEl) {
    navigator.clipboard.writeText(noteEl.textContent.trim()).then(() => {
      showToast("Faculty advisory note copied to clipboard!", "success");
    }).catch(() => {
      showToast("Failed to copy note.", "error");
    });
  }
}

// ---------------- CAMU STUDENT PORTAL INTERACTIVE ENGINE ----------------

function initCamuStudentPortal() {
  if (!studentsData.length) return;

  // Populate student switcher dropdown with all 100 students
  const switcher = $("camuStudentSelector") || $("studentProfileSelect");
  if (switcher) {
    switcher.innerHTML = studentsData.map(s => `
      <option value="${s.id}">
        ${s.roll_no} - ${s.name} (${s.department}, ${s.year})
      </option>
    `).join("");

    // Read query param if specified (?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = Number(urlParams.get("id"));
    const initialId = paramId && studentsData.some(s => s.id === paramId) ? paramId : (activeCamuStudent ? activeCamuStudent.id : 1);
    switcher.value = initialId;
    switchCamuStudent(initialId);
  } else {
    switchCamuStudent(1);
  }
}

function switchStudentView(studentId) {
  switchCamuStudent(studentId);
}

function switchCamuStudent(studentId) {
  const student = studentsData.find(s => s.id === Number(studentId)) || studentsData[0];
  if (!student) return;

  ensureCamuStudentFields(student);
  activeCamuStudent = student;
  selectedStudentId = student.id;

  const a = student.analysis || analyzeStudentClient(student);
  const initials = student.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  // Update hero profile elements
  if ($("activeStuAvatar")) $("activeStuAvatar").textContent = initials;
  if ($("activeStuName")) $("activeStuName").textContent = student.name;
  if ($("activeStuSub")) $("activeStuSub").textContent = `${student.roll_no} · ${student.department} · ${student.year} (${student.semester})`;

  if ($("stuAvatar")) $("stuAvatar").textContent = initials;
  if ($("stuName")) $("stuName").textContent = student.name;
  if ($("stuRoll")) $("stuRoll").textContent = `${student.roll_no} · ${student.reg_no}`;
  if ($("stuDept")) $("stuDept").textContent = `${student.department} · ${student.year}`;
  if ($("stuMentor")) $("stuMentor").textContent = `Faculty Mentor: ${student.mentor_name} · Guardian: ${student.guardian_name} (${student.guardian_phone})`;

  if ($("stuStatusBadge")) {
    $("stuStatusBadge").textContent = a.status;
    $("stuStatusBadge").className = `status-badge ${a.status_color}`;
  }

  // Quick Metrics Ribbon
  if ($("stuCgpa")) $("stuCgpa").textContent = `${(student.cgpa || (student.marks/10)).toFixed(2)} / 10.0`;
  if ($("stuAttendance")) $("stuAttendance").textContent = `${student.attendance}%`;
  if ($("stuScore")) $("stuScore").textContent = `${a.success_score} / 100`;

  // Render all CAMU tab panes
  renderCamuOverview(student, a);
  renderCamuTimetable(student);
  renderCamuAttendance(student);
  renderCamuSemesterResults(student);
  renderCamuCourses(student);
  renderCamuAssignments(student);
  renderCamuFees(student);
  renderCamuAnnouncements();
}

function switchCamuTab(tabId, btn) {
  // Hide all tab panes
  document.querySelectorAll(".camu-tab-pane").forEach(pane => {
    pane.style.display = "none";
  });

  // Remove active from all tab buttons
  document.querySelectorAll(".camu-tab-btn").forEach(b => {
    b.classList.remove("active");
  });

  // Activate selected tab pane
  const activePane = $(tabId);
  if (activePane) activePane.style.display = "block";

  if (btn) btn.classList.add("active");
}

function renderCamuOverview(student, a) {
  if ($("stuMarks")) $("stuMarks").textContent = `${student.marks}/100`;
  const delta = (student.marks - student.previous_marks).toFixed(1);
  const deltaSign = delta >= 0 ? "+" : "";
  if ($("stuDelta")) {
    $("stuDelta").textContent = `${deltaSign}${delta} pts`;
    $("stuDelta").style.color = delta >= 0 ? "var(--color-green)" : "var(--color-rose)";
  }

  if ($("stuAttCount")) $("stuAttCount").textContent = `${Math.round(student.attendance * 0.45 * 2)} / 90 Classes`;
  if ($("stuLmsLogins")) $("stuLmsLogins").textContent = `${student.lms_logins} Logins`;
  if ($("stuAssignRate")) $("stuAssignRate").textContent = `${student.assignment_completion}% Done`;

  if ($("stuBacklogBadge")) {
    $("stuBacklogBadge").textContent = student.backlogs > 0 ? `⚠️ ${student.backlogs} Active Arrears` : `✓ 0 Backlogs Cleared`;
    $("stuBacklogBadge").style.color = student.backlogs > 0 ? "var(--color-rose)" : "var(--color-green)";
  }

  // Subject list in Overview card
  const subContainer = $("stuSubjectList");
  if (subContainer && student.courses) {
    subContainer.innerHTML = student.courses.map(c => `
      <div>
        <div class="sub-progress-row">
          <span>${c.code} - ${c.title} <small style="color:var(--accent-cyan)">[Grade: ${c.grade}]</small></span>
          <b>${c.internal_marks}/100</b>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill ${c.internal_marks >= 75 ? 'purple' : c.internal_marks >= 50 ? 'amber' : 'red'}" style="width:${c.internal_marks}%"></div>
        </div>
      </div>
    `).join("");
  }

  // Subject attendance list in Overview card
  const attSubContainer = $("stuSubjectAttList");
  if (attSubContainer && student.courses) {
    attSubContainer.innerHTML = student.courses.map(c => `
      <div>
        <div class="sub-progress-row">
          <span>${c.code}: ${c.title}</span>
          <b style="color:${c.attendance_pct >= 75 ? 'var(--color-green)' : 'var(--color-rose)'}">${c.attendance_pct}%</b>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill ${c.attendance_pct >= 75 ? 'green' : 'red'}" style="width:${c.attendance_pct}%"></div>
        </div>
      </div>
    `).join("");
  }

  // Action checklist in Overview card
  const actionContainer = $("stuActionChecklist");
  if (actionContainer && a.recommendations) {
    actionContainer.innerHTML = a.recommendations.map((r, i) => `
      <label class="action-plan-item" style="cursor:pointer;padding:8px 10px">
        <input type="checkbox" class="action-checkbox" ${i === 0 && student.marks >= 75 ? 'checked' : ''}>
        <span style="font-size:11px;color:var(--text-main)">${escapeHtml(r)}</span>
      </label>
    `).join("");
  }

  if ($("stuFacultyNote")) $("stuFacultyNote").textContent = a.faculty_note;
}

function renderCamuTimetable(student) {
  const container = $("camuTimetableContainer");
  if (!container || !student.timetable) return;

  const timetable = student.timetable;
  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:15 - 12:15",
    "13:15 - 14:15",
    "14:15 - 15:15"
  ];

  let html = `
    <div class="camu-timetable-grid">
      <div class="timetable-header-cell">Time / Day</div>
      <div class="timetable-header-cell">Monday</div>
      <div class="timetable-header-cell">Tuesday</div>
      <div class="timetable-header-cell">Wednesday</div>
      <div class="timetable-header-cell">Thursday</div>
      <div class="timetable-header-cell">Friday</div>
  `;

  timeSlots.forEach((slot, slotIdx) => {
    html += `<div class="timetable-time-cell"><b>Period ${slotIdx + 1}</b><small>${slot}</small></div>`;
    timetable.forEach(day => {
      const period = day.periods[slotIdx];
      const typeColor = period.type === "Lab / Practical" ? "var(--color-rose)" : (period.type === "Tutorial" ? "var(--color-amber)" : "var(--accent-cyan)");
      html += `
        <div class="timetable-slot-card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="slot-code">${period.code}</span>
            <small style="font-size:9px;color:${typeColor};font-weight:700">${period.type}</small>
          </div>
          <span class="slot-title">${period.title}</span>
          <div class="slot-meta">
            <span>📍 ${period.room}</span>
            <span>👨‍🏫 ${period.faculty.split(" ")[0]}</span>
          </div>
        </div>
      `;
    });
  });

  html += `</div>`;
  container.innerHTML = html;
}

function renderCamuAttendance(student) {
  const tbody = $("camuAttendanceTableBody");
  if (!tbody || !student.courses) return;

  tbody.innerHTML = student.courses.map(c => {
    const isSafe = c.attendance_pct >= 75;
    const badgeClass = isSafe ? "badge-pill verified" : "badge-pill";
    const statusText = isSafe ? "✓ Compliant" : "⚠️ Shortage (<75%)";

    return `
      <tr>
        <td><b>${c.code}</b></td>
        <td>
          <div style="font-weight:600;color:var(--text-main)">${c.title}</div>
          <small style="color:var(--text-muted);font-size:10px">${c.faculty} · 4 Credits</small>
        </td>
        <td><b>${c.total_classes}</b></td>
        <td><b style="color:var(--text-main)">${c.classes_attended}</b></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <b style="color:${isSafe ? 'var(--color-green)' : 'var(--color-rose)'};min-width:35px">${c.attendance_pct}%</b>
            <div class="progress-bar-track" style="width:80px">
              <div class="progress-bar-fill ${isSafe ? 'green' : 'red'}" style="width:${c.attendance_pct}%"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="${badgeClass}" style="${!isSafe ? 'color:var(--color-rose);border-color:var(--color-rose)' : ''}">${statusText}</span>
        </td>
        <td>
          <button class="btn btn-secondary" onclick="openLeaveRequestModal('${c.code}', '${escapeHtml(c.title)}')" style="font-size:11px;padding:4px 8px">
            + Request OD / Leave
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderCamuSemesterResults(student) {
  const sgpaContainer = $("camuSgpaCardsContainer");
  const gradesTableBody = $("camuGradesTableBody");

  if (sgpaContainer && student.semester_results) {
    sgpaContainer.innerHTML = student.semester_results.map(sem => `
      <div class="sgpa-box">
        <small>${sem.semester}</small>
        <b>${sem.sgpa.toFixed(2)}</b>
        <span>Earned: ${sem.credits_earned} Credits · ${sem.status}</span>
      </div>
    `).join("");
  }

  if (gradesTableBody && student.courses) {
    gradesTableBody.innerHTML = student.courses.map(c => {
      const gradeClass = `grade-${c.grade.toLowerCase().replace('+', 'plus')}`;
      return `
        <tr>
          <td><b>${c.code}</b></td>
          <td>${c.title}</td>
          <td>${c.credits}</td>
          <td><b>${c.internal_marks}/100</b></td>
          <td><span class="grade-pill ${gradeClass}">${c.grade}</span></td>
          <td><span style="color:var(--color-green);font-weight:700">Passed</span></td>
        </tr>
      `;
    }).join("");
  }
}

function renderCamuCourses(student) {
  const container = $("camuCoursesGrid");
  if (!container || !student.courses) return;

  container.innerHTML = student.courses.map(c => `
    <div class="camu-course-card">
      <div class="course-header">
        <span class="course-code-badge">${c.code}</span>
        <span class="course-credits-badge">${c.credits} Credits</span>
      </div>
      <div>
        <h4 class="course-title">${c.title}</h4>
        <div class="course-faculty">Faculty: ${c.faculty}</div>
      </div>
      <div>
        <div class="sub-progress-row">
          <small style="color:var(--text-muted)">Syllabus Completion</small>
          <b style="color:var(--accent-purple-light)">${c.syllabus_pct}%</b>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill purple" style="width:${c.syllabus_pct}%"></div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid var(--border-subtle);font-size:11px">
        <span>Attendance: <b style="color:${c.attendance_pct >= 75 ? 'var(--color-green)' : 'var(--color-rose)'}">${c.attendance_pct}%</b></span>
        <span>Internal: <b>${c.internal_marks}/100</b></span>
      </div>
      <button class="btn btn-secondary" onclick="showToast('Course Syllabus & Lecture Notes downloaded for ${c.code}', 'info')" style="font-size:11px;padding:6px;width:100%">
        📥 Download Syllabus & Notes
      </button>
    </div>
  `).join("");
}

function renderCamuAssignments(student) {
  const tbody = $("camuAssignmentsTableBody");
  if (!tbody || !student.assignments) return;

  tbody.innerHTML = student.assignments.map(asg => {
    const statusColor = asg.status === "Graded" ? "var(--color-green)" : (asg.status === "Submitted" ? "var(--accent-cyan)" : "var(--color-amber)");
    return `
      <tr>
        <td><b>${asg.id}</b></td>
        <td><span class="course-code-badge">${asg.course}</span></td>
        <td><b>${asg.title}</b></td>
        <td><span style="font-size:11px;color:var(--text-secondary)">${asg.due_date}</span></td>
        <td><span class="badge-pill" style="color:${statusColor}">${asg.status}</span></td>
        <td><b>${asg.score}</b></td>
        <td>
          <button class="btn btn-secondary" onclick="openAssignmentSubmitModal('${asg.id}', '${escapeHtml(asg.title)}')" style="font-size:11px;padding:4px 8px">
            ${asg.status === 'Submitted' ? 'Update Submission' : 'Submit Work'}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderCamuFees(student) {
  const container = $("camuFeeLedgerContainer");
  if (!container) return;

  const feeStatusClass = student.fee_status === "Paid" ? "fee-badge-paid" : (student.fee_status === "Pending" ? "fee-badge-pending" : "fee-badge-overdue");

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;margin-bottom:20px">
      <div style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
        <small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Annual Tuition & Lab Fees</small>
        <b style="display:block;font-size:22px;color:var(--text-main);font-family:var(--font-heading)">₹${student.fee_amount.toLocaleString()}</b>
        <span style="font-size:11px;color:var(--text-muted)">Academic Year 2026-2027</span>
      </div>
      <div style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
        <small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Amount Paid</small>
        <b style="display:block;font-size:22px;color:var(--color-green);font-family:var(--font-heading)">₹${student.fee_paid.toLocaleString()}</b>
        <span style="font-size:11px;color:var(--color-green)">Receipt: ${student.fee_receipt_no}</span>
      </div>
      <div style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);border:1px solid var(--border-subtle)">
        <small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Balance Payable Due</small>
        <b style="display:block;font-size:22px;color:${student.fee_due > 0 ? 'var(--color-rose)' : 'var(--color-green)'};font-family:var(--font-heading)">₹${student.fee_due.toLocaleString()}</b>
        <span style="font-size:11px;color:var(--text-muted)">Due Date: ${student.fee_due_date}</span>
      </div>
      <div style="background:var(--bg-surface);padding:14px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);display:flex;flex-direction:column;justify-content:center;align-items:flex-start">
        <small style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Payment Status</small>
        <div style="margin:6px 0"><span class="${feeStatusClass}">${student.fee_status}</span></div>
        ${student.fee_due > 0 
          ? `<button class="btn btn-primary" onclick="openFeePaymentModal(${student.fee_due})" style="font-size:11px;padding:6px 14px">💳 Pay ₹${student.fee_due.toLocaleString()} Now</button>`
          : `<span style="font-size:11px;color:var(--color-green)">✓ No Dues Outstanding</span>`}
      </div>
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Fee Head Component</th>
            <th>Approved Amount</th>
            <th>Paid Amount</th>
            <th>Outstanding</th>
            <th>Receipt Voucher</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Tuition & Curriculum Instruction Fee</b></td>
            <td>₹55,000</td>
            <td>₹${student.fee_status === 'Paid' ? '55,000' : (student.fee_status === 'Pending' ? '30,000' : '0')}</td>
            <td>₹${student.fee_status === 'Paid' ? '0' : (student.fee_status === 'Pending' ? '25,000' : '55,000')}</td>
            <td>VCH-2026-TUI-01</td>
            <td><span class="${feeStatusClass}">${student.fee_status}</span></td>
          </tr>
          <tr>
            <td><b>University Examination & Assessment Fee</b></td>
            <td>₹12,000</td>
            <td>₹${student.fee_status === 'Paid' ? '12,000' : (student.fee_status === 'Pending' ? '6,000' : '0')}</td>
            <td>₹${student.fee_status === 'Paid' ? '0' : (student.fee_status === 'Pending' ? '6,000' : '12,000')}</td>
            <td>VCH-2026-EXAM-02</td>
            <td><span class="${feeStatusClass}">${student.fee_status}</span></td>
          </tr>
          <tr>
            <td><b>Specialized Computing & AI Laboratory Fee</b></td>
            <td>₹10,000</td>
            <td>₹${student.fee_status === 'Paid' ? '10,000' : (student.fee_status === 'Pending' ? '5,000' : '0')}</td>
            <td>₹${student.fee_status === 'Paid' ? '0' : (student.fee_status === 'Pending' ? '5,000' : '10,000')}</td>
            <td>VCH-2026-LAB-03</td>
            <td><span class="${feeStatusClass}">${student.fee_status}</span></td>
          </tr>
          <tr>
            <td><b>Digital Library, IEEE Access & Sports Amenity</b></td>
            <td>₹8,000</td>
            <td>₹${student.fee_status === 'Paid' ? '8,000' : (student.fee_status === 'Pending' ? '1,500' : '0')}</td>
            <td>₹${student.fee_status === 'Paid' ? '0' : (student.fee_status === 'Pending' ? '6,500' : '8,000')}</td>
            <td>VCH-2026-LIB-04</td>
            <td><span class="${feeStatusClass}">${student.fee_status}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderCamuAnnouncements() {
  const container = $("camuAnnouncementsContainer");
  if (!container) return;

  const announcements = [
    {
      date: "14",
      month: "NOV",
      title: "End-Semester Theory & Practical Examination Timetable Released",
      desc: "The Controller of Examinations has published the final timetable for Winter 2026 Semester Examinations. Hall tickets will be downloadable via the student portal from Nov 20th onwards."
    },
    {
      date: "10",
      month: "NOV",
      title: "Google & Microsoft Hackathon 2026 - Campus Registration Open",
      desc: "All 2nd, 3rd, and 4th year CSE, CSBS, IT and ECE students are invited to register teams for the Annual Campus AI & Cloud Hackathon. Winners receive direct Tier-1 interview fast-tracks."
    },
    {
      date: "04",
      month: "NOV",
      title: "Library Due Date Reminder & Digital Research Journals Access",
      desc: "Return or renew all physical library books by Nov 18th to avoid late fines. ACM Digital Library and IEEE Xplore subscriptions have been renewed for all campus enrolled students."
    },
    {
      date: "01",
      month: "NOV",
      title: "Campus Placement Season Phase-1 Drives Commencing",
      desc: "The Central Placement Office informs that Tier-1 product engineering recruiters will conduct coding screening rounds starting Nov 25th for zero-backlog students meeting 7.5+ CGPA."
    }
  ];

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">
      ${announcements.map(a => `
        <div class="announcement-item">
          <div class="announcement-date-box">
            <b>${a.date}</b>
            <small>${a.month}</small>
          </div>
          <div class="announcement-content">
            <h4 class="announcement-title">${a.title}</h4>
            <p class="announcement-desc">${a.desc}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// Interactive Student Modals (Leave, Payment, Assignments)
function openLeaveRequestModal(courseCode, courseTitle) {
  const reason = prompt(`Submit On-Duty (OD) or Medical Leave request for ${courseCode} (${courseTitle}):\nEnter Reason (e.g., Symposium / Medical / Hackathon):`, "Attending Inter-College Tech Symposium");
  if (reason) {
    showToast(`Leave request submitted for ${courseCode}. Forwarded to Faculty Mentor for approval.`, "success");
  }
}

function openFeePaymentModal(dueAmount) {
  const confirmed = confirm(`Proceed to payment gateway simulation for ₹${dueAmount.toLocaleString()}?\nPayment Method: NetBanking / UPI / Campus Card`);
  if (confirmed && activeCamuStudent) {
    activeCamuStudent.fee_paid = activeCamuStudent.fee_amount;
    activeCamuStudent.fee_due = 0;
    activeCamuStudent.fee_status = "Paid";
    saveLocalData();
    renderCamuFees(activeCamuStudent);
    showToast(`Payment of ₹${dueAmount.toLocaleString()} processed successfully! Receipt voucher issued.`, "success");
  }
}

function openAssignmentSubmitModal(asgId, asgTitle) {
  const file = prompt(`Submit online assignment work for ${asgId} - "${asgTitle}":\nEnter Google Drive / GitHub repository link or file name:`, "https://github.com/student/assignment-solution.git");
  if (file && activeCamuStudent) {
    const asg = activeCamuStudent.assignments.find(a => a.id === asgId);
    if (asg) {
      asg.status = "Submitted";
      saveLocalData();
      renderCamuAssignments(activeCamuStudent);
      showToast(`Assignment ${asgId} uploaded and submitted to course faculty successfully!`, "success");
    }
  }
}

// ---------------- CAMU FACULTY PORTAL INTERACTIVE ENGINE ----------------

function initCamuFacultyPortal() {
  if (!studentsData.length) return;

  const total = studentsData.length;
  const avgAtt = (studentsData.reduce((acc, s) => acc + s.attendance, 0) / total).toFixed(1);
  const avgApt = (studentsData.reduce((acc, s) => acc + s.placement_score, 0) / total).toFixed(1);
  const avgAssign = (studentsData.reduce((acc, s) => acc + s.assignment_completion, 0) / total).toFixed(1);
  const critical = studentsData.filter(s => s.analysis.status === "Needs support");

  if ($("facTotalMentees")) $("facTotalMentees").textContent = total;
  if ($("facClassAtt")) $("facClassAtt").textContent = `${avgAtt}%`;
  if ($("facCriticalCount")) $("facCriticalCount").textContent = critical.length;
  if ($("facAvgAssign")) $("facAvgAssign").textContent = `${avgAssign}%`;
  if ($("facAvgApt")) $("facAvgApt").textContent = `${avgApt} / 100`;

  renderFacultyMenteeTable();
  renderFacultyAttendanceMatrix();
  renderFacultyMarksEntry();
  renderFacultyAtRiskWatch();
}

function switchFacultyDept(dept) {
  facultyActiveDept = dept;
  renderFacultyMenteeTable();
  renderFacultyAttendanceMatrix();
  renderFacultyMarksEntry();
}

function renderFacultyMenteeTable() {
  const tbody = $("facMenteeTableBody");
  if (!tbody) return;

  const cohort = facultyActiveDept === "All" ? studentsData : studentsData.filter(s => s.department === facultyActiveDept);

  tbody.innerHTML = cohort.map(s => {
    const initials = s.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const cgpa = (s.cgpa || (s.marks / 10)).toFixed(2);
    return `
      <tr>
        <td>
          <div class="student-cell">
            <div class="avatar" style="background:#10b981">${initials}</div>
            <div class="student-meta">
              <b style="cursor:pointer;color:var(--text-main)" onclick="openStudentDrawer(${s.id})">${s.name}</b>
              <span>${s.roll_no}</span>
            </div>
          </div>
        </td>
        <td><span class="dept-badge">${s.department}</span></td>
        <td><span style="font-size:11px;color:var(--text-secondary)">${s.year}</span></td>
        <td><b style="color:var(--accent-purple-light);font-family:var(--font-heading);font-size:13px">${cgpa}</b><small style="font-size:10px;color:var(--text-muted)">/10</small></td>
        <td><b style="color:${s.attendance >= 75 ? 'var(--color-green)' : 'var(--color-rose)'}">${s.attendance}%</b></td>
        <td><b>${s.marks}/100</b></td>
        <td>${s.backlogs > 0 ? `<span style="color:var(--color-rose);font-weight:700">⚠️ ${s.backlogs}</span>` : `<span style="color:var(--color-green)">0</span>`}</td>
        <td><span class="status-badge ${s.analysis.status_color}">${s.analysis.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-table" onclick="openStudentDrawer(${s.id})" title="View 360 Diagnostic Profile">👁 Profile</button>
            <button class="btn-table" onclick="quickCounsel(${s.id})">✍️ Counsel</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderFacultyAttendanceMatrix() {
  const container = $("facAttendanceRegisterContainer");
  if (!container) return;

  const cohort = facultyActiveDept === "All" ? studentsData : studentsData.filter(s => s.department === facultyActiveDept);

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:10px">
        <label style="font-size:12px;font-weight:700;color:var(--text-secondary)">Subject / Course:</label>
        <select class="filter-select" id="facAttCourseSelect" style="min-width:240px">
          <option value="AI301">AI301 - Machine Learning & Neural Networks</option>
          <option value="CS302">CS302 - Design & Analysis of Algorithms</option>
          <option value="CS303">CS303 - Database Systems & Data Modeling</option>
        </select>
        <input type="date" class="filter-select" value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary" onclick="markAllAttendance('P')" style="font-size:11px">Mark All Present</button>
        <button class="btn btn-secondary" onclick="markAllAttendance('A')" style="font-size:11px">Mark All Absent</button>
        <button class="btn btn-primary" onclick="submitAttendanceRegister()" style="background:#10b981;font-size:11px">💾 Submit Attendance</button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="camu-att-matrix-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Class / Year</th>
            <th>Current Attendance</th>
            <th>Mark Status (P / A / OD)</th>
          </tr>
        </thead>
        <tbody>
          ${cohort.map(s => `
            <tr>
              <td><b>${s.roll_no}</b></td>
              <td>${s.name}</td>
              <td>${s.year}</td>
              <td><b style="color:${s.attendance >= 75 ? 'var(--color-green)' : 'var(--color-rose)'}">${s.attendance}%</b></td>
              <td>
                <div class="btn-att-toggle-group" id="attGroup_${s.id}">
                  <button type="button" class="btn-att-toggle active-p" onclick="setStudentAttendanceMark(${s.id}, 'P')">P</button>
                  <button type="button" class="btn-att-toggle" onclick="setStudentAttendanceMark(${s.id}, 'A')">A</button>
                  <button type="button" class="btn-att-toggle" onclick="setStudentAttendanceMark(${s.id}, 'OD')">OD</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setStudentAttendanceMark(studentId, status) {
  const grp = $(`attGroup_${studentId}`);
  if (!grp) return;

  const btns = grp.querySelectorAll(".btn-att-toggle");
  btns[0].className = status === "P" ? "btn-att-toggle active-p" : "btn-att-toggle";
  btns[1].className = status === "A" ? "btn-att-toggle active-a" : "btn-att-toggle";
  btns[2].className = status === "OD" ? "btn-att-toggle active-od" : "btn-att-toggle";
}

function markAllAttendance(status) {
  const cohort = facultyActiveDept === "All" ? studentsData : studentsData.filter(s => s.department === facultyActiveDept);
  cohort.forEach(s => {
    setStudentAttendanceMark(s.id, status);
  });
  showToast(`Marked all students as ${status === 'P' ? 'Present' : 'Absent'}`, "info");
}

function submitAttendanceRegister() {
  const cohort = facultyActiveDept === "All" ? studentsData : studentsData.filter(s => s.department === facultyActiveDept);
  let presentCount = 0;

  cohort.forEach(s => {
    const grp = $(`attGroup_${s.id}`);
    if (grp) {
      const isPresent = grp.querySelector(".active-p") !== null;
      const isOD = grp.querySelector(".active-od") !== null;
      if (isPresent || isOD) {
        presentCount++;
        s.attendance = Math.min(100, Math.round((s.attendance + 0.5) * 10) / 10);
      } else {
        s.attendance = Math.max(30, Math.round((s.attendance - 0.8) * 10) / 10);
      }
      s.analysis = analyzeStudentClient(s);
    }
  });

  saveLocalData();
  renderFacultyMenteeTable();
  renderFacultyAttendanceMatrix();
  showToast(`Daily Attendance Register submitted successfully! (${presentCount}/${cohort.length} Present)`, "success");
}

function renderFacultyMarksEntry() {
  const container = $("facInternalMarksContainer");
  if (!container) return;

  const cohort = facultyActiveDept === "All" ? studentsData : studentsData.filter(s => s.department === facultyActiveDept);

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:10px">
        <label style="font-size:12px;font-weight:700;color:var(--text-secondary)">Assessment:</label>
        <select class="filter-select" id="facAssessmentType">
          <option value="cia1">CIA 1 - Midterm 1 (50 Marks)</option>
          <option value="cia2">CIA 2 - Midterm 2 (50 Marks)</option>
          <option value="model">Model Examination (100 Marks)</option>
        </select>
        <select class="filter-select">
          <option value="AI301">AI301 - Machine Learning</option>
          <option value="CS302">CS302 - Algorithms</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="saveInternalMarks()" style="background:#10b981;font-size:11px">💾 Save Internal Marks</button>
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Department</th>
            <th>Current Overall Score</th>
            <th>Enter Marks</th>
            <th>Grade Preview</th>
          </tr>
        </thead>
        <tbody>
          ${cohort.slice(0, 15).map(s => `
            <tr>
              <td><b>${s.roll_no}</b></td>
              <td>${s.name}</td>
              <td>${s.department}</td>
              <td><b>${s.marks}/100</b></td>
              <td>
                <input type="number" class="camu-select" id="markInput_${s.id}" value="${Math.round(s.marks)}" min="0" max="100" style="width:80px">
              </td>
              <td>
                <span class="grade-pill grade-${s.marks >= 90 ? 'o' : s.marks >= 80 ? 'aplus' : s.marks >= 70 ? 'a' : 'b'}">
                  ${s.marks >= 90 ? 'O' : s.marks >= 80 ? 'A+' : s.marks >= 70 ? 'A' : 'B'}
                </span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function saveInternalMarks() {
  const cohort = facultyActiveDept === "All" ? studentsData : studentsData.filter(s => s.department === facultyActiveDept);
  cohort.slice(0, 15).forEach(s => {
    const inp = $(`markInput_${s.id}`);
    if (inp) {
      const val = Number(inp.value);
      if (!isNaN(val) && val >= 0 && val <= 100) {
        s.previous_marks = s.marks;
        s.marks = val;
        s.cgpa = Math.round(Math.max(4.0, Math.min(10.0, val / 10)) * 100) / 100;
        s.analysis = analyzeStudentClient(s);
      }
    }
  });

  saveLocalData();
  renderFacultyMenteeTable();
  renderFacultyMarksEntry();
  showToast("Continuous Internal Assessment marks saved and student CGPAs recomputed!", "success");
}

function renderFacultyAtRiskWatch() {
  const watchlist = $("facAcademicWatchlist");
  if (!watchlist) return;

  const lowStudents = studentsData.filter(s => s.marks < 60 || s.backlogs > 0 || s.attendance < 75);
  watchlist.innerHTML = lowStudents.slice(0, 6).map(s => `
    <div class="alert-item critical" style="padding:10px" onclick="openStudentDrawer(${s.id})">
      <div class="alert-icon">!</div>
      <div class="alert-content">
        <div class="alert-title">
          <b>${s.name} (${s.department})</b>
          <span style="color:var(--color-rose);font-weight:700">Marks: ${s.marks}/100 · Att: ${s.attendance}%</span>
        </div>
        <p class="alert-desc">${s.backlogs > 0 ? `Active Backlogs: ${s.backlogs} subject(s)` : 'Attendance / Midterm shortage'}. Assigned Faculty Revision Tutorial advised.</p>
      </div>
    </div>
  `).join("");
}

function quickCounsel(studentId) {
  const s = studentsData.find(item => item.id === Number(studentId));
  if (!s) return;
  const sel = $("counselStudentSelect");
  if (sel) sel.value = s.id;
  const modal = $("counselingModal");
  if (modal) modal.classList.add("active");
}

function openCounselingModal() {
  const modal = $("counselingModal");
  if (modal) modal.classList.add("active");
}

function closeCounselingModal() {
  const modal = $("counselingModal");
  if (modal) modal.classList.remove("active");
}

function saveCounselingNote() {
  const studentId = $("counselStudentSelect") ? Number($("counselStudentSelect").value) : null;
  const remarks = $("counselRemarks") ? $("counselRemarks").value : "";
  const focus = $("counselFocus") ? $("counselFocus").value : "";

  if (studentId) {
    const s = studentsData.find(item => item.id === studentId);
    if (s && remarks) {
      if (!s.counseling_notes) s.counseling_notes = [];
      s.counseling_notes.push({
        date: new Date().toLocaleDateString(),
        focus: focus,
        remarks: remarks,
        mentor: "Dr. Arvind Rao"
      });
      saveLocalData();
      showToast(`Counseling note recorded for ${s.name} (${s.department})`, "success");
    }
  }

  closeCounselingModal();
}

function issueBatchAttendanceWarning() {
  const lowAttCount = studentsData.filter(s => s.attendance < 75).length;
  alert(`Dispatched official university Attendance Debarment Warning letters to ${lowAttCount} students and their registered parent phone contacts.`);
  showToast(`Attendance notices issued to ${lowAttCount} students.`, "warning");
}

function exportCounselorReport() {
  exportCSV();
}

// ---------------- CAMU PLACEMENT PORTAL INTERACTIVE ENGINE ----------------

function initCamuPlacementPortal() {
  if (!studentsData.length) return;

  const total = studentsData.length;
  const zeroBacklog = studentsData.filter(s => s.backlogs === 0).length;
  const readyPool = studentsData.filter(s => s.analysis && s.analysis.placement_chance >= 70).length;
  const avgApt = (studentsData.reduce((acc, s) => acc + s.placement_score, 0) / total).toFixed(1);

  if ($("tpoReadyPct")) $("tpoReadyPct").textContent = `${Math.round((readyPool / total) * 100)}%`;
  if ($("tpoZeroBacklog")) $("tpoZeroBacklog").textContent = `${zeroBacklog} / ${total}`;
  if ($("tpoAvgApt")) $("tpoAvgApt").textContent = avgApt;

  runPlacementScreening();
}

function runPlacementScreening() {
  const minCgpa = $("tpoSliderCgpa") ? Number($("tpoSliderCgpa").value) : 7.0;
  const maxBacklogs = $("tpoMaxBacklogs") ? Number($("tpoMaxBacklogs").value) : 0;
  const minApt = $("tpoSliderApt") ? Number($("tpoSliderApt").value) : 60;
  const minCoding = $("tpoSliderCoding") ? Number($("tpoSliderCoding").value) : 60;

  if ($("tpoValCgpa")) $("tpoValCgpa").textContent = minCgpa.toFixed(1);
  if ($("tpoValApt")) $("tpoValApt").textContent = minApt;
  if ($("tpoValCoding")) $("tpoValCoding").textContent = minCoding;

  const screened = studentsData.filter(s => {
    const cgpa = Number(s.cgpa || s.marks / 10);
    return cgpa >= minCgpa && s.backlogs <= maxBacklogs && s.placement_score >= minApt && s.skills_score >= minCoding;
  });

  if ($("tpoScreenedCount")) {
    $("tpoScreenedCount").textContent = `${screened.length} of ${studentsData.length} Candidates Qualified`;
  }

  renderPlacementCandidateTable(screened);
}

function simulateDrive() {
  runPlacementScreening();
  showToast("Drive screening simulation refreshed against live student database.", "success");
}

function renderPlacementCandidateTable(candidates) {
  const tbody = $("tpoCandidateTableBody");
  if (!tbody) return;

  const list = candidates || studentsData;

  tbody.innerHTML = list.slice(0, 20).map(s => {
    const initials = s.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const cgpa = (s.cgpa || (s.marks / 10)).toFixed(2);
    const isTier1 = cgpa >= 8.0 && s.backlogs === 0 && s.placement_score >= 75;

    return `
      <tr>
        <td>
          <div class="student-cell">
            <div class="avatar" style="background:#06b6d4">${initials}</div>
            <div class="student-meta">
              <b style="cursor:pointer;color:var(--text-main)" onclick="openStudentDrawer(${s.id})">${s.name}</b>
              <span>${s.roll_no}</span>
            </div>
          </div>
        </td>
        <td><span class="dept-badge">${s.department}</span></td>
        <td><span style="font-size:11px;color:var(--text-secondary)">${s.year}</span></td>
        <td><b style="color:var(--accent-purple-light);font-family:var(--font-heading);font-size:13px">${cgpa}</b><small style="font-size:10px;color:var(--text-muted)">/10</small></td>
        <td>${s.backlogs > 0 ? `<span style="color:var(--color-rose);font-weight:700">⚠️ ${s.backlogs}</span>` : `<span style="color:var(--color-green)">0</span>`}</td>
        <td><b>${s.placement_score}/100</b></td>
        <td><b style="color:var(--color-green)">${s.skills_score}/100</b></td>
        <td>
          <span class="badge-pill ${isTier1 ? 'verified' : ''}" style="color:${isTier1 ? 'var(--accent-cyan)' : 'var(--text-secondary)'}">
            ${isTier1 ? 'Tier-1 Product Eligible' : (s.backlogs <= 1 ? 'Tier-2 IT Services' : 'Remediation Req.')}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary" onclick="openStudentDrawer(${s.id})" style="font-size:11px;padding:4px 8px">
            👁 360 Profile
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function exportRecruiterCSV() {
  exportCSV();
}

// ---------------- MASTER CSV EXPORT (ALL 100 STUDENTS) ----------------

function exportCSV() {
  if (!studentsData.length) {
    showToast("No student records available to export", "error");
    return;
  }

  const headers = [
    "Student_ID", "Roll_No", "Reg_No", "Full_Name", "Department", "Year", "Semester",
    "Section", "Email", "Phone", "Mentor_Name", "CGPA", "Marks_100", "Midterm_Delta",
    "Attendance_Pct", "Assignments_Pct", "LMS_Logins", "Backlogs", "Fee_Status",
    "Fee_Paid", "Fee_Due", "Placement_Score", "Coding_Score", "AI_Success_Index", "Risk_Status"
  ];

  const rows = studentsData.map(s => {
    const a = s.analysis || analyzeStudentClient(s);
    return [
      s.id,
      `"${s.roll_no || ''}"`,
      `"${s.reg_no || ''}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.year || '1st Year'}"`,
      `"${s.semester || 'Sem 2'}"`,
      `"${s.section || 'A'}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.mentor_name || ''}"`,
      (s.cgpa || (s.marks/10)).toFixed(2),
      s.marks,
      (s.marks - s.previous_marks).toFixed(1),
      s.attendance,
      s.assignment_completion,
      s.lms_logins,
      s.backlogs,
      `"${s.fee_status || 'Paid'}"`,
      s.fee_paid || 85000,
      s.fee_due || 0,
      s.placement_score,
      s.skills_score,
      a.success_score,
      `"${a.status}"`
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CAMU_NexusEdu_100_Students_Master_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Master CAMU 100-student directory CSV exported successfully!", "success");
}

// ---------------- CRUD MODALS FOR ADMINISTRATOR ----------------

function openAddModal() {
  $("modalTitle").textContent = "Add New Student Record";
  $("studentForm").reset();
  $("studentId").value = "";
  $("formSubmitBtn").textContent = "Add Student";
  updateFormLiveScore();
  $("studentModal").classList.add("active");
}

function openEditModal(studentId) {
  const s = studentsData.find(item => item.id === Number(studentId));
  if (!s) return;

  $("modalTitle").textContent = "Edit Student Record";
  $("studentId").value = s.id;
  $("formName").value = s.name;
  $("formDept").value = s.department;
  $("formAttendance").value = s.attendance;
  $("formMarks").value = s.marks;
  $("formPrevMarks").value = s.previous_marks;
  $("formAssign").value = s.assignment_completion;
  $("formLms").value = s.lms_logins;
  $("formPlacement").value = s.placement_score;
  $("formSkills").value = s.skills_score;
  $("formFeedback").value = s.feedback_score;
  $("formBacklogs").value = s.backlogs;
  $("formSubmitBtn").textContent = "Update Student";

  updateFormLiveScore();
  $("studentModal").classList.add("active");
}

function closeStudentFormModal() {
  $("studentModal").classList.remove("active");
}

function updateFormLiveScore() {
  const tempObj = {
    marks: Number($("formMarks") ? $("formMarks").value : 75),
    previous_marks: Number($("formPrevMarks") ? $("formPrevMarks").value : 75),
    attendance: Number($("formAttendance") ? $("formAttendance").value : 80),
    assignment_completion: Number($("formAssign") ? $("formAssign").value : 85),
    lms_logins: Number($("formLms") ? $("formLms").value : 70),
    placement_score: Number($("formPlacement") ? $("formPlacement").value : 70),
    skills_score: Number($("formSkills") ? $("formSkills").value : 75),
    feedback_score: Number($("formFeedback") ? $("formFeedback").value : 80),
    backlogs: Number($("formBacklogs") ? $("formBacklogs").value : 0)
  };

  const a = analyzeStudentClient(tempObj);
  if ($("formLiveScore")) $("formLiveScore").textContent = a.success_score;
  if ($("formLiveBadge")) {
    $("formLiveBadge").textContent = a.status;
    $("formLiveBadge").className = `status-badge ${a.status_color}`;
  }
}

async function handleStudentFormSubmit(e) {
  e.preventDefault();

  const idVal = $("studentId").value;
  const isEdit = Boolean(idVal);

  const studentPayload = {
    name: $("formName").value.trim(),
    department: $("formDept").value,
    attendance: Number($("formAttendance").value),
    marks: Number($("formMarks").value),
    previous_marks: Number($("formPrevMarks").value),
    assignment_completion: Number($("formAssign").value),
    lms_logins: Number($("formLms").value),
    placement_score: Number($("formPlacement").value),
    skills_score: Number($("formSkills").value),
    feedback_score: Number($("formFeedback").value),
    backlogs: Number($("formBacklogs").value),
    cgpa: Number((Number($("formMarks").value) / 10).toFixed(2))
  };

  if (isEdit) {
    const existingIndex = studentsData.findIndex(s => s.id === Number(idVal));
    if (existingIndex !== -1) {
      studentsData[existingIndex] = {
        ...studentsData[existingIndex],
        ...studentPayload
      };
      studentsData[existingIndex].analysis = analyzeStudentClient(studentsData[existingIndex]);
      saveLocalData();
      showToast("Student profile updated successfully", "success");
    }
  } else {
    const newId = studentsData.length ? Math.max(...studentsData.map(s => s.id)) + 1 : 1;
    const newStudent = {
      id: newId,
      roll_no: `2024${studentPayload.department.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${String(newId).padStart(3, '0')}`,
      reg_no: `REG2024${7800 + newId}`,
      year: "1st Year",
      semester: "Sem 2",
      section: "A",
      email: `${studentPayload.name.toLowerCase().replace(/\s+/g, '.')}${newId}@campus.edu`,
      phone: "+91 98401 54321",
      blood_group: "O+",
      mentor_name: "Dr. Arvind Rao",
      fee_status: "Paid",
      fee_amount: 85000,
      fee_paid: 85000,
      fee_due: 0,
      fee_due_date: "15 Nov 2026",
      fee_receipt_no: `REC-2024-${1000 + newId}`,
      ...studentPayload
    };
    ensureCamuStudentFields(newStudent);
    newStudent.analysis = analyzeStudentClient(newStudent);
    studentsData.push(newStudent);
    saveLocalData();
    showToast("New student created successfully", "success");
  }

  closeStudentFormModal();
  updateDashboard();
}

function deleteStudent(studentId) {
  const student = studentsData.find(s => s.id === Number(studentId));
  if (!student) return;

  if (confirm(`Are you sure you want to delete student "${student.name}" (${student.roll_no})?`)) {
    studentsData = studentsData.filter(s => s.id !== Number(studentId));
    saveLocalData();
    updateDashboard();
    showToast(`Deleted student ${student.name}`, "info");
  }
}

// ---------------- AUTHENTICATION & ROLE MANAGEMENT ----------------

const AuthManager = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem("nexus_auth_user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(role, name, id) {
    const user = {
      role: role,
      name: name,
      id: id || "USR-01",
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem("nexus_auth_user", JSON.stringify(user));
    return user;
  },

  getLoginUrlForRole(role) {
    const prefix = window.location.protocol.startsWith("http") ? "/" : "";
    if (role === "student") return prefix + "student-login.html";
    if (role === "faculty") return prefix + "faculty-login.html";
    if (role === "placement") return prefix + "placement-login.html";
    if (role === "administrator") return prefix + "admin-login.html";
    return prefix + "login.html";
  },

  logout(role) {
    const current = this.getCurrentUser();
    const targetRole = role || (current && current.role);
    localStorage.removeItem("nexus_auth_user");
    const targetUrl = this.getLoginUrlForRole(targetRole);
    window.location.href = targetUrl;
  },

  detectPageRole() {
    const path = (window.location.pathname || "").toLowerCase();
    if (path.includes("login")) return null;
    if (path.includes("student")) return "student";
    if (path.includes("faculty")) return "faculty";
    if (path.includes("placement")) return "placement";
    if (path.includes("administrator") || path.includes("index")) return "administrator";
    return null;
  },

  initAuthForPage(defaultRole) {
    const path = (window.location.pathname || "").toLowerCase();
    if (path.includes("login")) return;

    const role = defaultRole || this.detectPageRole();
    if (!role) return;

    let user = this.getCurrentUser();
    const loginTarget = this.getLoginUrlForRole(role);

    // If no user is logged in, redirect to dedicated login page
    if (!user) {
      window.location.href = loginTarget;
      return;
    }

    // If user role does not match current portal, redirect to correct login page
    if (user.role !== role) {
      window.location.href = loginTarget;
      return;
    }

    this.renderSessionPill(user);
  },

  renderSessionPill(user) {
    const container = $("userSessionPill");
    if (!container) return;

    const roleIcons = {
      student: "🎓",
      faculty: "👨‍🏫",
      placement: "💼",
      administrator: "🏛️"
    };

    const roleLabels = {
      student: "Student Portal",
      faculty: "Faculty Mentor",
      placement: "Placement Cell",
      administrator: "Campus Administrator"
    };

    container.innerHTML = `
      <div class="user-session-badge">
        <div class="user-session-avatar">${roleIcons[user.role] || '👤'}</div>
        <div class="user-session-info">
          <span class="user-session-name">${escapeHtml(user.name)}</span>
          <span class="user-session-role">${roleLabels[user.role] || user.role}</span>
        </div>
        <button type="button" class="btn-session-logout" onclick="AuthManager.logout('${user.role}')" title="Sign Out of Portal">
          🚪 Logout
        </button>
      </div>
    `;
  }
};

// ---------------- THEMES, TOASTS & UTILITIES ----------------

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const target = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", target);
  localStorage.setItem("nexus_theme", target);
}

function initTheme() {
  const saved = localStorage.getItem("nexus_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}

function toggleMobileSidebar() {
  const sidebar = $("sidebar");
  if (sidebar) sidebar.classList.toggle("mobile-open");
}

function showToast(message, type = "info") {
  let container = $("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <div>${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------- EVENT LISTENERS & INITIALIZATION ----------------

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  AuthManager.initAuthForPage();

  // Search input
  const searchInput = $("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  // Department filter pills
  document.querySelectorAll(".pill-btn[data-dept]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill-btn[data-dept]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentDepartmentFilter = btn.getAttribute("data-dept");
      currentPage = 1;
      renderTable();
    });
  });

  // Year filter pills
  document.querySelectorAll(".pill-btn[data-year]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pill-btn[data-year]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentYearFilter = btn.getAttribute("data-year");
      currentPage = 1;
      renderTable();
    });
  });

  // Status filter dropdown
  const statusSelect = $("statusFilter");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      currentStatusFilter = e.target.value;
      currentPage = 1;
      renderTable();
    });
  }

  // Sort dropdown
  const sortSelect = $("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderTable();
    });
  }

  // Simulator Sliders
  const sliderInputs = [
    { id: "sliderAtt", valId: "valAtt", unit: "%" },
    { id: "sliderMarks", valId: "valMarks", unit: "" },
    { id: "sliderAssign", valId: "valAssign", unit: "%" },
    { id: "sliderLms", valId: "valLms", unit: "" },
    { id: "sliderPlacement", valId: "valPlacement", unit: "" },
    { id: "sliderBacklogs", valId: "valBacklogs", unit: "" }
  ];

  sliderInputs.forEach(item => {
    const el = $(item.id);
    if (el) {
      el.addEventListener("input", (e) => {
        if ($(item.valId)) $(item.valId).textContent = `${e.target.value}${item.unit}`;
        runSimulation();
      });
    }
  });

  // Simulator student select dropdown
  const simSelect = $("simStudentSelect");
  if (simSelect) {
    simSelect.addEventListener("change", (e) => {
      loadStudentIntoSimulator(e.target.value);
    });
  }

  // Add / Edit Form live score listeners
  const formScoreInputs = [
    "formAttendance", "formMarks", "formPrevMarks", "formAssign",
    "formLms", "formPlacement", "formSkills", "formFeedback", "formBacklogs"
  ];
  formScoreInputs.forEach(id => {
    const el = $(id);
    if (el) el.addEventListener("input", updateFormLiveScore);
  });

  const form = $("studentForm");
  if (form) form.addEventListener("submit", handleStudentFormSubmit);

  // Initialize Dual-Engine
  await checkBackendEnvironment();
  await loadData();
});
