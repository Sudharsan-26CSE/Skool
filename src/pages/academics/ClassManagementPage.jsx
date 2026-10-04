import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Plus, Users, Search, GraduationCap, Layers, BookOpen, 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Award, X, 
  Eye, CheckCircle2, User, Building, Heart, Sparkles
} from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getClasses, getStudents, getStaff } from '../../services/api';

const ClassManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [classList, setClassList] = useState([]);
  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Grade selection: 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  const [selectedGrade, setSelectedGrade] = useState('Grade 9');
  // Section or Group selection: 'ALL', or specific section 'A', 'B', 'C' / group 'Computer Science', etc.
  const [selectedSubTab, setSelectedSubTab] = useState('ALL');
  // Search query for students inside the class
  const [searchQuery, setSearchQuery] = useState('');
  // Selected student for details modal
  const [selectedStudent, setSelectedStudent] = useState(null);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, studentRes, staffRes] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getStudents().catch(() => ({ students: [] })),
        getStaff().catch(() => ({ staffs: [] }))
      ]);

      const rawClasses = classRes.classes || classRes.data || (Array.isArray(classRes) ? classRes : []);
      const rawStudents = studentRes.students || studentRes.data || (Array.isArray(studentRes) ? studentRes : []);
      const rawStaff = staffRes.staffs || staffRes.data || (Array.isArray(staffRes) ? staffRes : []);

      setClassList(rawClasses);
      setStudents(rawStudents);
      setStaffList(rawStaff);
    } catch (err) {
      showToast('Failed to load class data from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper: map teacher identifier to teacher's full name
  const getTeacherName = (teacherRef) => {
    if (!teacherRef) return 'Assigned Faculty';
    if (typeof teacherRef === 'object' && teacherRef.name) return teacherRef.name;
    const found = staffList.find(s => s._id === teacherRef || s.id === teacherRef);
    if (found) return found.name || `${found.user?.firstName || ''} ${found.user?.lastName || ''}`.trim();
    
    const knownMap = {
      'staff_sarah': 'Dr. Sarah Connor',
      'staff_alan': 'Alan Turing (Lead CS)',
      'staff_albert': 'Albert Vance (Assoc. Prof)',
      'staff_meena': 'Dr. Meenakshi Sundaram',
      'staff_ravi': 'Ravi Chandran',
      'staff_priya_t': 'Priya Tamilselvi',
      'staff_rajesh': 'Rajesh Kannan (Vocational)',
      'staff_kavitha': 'Kavitha Narayanan (Commerce)'
    };
    return knownMap[teacherRef] || teacherRef;
  };

  // Standard ordered grades: 9th Class, 10th Class, 11th Class, 12th Class
  const GRADE_CONFIGS = [
    {
      id: 'Grade 9',
      displayName: '9th Class',
      subTitle: 'Secondary School',
      isGroupBased: false,
      sections: ['A', 'B', 'C'],
      color: '#3b82f6',
      badgeClass: 'badge-blue'
    },
    {
      id: 'Grade 10',
      displayName: '10th Class',
      subTitle: 'Secondary School Board',
      isGroupBased: false,
      sections: ['A', 'B', 'C'],
      color: '#06b6d4',
      badgeClass: 'badge-cyan'
    },
    {
      id: 'Grade 11',
      displayName: '11th Class',
      subTitle: 'Higher Secondary – 1st Year',
      isGroupBased: true,
      groups: ['Vocational', 'Computer Science', 'Science', 'Commerce', 'Maths Biology'],
      color: '#8b5cf6',
      badgeClass: 'badge-purple'
    },
    {
      id: 'Grade 12',
      displayName: '12th Class',
      subTitle: 'Higher Secondary – Final Board',
      isGroupBased: true,
      groups: ['Vocational', 'Computer Science', 'Science', 'Commerce', 'Maths Biology'],
      color: '#ec4899',
      badgeClass: 'badge-pink'
    }
  ];

  // Current active grade configuration
  const activeGradeConfig = GRADE_CONFIGS.find(g => g.id === selectedGrade) || GRADE_CONFIGS[0];

  // Filter students for the current grade
  const gradeStudents = useMemo(() => {
    return students.filter(stu => {
      const sGrade = (stu.grade || stu.class?.name || stu.className || '').toLowerCase();
      const targetGrade = selectedGrade.toLowerCase();
      
      // Match exact grade name or numeric grade (9, 10, 11, 12)
      if (sGrade.includes(targetGrade)) return true;
      const gradeNum = selectedGrade.match(/\d+/)?.[0];
      const stuGradeNum = sGrade.match(/\d+/)?.[0];
      return gradeNum && stuGradeNum && gradeNum === stuGradeNum;
    });
  }, [students, selectedGrade]);

  // Filter students by active section or stream group
  const filteredStudents = useMemo(() => {
    return gradeStudents.filter(stu => {
      // 1. Sub-tab filter (Section or Group)
      if (selectedSubTab !== 'ALL') {
        const target = selectedSubTab.toLowerCase().trim();
        const sSec = (stu.section || stu.class?.section || '').toLowerCase().trim();
        const sClassName = (stu.className || (typeof stu.class === 'object' ? stu.class?.className : '') || '').toLowerCase();
        
        const matchesSection = sSec === target || sClassName.includes(target);
        if (!matchesSection) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (stu.name || stu.user?.name || '').toLowerCase();
        const roll = (stu.rollNumber || stu.admissionNo || stu.admissionNumber || '').toLowerCase();
        const email = (stu.email || stu.user?.email || '').toLowerCase();
        const phone = (stu.phone || stu.parentPhone || '').toLowerCase();
        return name.includes(q) || roll.includes(q) || email.includes(q) || phone.includes(q);
      }

      return true;
    });
  }, [gradeStudents, selectedSubTab, searchQuery]);

  // Find class document matching current grade and section/group
  const activeClassDoc = useMemo(() => {
    if (selectedSubTab === 'ALL') {
      return classList.find(c => c.name === selectedGrade) || null;
    }
    return classList.find(c => {
      const nameMatch = c.name === selectedGrade;
      const secMatch = (c.section || '').toLowerCase() === selectedSubTab.toLowerCase() ||
                       (c.className || '').toLowerCase().includes(selectedSubTab.toLowerCase());
      return nameMatch && secMatch;
    }) || null;
  }, [classList, selectedGrade, selectedSubTab]);

  // Count students in a specific section or group
  const getSubCount = (subItem) => {
    const target = subItem.toLowerCase().trim();
    return gradeStudents.filter(stu => {
      const sSec = (stu.section || stu.class?.section || '').toLowerCase().trim();
      const sClassName = (stu.className || (typeof stu.class === 'object' ? stu.class?.className : '') || '').toLowerCase();
      return sSec === target || sClassName.includes(target);
    }).length;
  };

  return (
    <DashboardLayout>
      {/* ─── SCOPED STYLES FOR CLASS VIEW & MODAL ───────────────────────── */}
      <style>{`
        .class-view-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 3rem;
        }

        /* Top Grade Tabs */
        .grade-tabs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }
        .grade-tab-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 1.25rem 1.5rem;
          border-radius: 16px;
          background: var(--bg-card, rgba(255, 255, 255, 0.7));
          border: 1.5px solid var(--border-light, rgba(255, 255, 255, 0.2));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }
        .grade-tab-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
        }
        .grade-tab-card.active {
          border-color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.18);
        }
        .grade-tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .grade-tab-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary, #0f172a);
          margin: 0;
        }
        .grade-tab-sub {
          font-size: 0.8rem;
          color: var(--text-tertiary, #64748b);
          margin-bottom: 0.75rem;
        }
        .grade-tab-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
          font-size: 0.82rem;
          font-weight: 600;
        }

        /* Sub-tab Navigation (Sections / Groups) */
        .subtab-navigation-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: var(--bg-card, rgba(255, 255, 255, 0.8));
          border-radius: 14px;
          border: 1px solid var(--border-light, rgba(255, 255, 255, 0.2));
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }
        .subtab-pills-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .subtab-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          background: var(--bg-secondary, #f1f5f9);
          color: var(--text-secondary, #475569);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .subtab-pill:hover {
          background: #e2e8f0;
          color: var(--text-primary, #0f172a);
        }
        .subtab-pill.active {
          background: #6366f1;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .pill-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.15rem 0.45rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          background: rgba(0, 0, 0, 0.08);
          color: inherit;
        }
        .subtab-pill.active .pill-count-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* Class Info Banner */
        .class-meta-banner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
          border: 1px solid rgba(99, 102, 241, 0.15);
        }
        .meta-banner-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .meta-banner-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary, #64748b);
          font-weight: 600;
        }
        .meta-banner-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary, #0f172a);
        }

        /* Student Grid Cards */
        .students-roster-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        .student-item-card {
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          border-radius: 14px;
          background: var(--bg-card, rgba(255, 255, 255, 0.85));
          border: 1px solid var(--border-light, rgba(226, 232, 240, 0.8));
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .student-item-card:hover {
          transform: translateY(-3px);
          border-color: #6366f1;
          box-shadow: 0 10px 24px rgba(99, 102, 241, 0.12);
        }
        .student-card-top {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          margin-bottom: 0.875rem;
        }
        .student-avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.15rem;
          color: #ffffff;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
          flex-shrink: 0;
        }
        .student-card-identity {
          min-width: 0;
          flex: 1;
        }
        .student-clickable-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary, #0f172a);
          margin: 0 0 0.2rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .student-clickable-name:hover {
          color: #6366f1;
          text-decoration: underline;
        }
        .student-sub-id {
          font-size: 0.8rem;
          color: var(--text-tertiary, #64748b);
          font-weight: 500;
        }
        .student-card-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding: 0.75rem 0;
          border-top: 1px solid var(--border-light, #f1f5f9);
          border-bottom: 1px solid var(--border-light, #f1f5f9);
          margin-bottom: 0.75rem;
          font-size: 0.82rem;
        }
        .student-card-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        /* ─── MODAL STYLES ────────────────────────────────────────── */
        .student-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: modalFadeIn 0.25s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .student-modal-dialog {
          background: var(--bg-card, #ffffff);
          border-radius: 20px;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-light, rgba(226, 232, 240, 0.8));
          animation: modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalSlideUp {
          from { transform: translateY(20px) scale(0.97); }
          to { transform: translateY(0) scale(1); }
        }
        .student-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid var(--border-light, #e2e8f0);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%);
        }
        .student-modal-hero {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .modal-hero-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 800;
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }
        .modal-hero-info h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary, #0f172a);
          margin: 0 0 0.25rem 0;
        }
        .modal-hero-info p {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
          margin: 0;
        }
        .student-modal-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .modal-info-section {
          background: var(--bg-secondary, #f8fafc);
          border: 1px solid var(--border-light, #e2e8f0);
          border-radius: 14px;
          padding: 1.25rem;
        }
        .modal-section-title {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .modal-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .modal-info-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .modal-info-label {
          font-size: 0.75rem;
          color: var(--text-tertiary, #64748b);
          font-weight: 600;
        }
        .modal-info-val {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary, #0f172a);
        }
        .student-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.25rem 1.75rem;
          border-top: 1px solid var(--border-light, #e2e8f0);
          background: var(--bg-secondary, #f8fafc);
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
        }
      `}</style>

      <div className="class-view-container">
        {/* ─── PAGE HEADER ──────────────────────────────────────────────── */}
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Building size={28} color="#6366f1" /> Class Management
            </h1>
            <p className="page-subtitle">
              Standard secondary classes (Sections A, B, C) & Higher secondary specialization (Vocational, CS, Science, Commerce, Maths Bio)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge info" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <Users size={14} style={{ marginRight: '4px' }} /> {students.length} Total Students
            </span>
            {isAdmin && (
              <button className="btn btn-primary" type="button" onClick={() => navigate('/classes/add')}>
                <Plus size={16} /> Create Class
              </button>
            )}
          </div>
        </div>

        {/* ─── LEVEL 1: GRADE SELECTION CARDS ───────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
              Select Academic Standard
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              {activeGradeConfig.isGroupBased ? '✦ Stream Grouping Mode' : '✦ Section-Based Mode (A, B, C)'}
            </span>
          </div>

          <div className="grade-tabs-grid">
            {GRADE_CONFIGS.map((g) => {
              const isActive = selectedGrade === g.id;
              // Count students in this grade
              const gradeCount = students.filter(s => {
                const sG = (s.grade || s.class?.name || s.className || '').toLowerCase();
                const num = g.id.match(/\d+/)?.[0];
                return sG.includes(g.id.toLowerCase()) || (num && sG.match(/\d+/)?.[0] === num);
              }).length;

              return (
                <div
                  key={g.id}
                  className={`grade-tab-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedGrade(g.id);
                    setSelectedSubTab('ALL');
                    setSearchQuery('');
                  }}
                >
                  <div className="grade-tab-header">
                    <h3 className="grade-tab-title">{g.displayName}</h3>
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        padding: '0.2rem 0.55rem', 
                        borderRadius: '999px', 
                        fontSize: '0.72rem', 
                        fontWeight: 700,
                        backgroundColor: isActive ? '#6366f1' : 'rgba(99, 102, 241, 0.1)',
                        color: isActive ? '#ffffff' : '#6366f1'
                      }}
                    >
                      {g.isGroupBased ? '5 Groups' : '3 Sections'}
                    </span>
                  </div>
                  <div className="grade-tab-sub">{g.subTitle}</div>
                  <div className="grade-tab-footer" style={{ color: isActive ? '#6366f1' : 'var(--text-secondary)' }}>
                    <Users size={15} />
                    <span>{gradeCount} Enrolled Students</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── LEVEL 2: SECTIONS (FOR 9TH & 10TH) OR GROUPS (FOR 11TH & 12TH) ─── */}
        <div className="subtab-navigation-bar">
          <div className="subtab-pills-wrap">
            <span style={{ fontSize: '0.85rem', fontWeight: 700, marginRight: '0.5rem', color: 'var(--text-primary)' }}>
              {activeGradeConfig.isGroupBased ? 'Specialization Groups:' : 'Sections:'}
            </span>

            {/* "All" button */}
            <button
              type="button"
              className={`subtab-pill ${selectedSubTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedSubTab('ALL')}
            >
              <span>{activeGradeConfig.isGroupBased ? 'All Groups' : 'All Sections (A, B, C)'}</span>
              <span className="pill-count-badge">{gradeStudents.length}</span>
            </button>

            {/* If 9th or 10th class: show Section A, B, C */}
            {!activeGradeConfig.isGroupBased && activeGradeConfig.sections.map((sec) => {
              const count = getSubCount(sec);
              const isPillActive = selectedSubTab === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  className={`subtab-pill ${isPillActive ? 'active' : ''}`}
                  onClick={() => setSelectedSubTab(sec)}
                >
                  <span>Section {sec}</span>
                  <span className="pill-count-badge">{count}</span>
                </button>
              );
            })}

            {/* If 11th or 12th class: show Groups (Vocational, Computer Science, Science, Commerce, Maths Biology) */}
            {activeGradeConfig.isGroupBased && activeGradeConfig.groups.map((grp) => {
              const count = getSubCount(grp);
              const isPillActive = selectedSubTab === grp;
              return (
                <button
                  key={grp}
                  type="button"
                  className={`subtab-pill ${isPillActive ? 'active' : ''}`}
                  onClick={() => setSelectedSubTab(grp)}
                >
                  <span>{grp}</span>
                  <span className="pill-count-badge">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search inside this Grade */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                className="input-field"
                placeholder={`Search ${activeGradeConfig.displayName} students...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', fontSize: '0.85rem', height: '38px', borderRadius: '10px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── LEVEL 3: ACTIVE SECTION / GROUP INFORMATION BANNER ─────────── */}
        <div className="class-meta-banner">
          <div className="meta-banner-item">
            <span className="meta-banner-label">Active Standard & Stream</span>
            <span className="meta-banner-value" style={{ color: '#6366f1' }}>
              {activeGradeConfig.displayName} {selectedSubTab !== 'ALL' ? `• ${activeGradeConfig.isGroupBased ? 'Group: ' : 'Section: '}${selectedSubTab}` : '• All Enrolled'}
            </span>
          </div>
          <div className="meta-banner-item">
            <span className="meta-banner-label">Assigned Room / Venue</span>
            <span className="meta-banner-value">
              {activeClassDoc?.roomNo || (activeGradeConfig.isGroupBased ? 'Senior Block' : 'Secondary Wing')}
            </span>
          </div>
          <div className="meta-banner-item">
            <span className="meta-banner-label">Grade Supervisor / Teacher</span>
            <span className="meta-banner-value">
              {getTeacherName(activeClassDoc?.classTeacher)}
            </span>
          </div>
          <div className="meta-banner-item">
            <span className="meta-banner-label">Enrolled Student Strength</span>
            <span className="meta-banner-value">
              {filteredStudents.length} Students {activeClassDoc?.capacity ? `/ ${activeClassDoc.capacity} Max` : ''}
            </span>
          </div>
        </div>

        {/* ─── LEVEL 4: STUDENT ROSTER (CLICK STUDENT NAME FOR DETAILS) ───── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading students data from database...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <Users size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
              No students found for this {activeGradeConfig.isGroupBased ? 'Group' : 'Section'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              {searchQuery ? `No results match "${searchQuery}". Try a different keyword.` : 'No students are currently registered in this section or group.'}
            </p>
            {searchQuery && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="students-roster-grid">
            {filteredStudents.map((stu) => {
              const studentName = stu.name || stu.user?.name || 'Student';
              const admissionNo = stu.admissionNo || stu.admissionNumber || stu.rollNumber || 'STU-000';
              const rollNo = stu.rollNumber || 'N/A';
              const sectionOrGroup = stu.section || stu.class?.section || activeGradeConfig.displayName;
              const gender = stu.gender || 'Not specified';
              const bloodGroup = stu.bloodGroup || 'O+';
              const parentPhone = stu.parentPhone || stu.phone || '+91 9800000000';
              const initials = studentName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

              return (
                <div
                  key={stu._id || stu.id}
                  className="student-item-card"
                  onClick={() => setSelectedStudent(stu)}
                >
                  <div className="student-card-top">
                    <div className="student-avatar-circle">
                      {initials || 'S'}
                    </div>
                    <div className="student-card-identity">
                      <h4 
                        className="student-clickable-name"
                        title="Click to view full student details"
                      >
                        {studentName}
                        <Eye size={14} color="#6366f1" style={{ opacity: 0.8 }} />
                      </h4>
                      <div className="student-sub-id">
                        {admissionNo} • Roll: {rollNo}
                      </div>
                    </div>
                  </div>

                  <div className="student-card-details">
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block' }}>
                        {activeGradeConfig.isGroupBased ? 'STREAM GROUP' : 'SECTION'}
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {sectionOrGroup}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block' }}>
                        BLOOD GROUP
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {bloodGroup} • {gender}
                      </strong>
                    </div>
                  </div>

                  <div className="student-card-action-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <Phone size={13} color="#10b981" />
                      <span>{parentPhone}</span>
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.78rem', 
                        fontWeight: 600, 
                        color: '#6366f1', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.2rem' 
                      }}
                    >
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── LEVEL 5: COMPREHENSIVE STUDENT DETAILS MODAL ───────────────── */}
      {selectedStudent && (
        <div 
          className="student-modal-backdrop" 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedStudent(null);
          }}
        >
          <div className="student-modal-dialog">
            {/* Modal Header */}
            <div className="student-modal-header">
              <div className="student-modal-hero">
                <div className="modal-hero-avatar">
                  {(selectedStudent.name || selectedStudent.user?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="modal-hero-info">
                  <h2>{selectedStudent.name || selectedStudent.user?.name}</h2>
                  <p>
                    ID: <strong>{selectedStudent.admissionNo || 'STU-000'}</strong> • Roll No: <strong>{selectedStudent.rollNumber || 'N/A'}</strong>
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedStudent(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-secondary)', 
                  padding: '0.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="student-modal-body">
              {/* 1. Academic Details */}
              <div className="modal-info-section">
                <div className="modal-section-title">
                  <GraduationCap size={16} /> Academic Profile & Class
                </div>
                <div className="modal-info-grid">
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Current Standard / Grade</span>
                    <span className="modal-info-val">{selectedStudent.grade || activeGradeConfig.displayName}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">
                      {activeGradeConfig.isGroupBased ? 'Specialization Stream Group' : 'Section Assigned'}
                    </span>
                    <span className="modal-info-val" style={{ color: '#6366f1', fontWeight: 700 }}>
                      {selectedStudent.section || selectedStudent.class?.section || activeGradeConfig.displayName}
                    </span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Class Code</span>
                    <span className="modal-info-val">{selectedStudent.className || `${selectedStudent.grade}-${selectedStudent.section}`}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Academic Year</span>
                    <span className="modal-info-val">{selectedStudent.academicYear || '2026-2027'}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Classroom / Room</span>
                    <span className="modal-info-val">{activeClassDoc?.roomNo || 'Senior Wing Room'}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Class Teacher In-Charge</span>
                    <span className="modal-info-val">{getTeacherName(activeClassDoc?.classTeacher)}</span>
                  </div>
                </div>
              </div>

              {/* 2. Personal Information */}
              <div className="modal-info-section">
                <div className="modal-section-title">
                  <User size={16} /> Personal Information
                </div>
                <div className="modal-info-grid">
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Full Name</span>
                    <span className="modal-info-val">{selectedStudent.name || selectedStudent.user?.name}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Gender</span>
                    <span className="modal-info-val">{selectedStudent.gender || 'Not specified'}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Date of Birth</span>
                    <span className="modal-info-val">
                      {selectedStudent.dob || selectedStudent.dateOfBirth ? new Date(selectedStudent.dob || selectedStudent.dateOfBirth).toLocaleDateString('en-GB') : '15/03/2012'}
                    </span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Blood Group</span>
                    <span className="modal-info-val" style={{ color: '#e11d48' }}>
                      <Heart size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {selectedStudent.bloodGroup || 'O+'}
                    </span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Student Email</span>
                    <span className="modal-info-val">{selectedStudent.email || selectedStudent.user?.email || 'N/A'}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Contact Phone</span>
                    <span className="modal-info-val">{selectedStudent.phone || selectedStudent.parentPhone || 'N/A'}</span>
                  </div>
                  <div className="modal-info-cell" style={{ gridColumn: '1 / -1' }}>
                    <span className="modal-info-label">Residential Address</span>
                    <span className="modal-info-val" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="#6366f1" />
                      {selectedStudent.address || 'Kovilpatti, Tamil Nadu'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Parent / Guardian Details */}
              <div className="modal-info-section">
                <div className="modal-section-title">
                  <Users size={16} /> Parent / Guardian Information
                </div>
                <div className="modal-info-grid">
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Guardian Name</span>
                    <span className="modal-info-val">{selectedStudent.parentName || 'Parent / Guardian'}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Relationship</span>
                    <span className="modal-info-val">{selectedStudent.parentRelation || 'Father'}</span>
                  </div>
                  <div className="modal-info-cell">
                    <span className="modal-info-label">Emergency Phone</span>
                    <span className="modal-info-val" style={{ color: '#10b981', fontWeight: 700 }}>
                      {selectedStudent.parentPhone || selectedStudent.phone || '+91 9800000000'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="student-modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  const sId = selectedStudent._id || selectedStudent.id;
                  navigate(`/students/${sId}`);
                }}
              >
                <Eye size={16} /> View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClassManagementPage;
