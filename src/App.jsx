import React from 'react';

import { Routes, Route } from 'react-router-dom';

// Hero & Splash & Auth Pages
import SkoolHeroPage from './pages/hero/SkoolHeroPage.jsx';
import SplashScreen from './pages/splash/SplashScreen.jsx';
import RoleSelectionPage from './pages/auth/RoleSelectionPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './pages/auth/SignUpPage.jsx';
import ForgotPasswordPage from './ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import EmailVerificationPage from './pages/auth/EmailVerificationPage.jsx';
import TwoStepVerificationPage from './pages/auth/TwoStepVerificationPage.jsx';
import ResetPasswordSentPage from './pages/auth/ResetPasswordSentPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import StudentDashboard from './pages/dashboard/StudentDashboard.jsx';
import TeacherDashboard from './pages/dashboard/TeacherDashboard.jsx';

// Students & Teachers
import StudentListPage from './pages/students/StudentListPage.jsx';
import StudentDetailsPage from './pages/students/StudentDetailsPage.jsx';
import AddStudentPage from './pages/students/AddStudentPage.jsx';
import EditStudentPage from './pages/students/EditStudentPage.jsx';
import EntryFormPage from './components/common/EntryFormPage.jsx';
import TeacherListPage from './pages/teachers/TeacherListPage.jsx';
import AddTeacherPage from './pages/teachers/AddTeacherPage.jsx';
import StaffManagementPage from './pages/staff/StaffManagementPage.jsx';
import AddStaffPage from './pages/staff/AddStaffPage.jsx';
import EditStaffPage from './pages/staff/EditStaffPage.jsx';

import ClassManagementPage from './pages/academics/ClassManagementPage.jsx';
import AddClassPage from './pages/academics/AddClassPage.jsx';
import SubjectManagementPage from './pages/academics/SubjectManagementPage.jsx';
import AddSubjectPage from './pages/academics/AddSubjectPage.jsx';
import TimetablePage from './pages/academics/TimetablePage.jsx';
import AddTimetablePage from './pages/academics/AddTimetablePage.jsx';
import ExamResultsPage from './pages/academics/ExamResultsPage.jsx';
import AssignmentPage from './pages/academics/AssignmentPage.jsx';
import OnlineClassPage from './pages/academics/OnlineClassPage.jsx';
import AddOnlineClassPage from './pages/academics/AddOnlineClassPage.jsx';

// Management & HR
import AttendancePage from './pages/attendance/AttendancePage.jsx';
import LeaveManagementPage from './pages/attendance/LeaveManagementPage.jsx';

// Finance
import FeeManagementPage from './pages/finance/FeeManagementPage.jsx';
import AddFeeInvoicePage from './pages/finance/AddFeeInvoicePage.jsx';
import PayrollPage from './pages/finance/PayrollPage.jsx';
import AddPayrollPage from './pages/finance/AddPayrollPage.jsx';
import AccountsPage from './pages/finance/AccountsPage.jsx';

// Communication
import NoticeBoardPage from './pages/communication/NoticeBoardPage.jsx';
import AddNoticePage from './pages/communication/AddNoticePage.jsx';
import MessagesPage from './pages/communication/MessagesPage.jsx';
import NotificationsPage from './pages/communication/NotificationsPage.jsx';

// Facilities
import LibraryPage from './pages/facilities/LibraryPage.jsx';
import AddBookPage from './pages/facilities/AddBookPage.jsx';
import TransportPage from './pages/facilities/TransportPage.jsx';
import AddTransportPage from './pages/facilities/AddTransportPage.jsx';
import HostelPage from './pages/facilities/HostelPage.jsx';
import AddHostelPage from './pages/facilities/AddHostelPage.jsx';
import InventoryPage from './pages/facilities/InventoryPage.jsx';

// System
import ReportsPage from './pages/reports/ReportsPage.jsx';
import CalendarPage from './pages/settings/CalendarPage.jsx';
import ProfilePage from './pages/settings/ProfilePage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';

import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const applyStoredSettings = () => {
      const stored = localStorage.getItem('preskool-theme') || localStorage.getItem('skool-theme');
      // If user has never set a preference, follow the OS/system theme
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (systemPrefersDark ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
      const blur = localStorage.getItem('preskool-blur') || localStorage.getItem('skool-blur') || '20';
      document.documentElement.style.setProperty('--glass-blur', `${blur}px`);
    };

    applyStoredSettings();
    window.addEventListener('preskool-settings-change', applyStoredSettings);

    // Listen for OS-level theme changes (e.g. user switches from light to dark in system settings)
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handleSystemThemeChange = () => {
      // Only auto-follow system if user hasn't manually set a preference
      if (!localStorage.getItem('preskool-theme') && !localStorage.getItem('skool-theme')) {
        applyStoredSettings();
      }
    };
    if (mediaQuery) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    return () => {
      window.removeEventListener('preskool-settings-change', applyStoredSettings);
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      }
    };
  }, []);

  return (
    <Routes>
      {/* Hero, Splash & Auth */}
      <Route path="/" element={<SkoolHeroPage />} />
      <Route path="/hero" element={<SkoolHeroPage />} />
      <Route path="/landing" element={<SkoolHeroPage />} />
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/role" element={<RoleSelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/email-verification" element={<EmailVerificationPage />} />
      <Route path="/2step" element={<TwoStepVerificationPage />} />
      <Route path="/reset-password-sent" element={<ResetPasswordSentPage />} />

      {/* Dashboards */}
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
      <Route path="/dashboard/staff" element={<TeacherDashboard />} />

      {/* Students */}
      <Route path="/students" element={<StudentListPage />} />
      <Route path="/students/add" element={<AddStudentPage />} />
      <Route path="/students/edit/:id" element={<EditStudentPage />} />
      <Route path="/subjects/add" element={<EntryFormPage title="Add New Subject" subtitle="Add a subject to the academic curriculum" returnPath="/subjects" submitLabel="Save Subject" fields={[{ name: 'subjectName', label: 'Subject Name', placeholder: 'e.g. Mathematics', required: true }, { name: 'code', label: 'Subject Code', placeholder: 'e.g. SUB-106', required: true }, { name: 'category', label: 'Category', placeholder: 'e.g. Core Academic', required: true }, { name: 'credits', label: 'Academic Credits', placeholder: 'e.g. 4 Credits', required: true }]} />} />
      <Route path="/students/:id" element={<StudentDetailsPage />} />

      {/* Teachers & Staff */}
      <Route path="/teachers" element={<TeacherListPage />} />
      <Route path="/teachers/add" element={<AddTeacherPage />} />
      <Route path="/staff" element={<StaffManagementPage />} />
      <Route path="/staff/add" element={<AddStaffPage />} />
      <Route path="/staff/edit/:id" element={<EditStaffPage />} />

      {/* Academics */}
      <Route path="/classes" element={<ClassManagementPage />} />
      <Route path="/classes/add" element={<AddClassPage />} />
      <Route path="/subjects" element={<SubjectManagementPage />} />
      <Route path="/subjects/add" element={<AddSubjectPage />} />
      <Route path="/timetable" element={<TimetablePage />} />
      <Route path="/timetable/add" element={<AddTimetablePage />} />
      <Route path="/exam-results" element={<ExamResultsPage />} />
      <Route path="/assignments" element={<AssignmentPage />} />
      <Route path="/assignments/add" element={<EntryFormPage title="Create New Assignment" subtitle="Create coursework for one of your classes" returnPath="/assignments" submitLabel="Create Assignment" fields={[{ name: 'title', label: 'Assignment Title', placeholder: 'e.g. Algebra II Problem Set', required: true }, { name: 'className', label: 'Assigned Class', placeholder: 'e.g. Grade 10-A', required: true }, { name: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics', required: true }, { name: 'dueDate', label: 'Due Date', type: 'date', required: true }, { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'Enter assignment instructions', required: true, fullWidth: true }]} />} />
      <Route path="/assignments/:assignmentId" element={<AssignmentPage />} />
      <Route path="/online-classes" element={<OnlineClassPage />} />
      <Route path="/online-classes/add" element={<AddOnlineClassPage />} />

      {/* Management & HR */}
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/leave-management" element={<LeaveManagementPage />} />
      <Route path="/leave-management/apply" element={<EntryFormPage title="Apply for Leave" subtitle="Submit your leave request for approval" returnPath="/leave-management" submitLabel="Submit Request" fields={[{ name: 'leaveType', label: 'Leave Type', placeholder: 'e.g. Casual Leave', required: true }, { name: 'startDate', label: 'Start Date', type: 'date', required: true }, { name: 'endDate', label: 'End Date', type: 'date', required: true }, { name: 'reason', label: 'Reason', type: 'textarea', placeholder: 'Explain the reason for your leave', required: true, fullWidth: true }]} />} />

      {/* Finance */}
      <Route path="/fees" element={<FeeManagementPage />} />
      <Route path="/fees/add" element={<AddFeeInvoicePage />} />
      <Route path="/payroll" element={<PayrollPage />} />
      <Route path="/payroll/add" element={<AddPayrollPage />} />
      <Route path="/accounts" element={<AccountsPage />} />

      {/* Communication */}
      <Route path="/notice-board" element={<NoticeBoardPage />} />
      <Route path="/notice-board/add" element={<AddNoticePage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* Facilities */}
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/library/add" element={<AddBookPage />} />
      <Route path="/transport" element={<TransportPage />} />
      <Route path="/transport/add" element={<AddTransportPage />} />
      <Route path="/hostel" element={<HostelPage />} />
      <Route path="/hostel/add" element={<AddHostelPage />} />
      <Route path="/inventory" element={<InventoryPage />} />

      {/* System */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
