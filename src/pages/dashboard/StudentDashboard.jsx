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
  GraduationCap
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { useToast } from '../../components/common/ToastContext';
import './StudentAcademicModal.css';
import {
  getSubjects,
  getNotices,
  getLibraryBooks,
  getAttendance,
  getResults,
  createResult,
  updateResult,
  getStudents,
  createStudent,
  updateStudent,
  getClasses,
  getTransportRoutes
} from '../../services/api';

const DEFAULT_SUBJECT_TEMPLATES = [
  { name: 'Mathematics', code: 'MATH-101', credits: 4, gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
  { name: 'Computer Science', code: 'CS-201', credits: 4, gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)' },
  { name: 'Physics', code: 'PHY-102', credits: 3, gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
  { name: 'English', code: 'ENG-101', credits: 3, gradient: 'linear-gradient(90deg, #f59e0b, #fb923c)' },
  { name: 'Chemistry', code: 'CHEM-103', credits: 3, gradient: 'linear-gradient(90deg, #ec4899, #a855f7)' }
];

const PRESET_CLASSES = [
  'Grade 9-A', 'Grade 9-B', 'Grade 9-C',
  'Grade 10-A', 'Grade 10-B', 'Grade 10-C',
  'Grade 11-Vocational', 'Grade 11-Computer Science', 'Grade 11-Science', 'Grade 11-Commerce', 'Grade 11-Maths Biology'
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

  const loggedInName = localStorage.getItem('skool-user-name') || 'Student';
  const loggedInEmail = localStorage.getItem('skool-email') || '';

  // Class and Student selector state
  const [availableClasses, setAvailableClasses] = useState(PRESET_CLASSES);
  const [selectedClass, setSelectedClass] = useState(() => {
    return localStorage.getItem('preskool-active-class') || 'Class 10-A';
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState(() => {
    return localStorage.getItem('preskool-active-student') || loggedInName;
  });

  // DB data states - strictly initialized to 0 defaults
  const [subjects, setSubjects] = useState([]);
  const [notices, setNotices] = useState([]);
  const [books, setBooks] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [activeResultDoc, setActiveResultDoc] = useState(null);
  const [transportRoutes, setTransportRoutes] = useState([]);

  // Student metrics - default strictly to 0
  const [attendancePercent, setAttendancePercent] = useState('0%');
  const [cumulativeGrade, setCumulativeGrade] = useState('N/A (0%)');
  const [gpaScore, setGpaScore] = useState('0.0');
  const [subjectScores, setSubjectScores] = useState([
    { name: 'Mathematics', score: 0, gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
    { name: 'Computer Science', score: 0, gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)' },
    { name: 'Physics', score: 0, gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
    { name: 'English', score: 0, gradient: 'linear-gradient(90deg, #f59e0b, #fb923c)' },
    { name: 'Chemistry', score: 0, gradient: 'linear-gradient(90deg, #ec4899, #a855f7)' }
  ]);

  const [hasDbRecord, setHasDbRecord] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit / Input Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNo: 'STU-101',
    className: 'Class 10-A',
    attendancePercent: 0,
    examName: 'Mid-Term Assessment 2026',
    math: 0,
    computer: 0,
    physics: 0,
    english: 0,
    chemistry: 0,
    customSubjects: []
  });

  // Load all initial data from MongoDB
  useEffect(() => {
    fetchInitialData();
  }, []);

  // When selected student or class changes, recalculate from DB results
  useEffect(() => {
    localStorage.setItem('preskool-active-class', selectedClass);
    localStorage.setItem('preskool-active-student', selectedStudentName);
    applyStudentDataForSelection(allResults, selectedStudentName, selectedClass);
  }, [selectedStudentName, selectedClass, allResults]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [clsRes, stuRes, subRes, notRes, libRes, resRes, trRes] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getStudents().catch(() => ({ students: [] })),
        getSubjects().catch(() => ({ subjects: [] })),
        getNotices().catch(() => ({ notices: [] })),
        getLibraryBooks().catch(() => ({ libraryBooks: [] })),
        getResults().catch(() => ({ examresults: [] })),
        getTransportRoutes().catch(() => ({ transportRoutes: [] }))
      ]);

      // 1. Process Classes strictly from database
      const dbClasses = clsRes.classes || (Array.isArray(clsRes) ? clsRes : []);
      const classNames = new Set();
      dbClasses.forEach(c => {
        const name = c.className || (c.name && c.section ? `${c.name}-${c.section}` : c.name);
        if (name) classNames.add(name);
      });
      const finalClasses = classNames.size > 0 ? Array.from(classNames) : PRESET_CLASSES;
      setAvailableClasses(finalClasses);

      // Auto-correct selectedClass if needed
      setSelectedClass(prev => {
        if (!prev || prev.startsWith('Class ') || !finalClasses.includes(prev)) {
          return finalClasses[0] || 'Grade 10-A';
        }
        return prev;
      });

      // 2. Process Students strictly from database
      const dbStudents = stuRes.students || (Array.isArray(stuRes) ? stuRes : []);
      const studentNameSet = new Set();
      dbStudents.forEach(s => {
        const sName = s.name || s.user?.name;
        if (sName) studentNameSet.add(sName);
      });

      if (studentNameSet.size === 0) {
        if (loggedInName) studentNameSet.add(loggedInName);
      }

      const finalStudents = Array.from(studentNameSet);
      setAvailableStudents(finalStudents);

      // Default student if needed
      setSelectedStudentName(prev => {
        if (!prev || !finalStudents.includes(prev)) {
          return finalStudents[0] || loggedInName;
        }
        return prev;
      });

      // 3. Process Subjects, Notices, Books, Transport
      const subList = subRes.subjects || (Array.isArray(subRes) ? subRes : []);
      const notList = notRes.notices || (Array.isArray(notRes) ? notRes : []);
      const bookList = libRes.libraryBooks || (Array.isArray(libRes) ? libRes : []);
      const trList = trRes.transportRoutes || trRes['transport-routes'] || trRes.transportroutes || trRes.data || (Array.isArray(trRes) ? trRes : []);

      setSubjects(subList.length > 0 ? subList : DEFAULT_SUBJECT_TEMPLATES);
      setNotices(notList);
      setBooks(bookList.slice(0, 4));
      setTransportRoutes(trList);

      // 4. Process Results (DB Exam Results)
      const resList = resRes.examresults || resRes.results || (Array.isArray(resRes) ? resRes : []);
      setAllResults(resList);
      applyStudentDataForSelection(resList, selectedStudentName, selectedClass);
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and apply database records for the chosen student & class
  const applyStudentDataForSelection = (resultsList, stuName, clsName) => {
    if (!resultsList || resultsList.length === 0) {
      resetToZeroDefaults();
      return;
    }

    const cleanStu = (stuName || '').trim().toLowerCase();
    const cleanCls = (clsName || '').trim().toLowerCase().replace(/^class\s*/i, '');

    // Look for exact or fuzzy match in DB examresults
    const match = resultsList.find(r => {
      const rStu = (r.studentName || r.name || r.student?.name || '').toLowerCase();
      const rCls = (r.className || r.class?.name || '').toLowerCase().replace(/^class\s*/i, '');
      const studentMatches = rStu.includes(cleanStu) || cleanStu.includes(rStu);
      const classMatches = !rCls || rCls.includes(cleanCls) || cleanCls.includes(rCls);
      return studentMatches && classMatches;
    }) || resultsList.find(r => {
      const rStu = (r.studentName || r.name || r.student?.name || '').toLowerCase();
      return rStu.includes(cleanStu) || cleanStu.includes(rStu);
    });

    if (match) {
      // Record found in DB!
      setActiveResultDoc(match);
      setHasDbRecord(true);

      const att = match.attendancePercent !== undefined && match.attendancePercent !== null
        ? String(match.attendancePercent).includes('%') ? match.attendancePercent : `${match.attendancePercent}%`
        : '0%';
      setAttendancePercent(att);

      const grade = match.grade || 'N/A';
      const pct = match.percentage ? (String(match.percentage).includes('%') ? match.percentage : `${match.percentage}%`) : '0%';
      setCumulativeGrade(`${grade} (${pct})`);
      setGpaScore(match.gpa ? String(match.gpa) : '0.0');

      // Populate subject scores from DB
      const scores = [
        { name: 'Mathematics', score: Number(match.math) || 0, gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
        { name: 'Computer Science', score: Number(match.computer) || 0, gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)' },
        { name: 'Physics', score: Number(match.physics) || 0, gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
        { name: 'English', score: Number(match.english) || 0, gradient: 'linear-gradient(90deg, #f59e0b, #fb923c)' },
        { name: 'Chemistry', score: Number(match.chemistry) || 0, gradient: 'linear-gradient(90deg, #ec4899, #a855f7)' }
      ];

      // Add any custom stored subjects
      if (Array.isArray(match.customSubjects)) {
        match.customSubjects.forEach((cs, i) => {
          scores.push({
            name: cs.name || `Subject ${i + 1}`,
            score: Number(cs.score) || 0,
            gradient: 'linear-gradient(90deg, #8b5cf6, #ec4899)'
          });
        });
      }

      setSubjectScores(scores);
    } else {
      // No DB record found for this student and class: strictly default to 0
      resetToZeroDefaults();
    }
  };

  const resetToZeroDefaults = () => {
    setActiveResultDoc(null);
    setHasDbRecord(false);
    setAttendancePercent('0%');
    setCumulativeGrade('N/A (0%)');
    setGpaScore('0.0');
    setSubjectScores([
      { name: 'Mathematics', score: 0, gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
      { name: 'Computer Science', score: 0, gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)' },
      { name: 'Physics', score: 0, gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
      { name: 'English', score: 0, gradient: 'linear-gradient(90deg, #f59e0b, #fb923c)' },
      { name: 'Chemistry', score: 0, gradient: 'linear-gradient(90deg, #ec4899, #a855f7)' }
    ]);
  };

  // Open modal and pre-fill with current values
  const handleOpenEditModal = () => {
    const attNum = parseInt(attendancePercent.replace(/[^0-9]/g, '')) || 0;
    const mathScore = subjectScores.find(s => s.name === 'Mathematics')?.score || 0;
    const compScore = subjectScores.find(s => s.name === 'Computer Science')?.score || 0;
    const phyScore = subjectScores.find(s => s.name === 'Physics')?.score || 0;
    const engScore = subjectScores.find(s => s.name === 'English')?.score || 0;
    const chemScore = subjectScores.find(s => s.name === 'Chemistry')?.score || 0;

    // Custom subjects (outside the 5 defaults)
    const custom = subjectScores
      .filter(s => !['Mathematics', 'Computer Science', 'Physics', 'English', 'Chemistry'].includes(s.name))
      .map(s => ({ name: s.name, score: s.score }));

    setFormData({
      studentName: selectedStudentName,
      admissionNo: activeResultDoc?.admissionNo || `STU-${Math.floor(100 + Math.random() * 900)}`,
      className: selectedClass,
      attendancePercent: attNum,
      examName: activeResultDoc?.examName || 'Mid-Term Assessment 2026',
      math: mathScore,
      computer: compScore,
      physics: phyScore,
      english: engScore,
      chemistry: chemScore,
      customSubjects: custom
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('score') || ['math', 'computer', 'physics', 'english', 'chemistry', 'attendancePercent'].includes(name)
        ? Math.max(0, Math.min(100, Number(value) || 0))
        : value
    }));
  };

  const handleCustomSubjectChange = (index, field, val) => {
    setFormData(prev => {
      const list = [...prev.customSubjects];
      list[index] = {
        ...list[index],
        [field]: field === 'score' ? Math.max(0, Math.min(100, Number(val) || 0)) : val
      };
      return { ...prev, customSubjects: list };
    });
  };

  const handleAddCustomSubject = () => {
    setFormData(prev => ({
      ...prev,
      customSubjects: [...prev.customSubjects, { name: '', score: 0 }]
    }));
  };

  const handleRemoveCustomSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      customSubjects: prev.customSubjects.filter((_, i) => i !== index)
    }));
  };

  // Live computed metrics for modal preview
  const modalComputed = useMemo(() => {
    const scores = [
      Number(formData.math) || 0,
      Number(formData.computer) || 0,
      Number(formData.physics) || 0,
      Number(formData.english) || 0,
      Number(formData.chemistry) || 0,
      ...formData.customSubjects.map(cs => Number(cs.score) || 0)
    ];
    const total = scores.reduce((sum, s) => sum + s, 0);
    const avg = scores.length > 0 ? Math.round(total / scores.length) : 0;
    const { grade, gpa } = calculateGradeAndGpa(avg);
    return { avg, grade, gpa };
  }, [formData]);

  // Save the inputted values directly to MongoDB Database
  const handleSaveToDb = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const calculatedPct = `${modalComputed.avg}%`;
      const calculatedGrade = modalComputed.grade;
      const calculatedGpa = modalComputed.gpa;

      const payload = {
        studentName: formData.studentName.trim(),
        name: formData.studentName.trim(),
        admissionNo: formData.admissionNo.trim(),
        className: formData.className.trim(),
        examName: formData.examName.trim() || 'Academic Assessment',
        math: Number(formData.math) || 0,
        computer: Number(formData.computer) || 0,
        physics: Number(formData.physics) || 0,
        english: Number(formData.english) || 0,
        chemistry: Number(formData.chemistry) || 0,
        customSubjects: formData.customSubjects.filter(cs => cs.name.trim() !== ''),
        attendancePercent: `${formData.attendancePercent}%`,
        percentage: calculatedPct,
        grade: calculatedGrade,
        gpa: calculatedGpa,
        updatedAt: new Date()
      };

      let savedRecord = null;
      if (activeResultDoc && activeResultDoc._id) {
        // Update existing DB record
        await updateResult(activeResultDoc._id, payload);
        savedRecord = { ...activeResultDoc, ...payload };
        showToast(`Updated academic record for ${payload.studentName} in MongoDB!`, 'success');
      } else {
        // Create new record in examresults in MongoDB
        const createRes = await createResult(payload);
        savedRecord = createRes.item || createRes;
        showToast(`Created new academic record for ${payload.studentName} in MongoDB!`, 'success');
      }

      // Also ensure student document exists/updates in students collection
      try {
        await createStudent({
          name: payload.studentName,
          admissionNo: payload.admissionNo,
          className: payload.className,
          attendancePercent: payload.attendancePercent,
          gpa: payload.gpa,
          grade: payload.grade,
          gender: 'Not Specified'
        });
      } catch (stuErr) {
        // Non-critical if student already exists
      }

      // Update local state and active student/class
      setSelectedStudentName(payload.studentName);
      setSelectedClass(payload.className);

      // Re-fetch latest from DB
      const resRes = await getResults().catch(() => ({ examresults: [] }));
      const resList = resRes.examresults || resRes.results || (Array.isArray(resRes) ? resRes : []);
      setAllResults(resList);
      applyStudentDataForSelection(resList, payload.studentName, payload.className);

      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save academic data to DB:', err);
      showToast(err.message || 'Failed to save to database. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="page-title text-shimmer-anim">Student Academic Portal</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{selectedStudentName}</strong>! {selectedClass} Academic Portal
          </p>
        </div>

        {/* Action Button to Enter / Update DB details */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenEditModal}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)' }}
          >
            <Edit3 size={16} /> Enter / Update Academic Data
          </button>
        </div>
      </div>

      {/* Stats Grid - All values default to 0 if not stored in DB */}
      <div className="stats-grid">
        <div style={{ cursor: 'pointer' }} onClick={handleOpenEditModal} title="Click to input or edit attendance">
          <StatCard
            title="Overall Attendance"
            value={attendancePercent}
            change={hasDbRecord ? "Recorded in MongoDB" : "Default 0% (Click to enter)"}
            positive={parseInt(attendancePercent) > 75}
            accent="emerald"
            delay={0}
          />
        </div>

        <div style={{ cursor: 'pointer' }} onClick={handleOpenEditModal} title="Click to input or edit performance">
          <StatCard
            title="Cumulative Performance"
            value={cumulativeGrade}
            change={hasDbRecord ? `GPA: ${gpaScore} / 4.0` : "Default 0% (Click to enter)"}
            positive={cumulativeGrade !== 'N/A (0%)'}
            accent="indigo"
            delay={0.08}
          />
        </div>

        <StatCard
          title="Active Curriculum"
          value={`${subjects.length} Subjects`}
          change={`${selectedClass} Term Courses`}
          positive={true}
          accent="sky"
          delay={0.16}
        />

        <StatCard
          title="Circulars & Notices"
          value={`${notices.length} Published`}
          change="Campus Announcements"
          positive={true}
          accent="amber"
          delay={0.24}
        />
      </div>

      {/* Quick Navigation Actions */}
      <div className="dashboard-quick-actions" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
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

      {/* Enrolled Courses & Mid-Term Scores Rows */}
      <div className="dashboard-row">
        {/* Enrolled Courses Card */}
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Enrolled Curriculum & Courses</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {subjects.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center' }}>
                No curriculum courses found for {selectedClass}.
              </p>
            ) : subjects.map((sub, idx) => {
              const matchedScore = subjectScores.find(s =>
                s.name.toLowerCase().includes(sub.name?.toLowerCase()) ||
                sub.name?.toLowerCase().includes(s.name.toLowerCase())
              );
              // Default to 0 if not stored in DB
              const scoreVal = matchedScore ? matchedScore.score : 0;

              return (
                <div key={sub._id || idx} className="student-course-card hover-lift" onClick={handleOpenEditModal} title="Click to update score">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{sub.name}</h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        Code: {sub.code || 'SUB-101'} • {sub.category || 'Academic'}
                      </p>
                    </div>
                    <span className="badge success" style={{ fontSize: 'var(--text-sm)', height: '24px' }}>
                      {sub.credits || 3} Credits
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ flex: 1, height: '8px', background: 'rgba(150, 160, 180, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        className="course-progress-bar"
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
            })}
          </div>
        </div>

        {/* Subject Scores Card */}
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Academic Performance & Scores</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {subjectScores.map((sc, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{sc.name}</span>
                  <strong>{sc.score} / 100</strong>
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
            ))}
          </div>

          {!hasDbRecord && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(234, 179, 8, 0.08)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(234, 179, 8, 0.25)', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#eab308' }}>
                Default values are set to 0. Click <strong>"Edit Scores"</strong> to enter marks and store them directly in the MongoDB database.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Library Books Row */}
      <div className="dashboard-row" style={{ marginTop: 'var(--space-6)' }}>
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Library Books & Catalog</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            {books.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center', gridColumn: '1 / -1' }}>
                No library books currently cataloged in database.
              </p>
            ) : books.map((b, idx) => (
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
            ))}
          </div>
        </div>
      </div>
      {/* Transport Routes Row */}
      <div className="dashboard-row" style={{ marginTop: 'var(--space-6)' }}>
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Transport Routes & Connections</h2>
          </div>
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
            <table className="table w-full text-sm">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
                <tr>
                  <th className="text-left font-semibold pb-3 pt-2 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)] px-4">Destination</th>
                  <th className="text-left font-semibold pb-3 pt-2 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)] px-4">Approx. Route / Connection</th>
                  <th className="text-left font-semibold pb-3 pt-2 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)] px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {transportRoutes.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-tertiary)' }}>No transport routes loaded</td></tr>
                ) : transportRoutes.map((item, idx) => (
                  <tr key={item._id || idx} className="border-b border-[rgba(150,160,180,0.05)] hover:bg-[rgba(150,160,180,0.03)] transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{item.destination}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{item.route}</td>
                    <td className="py-3 px-4">
                      <span className="badge" style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: '#818cf8', fontWeight: 500 }}>
                        {item.notes || 'Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ULTRA-PREMIUM GLASS THEME ACADEMIC MODAL POPUP (MongoDB)  */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div
          className="student-glass-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="student-glass-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Lighting Orbs */}
            <div className="student-glass-orb student-orb-top" />
            <div className="student-glass-orb student-orb-bottom" />

            {/* Modal Header */}
            <div className="student-glass-header">
              <div className="student-header-title-box">
                <div className="student-header-badge-icon">
                  <GraduationCap size={22} />
                </div>
                <div className="student-header-text">
                  <h2>Academic Record & Assessment</h2>
                  <p>Input & synchronize student marks, attendance, and exam assessment with MongoDB</p>
                </div>
              </div>
              <button
                type="button"
                className="student-glass-close-btn"
                onClick={() => setIsModalOpen(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveToDb} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="student-glass-body">

                {/* 1. Student Identity Card */}
                <div className="student-glass-section-card">
                  <div className="student-section-header-row">
                    <span className="student-section-tag">
                      <UserCheck size={14} /> Student Identity & Classroom
                    </span>
                    <span className="student-section-hint">Synced per student & class</span>
                  </div>

                  <div className="student-glass-grid-2">
                    <div className="student-glass-field">
                      <label className="student-glass-label">Student Name</label>
                      <input
                        type="text"
                        name="studentName"
                        required
                        className="student-glass-input"
                        placeholder="e.g. Sudhan"
                        value={formData.studentName}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="student-glass-field">
                      <label className="student-glass-label">Class & Section</label>
                      <input
                        type="text"
                        name="className"
                        required
                        className="student-glass-input"
                        placeholder="e.g. Class 10-A"
                        value={formData.className}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="student-glass-field">
                      <label className="student-glass-label">Roll / Admission Number</label>
                      <input
                        type="text"
                        name="admissionNo"
                        required
                        className="student-glass-input"
                        placeholder="e.g. STU-101"
                        value={formData.admissionNo}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="student-glass-field">
                      <label className="student-glass-label">Examination / Term Name</label>
                      <input
                        type="text"
                        name="examName"
                        className="student-glass-input"
                        placeholder="e.g. Mid-Term Assessment 2026"
                        value={formData.examName}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Attendance Metric Card */}
                <div className="student-glass-section-card">
                  <div className="student-section-header-row">
                    <span className="student-section-tag" style={{ color: '#10b981' }}>
                      <CheckCircle2 size={14} /> Overall Attendance Rate
                    </span>
                    <span className="student-attendance-badge">
                      {formData.attendancePercent}%
                    </span>
                  </div>

                  <div className="student-attendance-control">
                    <input
                      type="range"
                      name="attendancePercent"
                      min="0"
                      max="100"
                      value={formData.attendancePercent}
                      onChange={handleFormChange}
                      className="student-glass-range"
                    />
                    <div className="student-range-ticks">
                      <span>0% (Absent / No Data)</span>
                      <span>50% (Average)</span>
                      <span>75% (Standard)</span>
                      <span>100% (Exemplary)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Subject Marks Matrix Card */}
                <div className="student-glass-section-card">
                  <div className="student-section-header-row">
                    <span className="student-section-tag" style={{ color: '#6366f1' }}>
                      <Award size={14} /> Subject Scores & Performance (Out of 100)
                    </span>
                    <span className="student-section-hint">Default is 0 until inputted</span>
                  </div>

                  <div className="student-subject-matrix">
                    {/* Mathematics */}
                    <div className="student-subject-mini-card">
                      <div className="student-subject-title-row">
                        <span className="student-subject-name" title="Mathematics">Mathematics</span>
                        <div className="student-subject-dot" style={{ background: '#6366f1' }} />
                      </div>
                      <div className="student-subject-input-box">
                        <input
                          type="number"
                          name="math"
                          min="0"
                          max="100"
                          className="student-subject-input"
                          value={formData.math}
                          onChange={handleFormChange}
                        />
                        <span className="student-subject-max">/100</span>
                      </div>
                      <div className="student-subject-mini-bar">
                        <div
                          className="student-subject-mini-fill"
                          style={{ width: `${formData.math}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                        />
                      </div>
                    </div>

                    {/* Computer Science */}
                    <div className="student-subject-mini-card">
                      <div className="student-subject-title-row">
                        <span className="student-subject-name" title="Computer Science">Computer</span>
                        <div className="student-subject-dot" style={{ background: '#06b6d4' }} />
                      </div>
                      <div className="student-subject-input-box">
                        <input
                          type="number"
                          name="computer"
                          min="0"
                          max="100"
                          className="student-subject-input"
                          value={formData.computer}
                          onChange={handleFormChange}
                        />
                        <span className="student-subject-max">/100</span>
                      </div>
                      <div className="student-subject-mini-bar">
                        <div
                          className="student-subject-mini-fill"
                          style={{ width: `${formData.computer}%`, background: 'linear-gradient(90deg, #06b6d4, #38bdf8)' }}
                        />
                      </div>
                    </div>

                    {/* Physics */}
                    <div className="student-subject-mini-card">
                      <div className="student-subject-title-row">
                        <span className="student-subject-name" title="Physics">Physics</span>
                        <div className="student-subject-dot" style={{ background: '#10b981' }} />
                      </div>
                      <div className="student-subject-input-box">
                        <input
                          type="number"
                          name="physics"
                          min="0"
                          max="100"
                          className="student-subject-input"
                          value={formData.physics}
                          onChange={handleFormChange}
                        />
                        <span className="student-subject-max">/100</span>
                      </div>
                      <div className="student-subject-mini-bar">
                        <div
                          className="student-subject-mini-fill"
                          style={{ width: `${formData.physics}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}
                        />
                      </div>
                    </div>

                    {/* English */}
                    <div className="student-subject-mini-card">
                      <div className="student-subject-title-row">
                        <span className="student-subject-name" title="English">English</span>
                        <div className="student-subject-dot" style={{ background: '#f59e0b' }} />
                      </div>
                      <div className="student-subject-input-box">
                        <input
                          type="number"
                          name="english"
                          min="0"
                          max="100"
                          className="student-subject-input"
                          value={formData.english}
                          onChange={handleFormChange}
                        />
                        <span className="student-subject-max">/100</span>
                      </div>
                      <div className="student-subject-mini-bar">
                        <div
                          className="student-subject-mini-fill"
                          style={{ width: `${formData.english}%`, background: 'linear-gradient(90deg, #f59e0b, #fb923c)' }}
                        />
                      </div>
                    </div>

                    {/* Chemistry */}
                    <div className="student-subject-mini-card">
                      <div className="student-subject-title-row">
                        <span className="student-subject-name" title="Chemistry">Chemistry</span>
                        <div className="student-subject-dot" style={{ background: '#ec4899' }} />
                      </div>
                      <div className="student-subject-input-box">
                        <input
                          type="number"
                          name="chemistry"
                          min="0"
                          max="100"
                          className="student-subject-input"
                          value={formData.chemistry}
                          onChange={handleFormChange}
                        />
                        <span className="student-subject-max">/100</span>
                      </div>
                      <div className="student-subject-mini-bar">
                        <div
                          className="student-subject-mini-fill"
                          style={{ width: `${formData.chemistry}%`, background: 'linear-gradient(90deg, #ec4899, #a855f7)' }}
                        />
                      </div>
                    </div>

                    {/* Custom Dynamic Subjects */}
                    {formData.customSubjects.map((cs, idx) => (
                      <div key={idx} className="student-subject-mini-card" style={{ borderStyle: 'dashed' }}>
                        <div className="student-subject-title-row">
                          <input
                            type="text"
                            placeholder="Subject"
                            className="student-glass-input"
                            style={{ padding: '2px 4px', fontSize: '0.75rem', width: '80px' }}
                            value={cs.name}
                            onChange={(e) => handleCustomSubjectChange(idx, 'name', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomSubject(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="student-subject-input-box">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="student-subject-input"
                            value={cs.score}
                            onChange={(e) => handleCustomSubjectChange(idx, 'score', e.target.value)}
                          />
                          <span className="student-subject-max">/100</span>
                        </div>
                        <div className="student-subject-mini-bar">
                          <div
                            className="student-subject-mini-fill"
                            style={{ width: `${cs.score}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={handleAddCustomSubject}
                      style={{ fontSize: '0.785rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '10px' }}
                    >
                      <Plus size={14} /> Add Additional Subject
                    </button>
                  </div>
                </div>

                {/* 4. Live Performance Preview Widget */}
                <div className="student-glass-summary-card">
                  <div className="student-summary-item">
                    <span className="student-summary-label">Average Score</span>
                    <span className="student-summary-val" style={{ color: '#6366f1' }}>
                      {modalComputed.avg}%
                    </span>
                  </div>

                  <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.15)' }} />

                  <div className="student-summary-item">
                    <span className="student-summary-label">Computed Grade</span>
                    <span className="student-summary-grade-badge">
                      {modalComputed.grade}
                    </span>
                  </div>

                  <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.15)' }} />

                  <div className="student-summary-item">
                    <span className="student-summary-label">GPA Scale</span>
                    <span className="student-summary-val" style={{ color: '#0ea5e9' }}>
                      {modalComputed.gpa} <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/ 4.0</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="student-glass-footer">
                <button
                  type="button"
                  className="student-btn-glass-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="student-btn-glass-submit"
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Writing to MongoDB...' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
