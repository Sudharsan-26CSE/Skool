import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Splash & Auth Pages
import SplashScreen from './pages/splash/SplashScreen.jsx';
import RoleSelectionPage from './pages/auth/RoleSelectionPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './pages/auth/SignUpPage.jsx';
import ForgotPasswordPage from './ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import EmailVerificationPage from './pages/auth/EmailVerificationPage.jsx';
import TwoStepVerificationPage from './pages/auth/TwoStepVerificationPage.jsx';
import ResetPasswordSentPage from './pages/auth/ResetPasswordSentPage.jsx';

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import StudentDashboard from './pages/dashboard/StudentDashboard.jsx';
import TeacherDashboard from './pages/dashboard/TeacherDashboard.jsx';

// Students & Teachers
import StudentListPage from './pages/students/StudentListPage.jsx';
import StudentDetailsPage from './pages/students/StudentDetailsPage.jsx';
import AddStudentPage from './pages/students/AddStudentPage.jsx';
import TeacherListPage from './pages/teachers/TeacherListPage.jsx';
import StaffManagementPage from './pages/staff/StaffManagementPage.jsx';

// Academics
import ClassManagementPage from './pages/academics/ClassManagementPage.jsx';
import SubjectManagementPage from './pages/academics/SubjectManagementPage.jsx';
import TimetablePage from './pages/academics/TimetablePage.jsx';
import ExamResultsPage from './pages/academics/ExamResultsPage.jsx';
import AssignmentPage from './pages/academics/AssignmentPage.jsx';
import OnlineClassPage from './pages/academics/OnlineClassPage.jsx';

// Management & HR
import AttendancePage from './pages/attendance/AttendancePage.jsx';
import LeaveManagementPage from './pages/hr/LeaveManagementPage.jsx';

// Finance
import FeeManagementPage from './pages/finance/FeeManagementPage.jsx';
import PayrollPage from './pages/finance/PayrollPage.jsx';
import AccountsPage from './pages/finance/AccountsPage.jsx';

// Communication
import NoticeBoardPage from './pages/communication/NoticeBoardPage.jsx';
import MessagesPage from './pages/communication/MessagesPage.jsx';
import NotificationsPage from './pages/communication/NotificationsPage.jsx';

// Facilities
import LibraryPage from './pages/facilities/LibraryPage.jsx';
import TransportPage from './pages/facilities/TransportPage.jsx';
import HostelPage from './pages/facilities/HostelPage.jsx';
import InventoryPage from './pages/facilities/InventoryPage.jsx';

// System
import ReportsPage from './pages/reports/ReportsPage.jsx';
import CalendarPage from './pages/settings/CalendarPage.jsx';
import ProfilePage from './pages/settings/ProfilePage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';

import './App.css';

function App() {
  return (
    <Routes>
      {/* Splash & Auth */}
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/" element={<LoginPage />} />
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
      <Route path="/students/:id" element={<StudentDetailsPage />} />

      {/* Teachers & Staff */}
      <Route path="/teachers" element={<TeacherListPage />} />
      <Route path="/staff" element={<StaffManagementPage />} />

      {/* Academics */}
      <Route path="/classes" element={<ClassManagementPage />} />
      <Route path="/subjects" element={<SubjectManagementPage />} />
      <Route path="/timetable" element={<TimetablePage />} />
      <Route path="/exam-results" element={<ExamResultsPage />} />
      <Route path="/assignments" element={<AssignmentPage />} />
      <Route path="/online-classes" element={<OnlineClassPage />} />

      {/* Management & HR */}
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/leave-management" element={<LeaveManagementPage />} />

      {/* Finance */}
      <Route path="/fees" element={<FeeManagementPage />} />
      <Route path="/payroll" element={<PayrollPage />} />
      <Route path="/accounts" element={<AccountsPage />} />

      {/* Communication */}
      <Route path="/notice-board" element={<NoticeBoardPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* Facilities */}
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/transport" element={<TransportPage />} />
      <Route path="/hostel" element={<HostelPage />} />
      <Route path="/inventory" element={<InventoryPage />} />

      {/* System */}
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
