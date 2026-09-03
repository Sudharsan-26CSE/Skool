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

// Dashboards
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import StudentDashboard from './pages/dashboard/StudentDashboard.jsx';
import TeacherDashboard from './pages/dashboard/TeacherDashboard.jsx';

// Students & Teachers
import StudentListPage from './pages/students/StudentListPage.jsx';
import StudentDetailsPage from './pages/students/StudentDetailsPage.jsx';
import AddStudentPage from './pages/students/AddStudentPage.jsx';
import EntryFormPage from './components/common/EntryFormPage.jsx';
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
      <Route path="/classes/add" element={<EntryFormPage title="Add New Class" subtitle="Create a class and assign its teaching details" returnPath="/classes" submitLabel="Save Class" fields={[{ name: 'className', label: 'Class Name', placeholder: 'e.g. Grade 10-A', required: true }, { name: 'room', label: 'Room', placeholder: 'e.g. Room 102', required: true }, { name: 'teacher', label: 'Class Teacher', placeholder: 'Enter teacher name', required: true }, { name: 'schedule', label: 'Schedule', placeholder: 'e.g. Monday and Wednesday, 9:00 AM', required: true }]} />} />
      <Route path="/subjects/add" element={<EntryFormPage title="Add New Subject" subtitle="Add a subject to the academic curriculum" returnPath="/subjects" submitLabel="Save Subject" fields={[{ name: 'subjectName', label: 'Subject Name', placeholder: 'e.g. Mathematics', required: true }, { name: 'code', label: 'Subject Code', placeholder: 'e.g. SUB-106', required: true }, { name: 'category', label: 'Category', placeholder: 'e.g. Core Academic', required: true }, { name: 'credits', label: 'Academic Credits', placeholder: 'e.g. 4 Credits', required: true }]} />} />
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
      <Route path="/assignments/add" element={<EntryFormPage title="Create New Assignment" subtitle="Create coursework for one of your classes" returnPath="/assignments" submitLabel="Create Assignment" fields={[{ name: 'title', label: 'Assignment Title', placeholder: 'e.g. Algebra II Problem Set', required: true }, { name: 'className', label: 'Assigned Class', placeholder: 'e.g. Grade 10-A', required: true }, { name: 'subject', label: 'Subject', placeholder: 'e.g. Mathematics', required: true }, { name: 'dueDate', label: 'Due Date', type: 'date', required: true }, { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'Enter assignment instructions', required: true, fullWidth: true }]} />} />
      <Route path="/assignments/:assignmentId" element={<AssignmentPage />} />
      <Route path="/online-classes" element={<OnlineClassPage />} />

      {/* Management & HR */}
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/leave-management" element={<LeaveManagementPage />} />
      <Route path="/leave-management/apply" element={<EntryFormPage title="Apply for Leave" subtitle="Submit your leave request for approval" returnPath="/leave-management" submitLabel="Submit Request" fields={[{ name: 'leaveType', label: 'Leave Type', placeholder: 'e.g. Casual Leave', required: true }, { name: 'startDate', label: 'Start Date', type: 'date', required: true }, { name: 'endDate', label: 'End Date', type: 'date', required: true }, { name: 'reason', label: 'Reason', type: 'textarea', placeholder: 'Explain the reason for your leave', required: true, fullWidth: true }]} />} />

      {/* Finance */}
      <Route path="/fees" element={<FeeManagementPage />} />
      <Route path="/payroll" element={<PayrollPage />} />
      <Route path="/accounts" element={<AccountsPage />} />

      {/* Communication */}
      <Route path="/notice-board" element={<NoticeBoardPage />} />
      <Route path="/notice-board/add" element={<EntryFormPage title="Post New Notice" subtitle="Publish an announcement to the school community" returnPath="/notice-board" submitLabel="Publish Notice" fields={[{ name: 'title', label: 'Notice Title', placeholder: 'Enter a clear notice title', required: true }, { name: 'category', label: 'Category', placeholder: 'e.g. Academic, Events, Meeting', required: true }, { name: 'publishDate', label: 'Publish Date', type: 'date', required: true }, { name: 'content', label: 'Notice Content', type: 'textarea', placeholder: 'Write the announcement', required: true, fullWidth: true }]} />} />
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
