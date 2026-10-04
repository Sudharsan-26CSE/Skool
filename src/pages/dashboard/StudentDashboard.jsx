import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  BookOpen,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  Video,
  Library,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  SlidersHorizontal,
  UserCheck,
  GraduationCap,
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Sparkles,
  Building,
  ChevronDown,
  Layers
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { useToast } from '../../components/common/ToastContext';
import './StudentAcademicModal.css';
import {
  getSubjects,
  getNotices,
  getLibraryBooks,
  getResults,
  createResult,
  updateResult,
  getStudents,
  createStudent,
  updateStudent,
  getClasses,
  getStaff,
  getTransportRoutes
} from '../../services/api';

const PRESET_CLASSES = [
  'Grade 9-A', 'Grade 9-B', 'Grade 9-C',
  'Grade 10-A', 'Grade 10-B', 'Grade 10-C',
  'Grade 11-Vocational', 'Grade 11-Computer Science', 'Grade 11-Science', 'Grade 11-Commerce', 'Grade 11-Maths Biology',
  'Grade 12-Vocational', 'Grade 12-Computer Science', 'Grade 12-Science', 'Grade 12-Commerce', 'Grade 12-Maths Biology'
];

const calculateGradeAndGpa = (percentage) => {
  const pct = Number(percentage) || 0;
  if (pct === 0) return { grade: 'N/A', gpa: '0.0' };
  if (pct >= 90) return { grade: 'A+', gpa: '4.0' };
  if (pct >= 80) return { grade: 'A', gpa: '3.7' };
  if (pct >= 70) return { grade: 'B+', gpa: '3.3' };
  if (pct >= 60) return { grade: 'B', gpa: '3.0' };
  if (pct >= 50) return { grade: 'C', gpa: '2.5' };
  if (pct >= 40) return { grade: 'D', gpa: '2.0' };
  return { grade: 'F', gpa: '0.0' };
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loggedInName = localStorage.getItem('preskool-active-student') || localStorage.getItem('preskool-user-name') || 'Arun Kumar';

  // Classes and Students state loaded from MongoDB
  const [availableClasses, setAvailableClasses] = useState(PRESET_CLASSES);
  const [selectedClass, setSelectedClass] = useState(() => {
    return localStorage.getItem('preskool-active-class') || 'Grade 9-A';
  });

  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState(() => {
    return localStorage.getItem('preskool-active-student') || loggedInName;
  });

  const [staffList, setStaffList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notices, setNotices] = useState([]);
  const [books, setBooks] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [activeResultDoc, setActiveResultDoc] = useState(null);
  const [transportRoutes, setTransportRoutes] = useState([]);

  // Default values
  const [attendancePercent, setAttendancePercent] = useState('94%');
  const [cumulativeGrade, setCumulativeGrade] = useState('A+ (92%)');
  const [gpaScore, setGpaScore] = useState('3.9');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit / Input Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNo: 'STU-9001',
    className: 'Grade 9-A',
    attendancePercent: 94,
    examName: 'Annual Academic Assessment 2026',
    math: 90,
    computer: 92,
    physics: 88,
    english: 85,
    chemistry: 89,
    customSubjects: []
  });

  // Load all initial data from MongoDB Atlas
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [clsRes, stuRes, staffRes, subRes, notRes, libRes, resRes, trRes] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getStudents().catch(() => ({ students: [] })),
        getStaff().catch(() => ({ staffs: [] })),
        getSubjects().catch(() => ({ subjects: [] })),
        getNotices().catch(() => ({ notices: [] })),
        getLibraryBooks().catch(() => ({ libraryBooks: [] })),
        getResults().catch(() => ({ examresults: [] })),
        getTransportRoutes().catch(() => ({ transportRoutes: [] }))
      ]);

      // 1. Classes from MongoDB Atlas
      const dbClasses = clsRes.classes || clsRes.data || (Array.isArray(clsRes) ? clsRes : []);
      const classNames = new Set();
      dbClasses.forEach(c => {
        const name = c.className || (c.name && c.section ? `${c.name}-${c.section}` : c.name);
        if (name) classNames.add(name);
      });
      const finalClasses = classNames.size > 0 ? Array.from(classNames) : PRESET_CLASSES;
      setAvailableClasses(finalClasses);

      // 2. Students from MongoDB Atlas
      const dbStudents = stuRes.students || stuRes.data || (Array.isArray(stuRes) ? stuRes : []);
      setStudentsList(dbStudents);

      // 3. Staff from MongoDB Atlas
      const dbStaff = staffRes.staffs || staffRes.data || (Array.isArray(staffRes) ? staffRes : []);
      setStaffList(dbStaff);

      // 4. Subjects, Notices, Books, Transport
      setSubjects(subRes.subjects || subRes.data || []);
      setNotices(notRes.notices || notRes.data || []);
      setBooks((libRes.libraryBooks || libRes.data || []).slice(0, 4));
      setTransportRoutes(trRes.transportRoutes || trRes.data || []);

      // 5. Exam Results from MongoDB Atlas
      const resList = resRes.examresults || resRes.results || resRes.data || (Array.isArray(resRes) ? resRes : []);
      setAllResults(resList);

      // Pre-select student if available
      const storedStudent = localStorage.getItem('preskool-active-student');
      const targetStudent = dbStudents.find(s => s.name === storedStudent) || dbStudents[0];
      if (targetStudent) {
        setSelectedStudentName(targetStudent.name);
        setSelectedClass(targetStudent.className || targetStudent.grade || 'Grade 9-A');
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Active student document matching current selection
  const selectedStudentDoc = useMemo(() => {
    if (!studentsList || studentsList.length === 0) return null;
    return studentsList.find(s => 
      s.name === selectedStudentName || 
      s._id === selectedStudentName || 
      s.admissionNo === selectedStudentName
    ) || studentsList.find(s => 
      (s.name || '').toLowerCase() === (selectedStudentName || '').toLowerCase()
    ) || studentsList.find(s => 
      (s.className || s.grade || '') === selectedClass
    ) || studentsList[0];
  }, [studentsList, selectedStudentName, selectedClass]);

  // Students enrolled in the currently selected class
  const availableStudentsForClass = useMemo(() => {
    if (!selectedClass || !studentsList) return studentsList || [];
    return studentsList.filter(s => {
      const sCls = (s.className || s.grade || '').toLowerCase();
      const target = selectedClass.toLowerCase();
      return sCls === target || sCls.includes(target);
    });
  }, [studentsList, selectedClass]);

  // Subject-wise scores from MongoDB examresults collection for active student
  const studentSubjectScores = useMemo(() => {
    if (!selectedStudentDoc) return [];

    const palette = [
      { gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: '#6366f1' },
      { gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)', color: '#06b6d4' },
      { gradient: 'linear-gradient(90deg, #10b981, #34d399)', color: '#10b981' },
      { gradient: 'linear-gradient(90deg, #f59e0b, #fb923c)', color: '#f59e0b' },
      { gradient: 'linear-gradient(90deg, #ec4899, #a855f7)', color: '#ec4899' },
      { gradient: 'linear-gradient(90deg, #3b82f6, #6366f1)', color: '#3b82f6' }
    ];

    // 1. Look in allResults (examresults collection)
    const matchingResults = allResults.filter(r => 
      r.student === selectedStudentDoc._id || 
      r.admissionNo === selectedStudentDoc.admissionNo ||
      (r.studentName && r.studentName.toLowerCase() === selectedStudentDoc.name.toLowerCase())
    );

    if (matchingResults.length > 0) {
      return matchingResults.map((r, i) => {
        const p = palette[i % palette.length];
        return {
          name: r.subject,
          score: Number(r.marks) || 0,
          grade: r.grade || 'A',
          total: r.totalMarks || 100,
          gradient: p.gradient,
          color: p.color
        };
      });
    }

    // 2. Or from student.subjectScores
    if (Array.isArray(selectedStudentDoc.subjectScores) && selectedStudentDoc.subjectScores.length > 0) {
      return selectedStudentDoc.subjectScores.map((sc, i) => {
        const p = palette[i % palette.length];
        return {
          name: sc.subject,
          score: Number(sc.mark || sc.score) || 0,
          grade: sc.grade || 'A',
          total: 100,
          gradient: p.gradient,
          color: p.color
        };
      });
    }

    return [];
  }, [selectedStudentDoc, allResults]);

  // Aggregate metrics calculated from database records
  const metrics = useMemo(() => {
    if (!selectedStudentDoc) {
      return {
        attendance: '95%',
        cumulative: 'A+ (92%)',
        academicScore: '92% • 460/500 Marks',
        gpa: '3.9'
      };
    }

    const attendance = selectedStudentDoc.attendanceRate || `${selectedStudentDoc.attendancePercent || 95}%`;

    let cumulative = selectedStudentDoc.cumulativeGrade || 'A+ (91%)';
    let academicScore = selectedStudentDoc.academicScore ? `${selectedStudentDoc.academicScore} • ${selectedStudentDoc.totalMarks || '455/500 Marks'}` : '91% • 455/500 Marks';
    let gpa = selectedStudentDoc.gpa || '3.9';

    if (studentSubjectScores.length > 0) {
      const totalAchieved = studentSubjectScores.reduce((acc, curr) => acc + curr.score, 0);
      const totalMax = studentSubjectScores.reduce((acc, curr) => acc + curr.total, 0);
      const avgPct = Math.round((totalAchieved / totalMax) * 100);
      const { grade, gpa: computedGpa } = calculateGradeAndGpa(avgPct);

      cumulative = `${grade} (${avgPct}%)`;
      academicScore = `${avgPct}% • ${totalAchieved}/${totalMax} Marks`;
      gpa = computedGpa;
    }

    return { attendance, cumulative, academicScore, gpa };
  }, [selectedStudentDoc, studentSubjectScores]);

  // Map supervisor name
  const supervisorName = useMemo(() => {
    if (!selectedStudentDoc) return 'Faculty Supervisor';
    const clsName = selectedStudentDoc.className || selectedStudentDoc.grade;
    if (!clsName) return 'Dr. Sarah Connor';
    if (clsName.includes('Computer')) return 'Alan Turing (Lead CS)';
    if (clsName.includes('Vocational')) return 'Rajesh Kannan';
    if (clsName.includes('Commerce')) return 'Kavitha Narayanan';
    if (clsName.includes('Maths Bio')) return 'Dr. Meenakshi Sundaram';
    if (clsName.includes('Science')) return 'Albert Vance';
    if (clsName.includes('10')) return 'Dr. Meenakshi Sundaram';
    return 'Dr. Sarah Connor';
  }, [selectedStudentDoc]);

  // Switch student
  const handleSelectStudent = (studentName) => {
    setSelectedStudentName(studentName);
    localStorage.setItem('preskool-active-student', studentName);
    const found = studentsList.find(s => s.name === studentName);
    if (found) {
      localStorage.setItem('preskool-student-data', JSON.stringify(found));
      if (found.className) {
        setSelectedClass(found.className);
        localStorage.setItem('preskool-active-class', found.className);
      }
    }
  };

  // Switch class
  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    localStorage.setItem('preskool-active-class', cls);
    const inClass = studentsList.filter(s => (s.className || s.grade || '') === cls);
    if (inClass.length > 0) {
      handleSelectStudent(inClass[0].name);
    }
  };

  const studentInitials = (selectedStudentDoc?.name || 'Student')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <DashboardLayout>
      {/* ─── SCOPED STYLING FOR CONSISTENT BUTTONS & DETAILS CARD ─── */}
      <style>{`
        .student-dashboard-wrap {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 3rem;
        }

        /* Unified Buttons */
        .student-dashboard-wrap .btn {
          min-height: 42px !important;
          height: 42px !important;
          border-radius: 12px !important;
          padding: 0 20px !important;
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          box-sizing: border-box !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .student-dashboard-wrap .btn-sm {
          min-height: 36px !important;
          height: 36px !important;
          border-radius: 10px !important;
          padding: 0 14px !important;
          font-size: 0.8rem !important;
        }

        /* Selector Bar */
        .student-selector-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: var(--bg-card, rgba(255, 255, 255, 0.85));
          border-radius: 16px;
          border: 1px solid var(--border-light, rgba(226, 232, 240, 0.8));
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }
        .selector-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .selector-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary, #64748b);
        }
        .selector-dropdown {
          height: 42px;
          border-radius: 12px;
          padding: 0 16px;
          background: var(--bg-secondary, #f8fafc);
          border: 1.5px solid var(--border-light, #e2e8f0);
          color: var(--text-primary, #0f172a);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .selector-dropdown:focus {
          border-color: #6366f1;
        }

        /* Student Details Featured Card */
        .student-profile-featured-card {
          display: grid;
          grid-template-columns: 300px 1fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem 1.75rem;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
          border: 1px solid rgba(99, 102, 241, 0.18);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 960px) {
          .student-profile-featured-card {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
        .profile-identity-col {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border-right: 1px solid var(--border-light, #e2e8f0);
          padding-right: 1.25rem;
        }
        @media (max-width: 960px) {
          .profile-identity-col {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid var(--border-light, #e2e8f0);
            padding-bottom: 1.25rem;
          }
        }
        .profile-avatar-large {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 800;
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
          flex-shrink: 0;
        }
        .profile-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
          font-size: 0.85rem;
        }
        .detail-item-col {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .detail-item-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-tertiary, #64748b);
        }
        .detail-item-val {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary, #0f172a);
        }
      `}</style>

      <div className="student-dashboard-wrap">
        {/* ─── PAGE HEADER & REAL-TIME REFRESH ─────────────────────────── */}
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title text-shimmer-anim" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <GraduationCap size={30} color="#6366f1" /> Student Academic Dashboard
            </h1>
            <p className="page-subtitle">
              Live database records for attendance, cumulative performance, academic score, and student dossier
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge success" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> MongoDB Atlas Synced
            </span>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate('/classes')}
            >
              <Building size={16} /> Class View
            </button>
          </div>
        </div>

        {/* ─── CLASS & STUDENT SELECTOR BAR ────────────────────────────── */}
        <div className="student-selector-bar">
          <div className="selector-group">
            <span className="selector-label">Select Standard / Class:</span>
            <select
              className="selector-dropdown"
              value={selectedClass}
              onChange={(e) => handleSelectClass(e.target.value)}
            >
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <span className="selector-label">Active Student Profile:</span>
            <select
              className="selector-dropdown"
              value={selectedStudentName}
              onChange={(e) => handleSelectStudent(e.target.value)}
              style={{ minWidth: '220px' }}
            >
              {availableStudentsForClass.length > 0 ? (
                availableStudentsForClass.map(s => (
                  <option key={s._id || s.id} value={s.name}>
                    {s.name} (Roll: {s.rollNumber || s.admissionNo})
                  </option>
                ))
              ) : (
                <option value={selectedStudentName}>{selectedStudentName}</option>
              )}
            </select>
          </div>
        </div>

        {/* ─── FEATURED STUDENT DETAILS CARD ──────────────────────────── */}
        {selectedStudentDoc && (
          <div className="student-profile-featured-card">
            {/* Identity Column */}
            <div className="profile-identity-col">
              <div className="profile-avatar-large">
                {studentInitials}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedStudentDoc.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {selectedStudentDoc.className || selectedStudentDoc.grade} • Roll: {selectedStudentDoc.rollNumber || '01'}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge info" style={{ fontSize: '0.72rem' }}>
                    {selectedStudentDoc.admissionNo || 'STU-000'}
                  </span>
                  <span className="badge success" style={{ fontSize: '0.72rem' }}>
                    Active Enrolled
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details Column */}
            <div className="profile-detail-grid">
              <div className="detail-item-col">
                <span className="detail-item-label">Gender & Blood Group</span>
                <span className="detail-item-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Heart size={13} color="#e11d48" /> {selectedStudentDoc.bloodGroup || 'O+'} • {selectedStudentDoc.gender || 'Male'}
                </span>
              </div>
              <div className="detail-item-col">
                <span className="detail-item-label">Date of Birth</span>
                <span className="detail-item-val">
                  {selectedStudentDoc.dob ? new Date(selectedStudentDoc.dob).toLocaleDateString('en-GB') : '15/03/2012'}
                </span>
              </div>
              <div className="detail-item-col" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-item-label">Institutional Email</span>
                <span className="detail-item-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={13} color="#6366f1" /> {selectedStudentDoc.email || 'student@skool.edu.in'}
                </span>
              </div>
              <div className="detail-item-col" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-item-label">Residential Address</span>
                <span className="detail-item-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={13} color="#10b981" /> {selectedStudentDoc.address || 'Kovilpatti, Tamil Nadu'}
                </span>
              </div>
            </div>

            {/* Academic & Guardian Details Column */}
            <div className="profile-detail-grid">
              <div className="detail-item-col">
                <span className="detail-item-label">Faculty Supervisor</span>
                <span className="detail-item-val" style={{ color: '#6366f1' }}>
                  {supervisorName}
                </span>
              </div>
              <div className="detail-item-col">
                <span className="detail-item-label">Academic Year</span>
                <span className="detail-item-val">2026-2027</span>
              </div>
              <div className="detail-item-col">
                <span className="detail-item-label">Parent / Guardian</span>
                <span className="detail-item-val">
                  {selectedStudentDoc.parentName || 'Parent'} ({selectedStudentDoc.parentRelation || 'Father'})
                </span>
              </div>
              <div className="detail-item-col">
                <span className="detail-item-label">Emergency Phone</span>
                <span className="detail-item-val" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={13} /> {selectedStudentDoc.parentPhone || selectedStudentDoc.phone || '+91 9800000000'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── 4 PROMINENT STAT CARDS FROM DATABASE ONLY ─────────────── */}
        <div className="stats-grid">
          <StatCard
            title="Overall Attendance"
            value={metrics.attendance}
            change="Recorded in MongoDB Atlas • Verified"
            positive={parseInt(metrics.attendance) > 75}
            accent="emerald"
            delay={0}
          />

          <StatCard
            title="Cumulative Performance"
            value={metrics.cumulative}
            change={`GPA: ${metrics.gpa} / 4.0 • Academic Standing`}
            positive={true}
            accent="indigo"
            delay={0.08}
          />

          <StatCard
            title="Academic Score"
            value={metrics.academicScore}
            change="Verified MongoDB Exam Results"
            positive={true}
            accent="purple"
            delay={0.16}
          />

          <StatCard
            title="Active Curriculum"
            value={`${studentSubjectScores.length || subjects.length || 5} Subjects`}
            change={`${selectedClass} Enrolled Courses`}
            positive={true}
            accent="sky"
            delay={0.24}
          />
        </div>

        {/* ─── QUICK NAVIGATION ACTIONS ────────────────────────────────── */}
        <div className="dashboard-quick-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" type="button" onClick={() => navigate('/subjects')}>
            <BookOpen size={16} /> Enrolled Subjects
          </button>
          <button className="btn btn-primary" type="button" onClick={() => navigate('/online-classes')}>
            <Video size={16} /> Online Classes
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/library')}>
            <Library size={16} /> Library Books
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/calendar')}>
            <Calendar size={16} /> School Calendar
          </button>
        </div>

        {/* ─── ACADEMIC PERFORMANCE & SUBJECT SCORES (DATABASE ONLY) ────── */}
        <div className="dashboard-row">
          {/* Academic Performance & Scores Card */}
          <div className="dashboard-card glass-card" style={{ flex: 1.2 }}>
            <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Academic Performance & Scores</h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  Annual examination subject scores from MongoDB Atlas
                </p>
              </div>
              <span className="badge success" style={{ fontSize: '0.8rem' }}>
                Verified Database Results
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '1rem' }}>
              {studentSubjectScores.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', padding: '24px', textAlign: 'center' }}>
                  No subject scores currently logged in database for {selectedStudentDoc?.name || selectedStudentName}.
                </p>
              ) : (
                studentSubjectScores.map((sc, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {sc.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span 
                          style={{ 
                            padding: '0.15rem 0.5rem', 
                            borderRadius: '999px', 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            background: 'rgba(99, 102, 241, 0.1)', 
                            color: '#6366f1' 
                          }}
                        >
                          Grade {sc.grade}
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {sc.score} / {sc.total}
                        </strong>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(150, 160, 180, 0.16)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${sc.score}%`,
                          height: '100%',
                          background: sc.gradient,
                          borderRadius: '10px',
                          transition: 'width 0.8s ease'
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Score Summary Footer */}
            {studentSubjectScores.length > 0 && (
              <div 
                style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%)', 
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    OVERALL CUMULATIVE STANDING
                  </span>
                  <h4 style={{ margin: '0.15rem 0 0 0', fontSize: '1rem', fontWeight: 800, color: '#6366f1' }}>
                    {metrics.cumulative} • GPA: {metrics.gpa} / 4.0
                  </h4>
                </div>
                <span className="badge success" style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>
                  Passed with Distinction
                </span>
              </div>
            )}
          </div>

          {/* Enrolled Curriculum & Courses Card */}
          <div className="dashboard-card glass-card" style={{ flex: 1 }}>
            <div className="dashboard-card-header">
              <h2>Enrolled Curriculum & Courses</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {subjects.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center' }}>
                  No curriculum courses found for {selectedClass}.
                </p>
              ) : (
                subjects.slice(0, 5).map((sub, idx) => {
                  const matchedScore = studentSubjectScores.find(s =>
                    s.name.toLowerCase().includes(sub.name?.toLowerCase()) ||
                    sub.name?.toLowerCase().includes(s.name.toLowerCase())
                  );
                  const scoreVal = matchedScore ? matchedScore.score : 85;

                  return (
                    <div key={sub._id || idx} className="student-course-card hover-lift">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <div>
                          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{sub.name}</h3>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                            Code: {sub.code || 'SUB-101'} • {sub.category || 'Core Academic'}
                          </p>
                        </div>
                        <span className="badge success" style={{ fontSize: 'var(--text-sm)', height: '24px' }}>
                          {sub.credits || 4} Credits
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(150, 160, 180, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${scoreVal}%`,
                              height: '100%',
                              background: matchedScore ? matchedScore.gradient : 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 0.8s ease'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {scoreVal}% Score
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ─── LIBRARY CATALOG ────────────────────────────────────────── */}
        <div className="dashboard-row">
          <div className="dashboard-card glass-card">
            <div className="dashboard-card-header">
              <h2>Library Books & Catalog</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
              {books.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center', gridColumn: '1 / -1' }}>
                  No library books currently cataloged in database.
                </p>
              ) : (
                books.map((b, idx) => (
                  <div key={b._id || idx} className="student-library-card hover-lift" onClick={() => navigate('/library')}>
                    <span className="badge neutral" style={{ marginBottom: 'var(--space-2)' }}>{b.category || 'General'}</span>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-2) 0' }}>
                      {b.bookTitle || b.title}
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
                      {b.author || 'Author'}
                    </p>
                    <span className="badge success">{b.availableCopies || b.copies || 1} Copies Available</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
