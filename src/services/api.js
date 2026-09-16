const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ─── Generic request helper ─────────────────────────────────────────
const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// ─── Auth ────────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  apiRequest('/auth/login', { method: 'POST', body: { email, password } });

export const registerUser = (userData) =>
  apiRequest('/auth/register', { method: 'POST', body: userData });

export const getUsers = () => apiRequest('/auth/users');

export const checkServerHealth = async () => {
  try { return await apiRequest('/health'); }
  catch (err) { return { status: 'offline', error: err.message }; }
};

// ─── Students ────────────────────────────────────────────────────────
export const getStudents = (query = '') => apiRequest(`/students${query ? `?${query}` : ''}`);
export const getStudent = (id) => apiRequest(`/students/${id}`);
export const createStudent = (data) => apiRequest('/students', { method: 'POST', body: data });
export const updateStudent = (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: data });
export const deleteStudent = (id) => apiRequest(`/students/${id}`, { method: 'DELETE' });

// ─── Staff ───────────────────────────────────────────────────────────
export const getStaff = (query = '') => apiRequest(`/staff${query ? `?${query}` : ''}`);
export const getStaffMember = (id) => apiRequest(`/staff/${id}`);
export const createStaff = (data) => apiRequest('/staff', { method: 'POST', body: data });
export const updateStaff = (id, data) => apiRequest(`/staff/${id}`, { method: 'PUT', body: data });
export const deleteStaff = (id) => apiRequest(`/staff/${id}`, { method: 'DELETE' });

// ─── Classes ─────────────────────────────────────────────────────────
export const getClasses = (query = '') => apiRequest(`/classes${query ? `?${query}` : ''}`);
export const getClass = (id) => apiRequest(`/classes/${id}`);
export const createClass = (data) => apiRequest('/classes', { method: 'POST', body: data });
export const updateClass = (id, data) => apiRequest(`/classes/${id}`, { method: 'PUT', body: data });
export const deleteClass = (id) => apiRequest(`/classes/${id}`, { method: 'DELETE' });

// ─── Subjects ────────────────────────────────────────────────────────
export const getSubjects = (query = '') => apiRequest(`/subjects${query ? `?${query}` : ''}`);
export const getSubject = (id) => apiRequest(`/subjects/${id}`);
export const createSubject = (data) => apiRequest('/subjects', { method: 'POST', body: data });
export const updateSubject = (id, data) => apiRequest(`/subjects/${id}`, { method: 'PUT', body: data });
export const deleteSubject = (id) => apiRequest(`/subjects/${id}`, { method: 'DELETE' });

// ─── Timetable ───────────────────────────────────────────────────────
export const getTimetable = (query = '') => apiRequest(`/timetable${query ? `?${query}` : ''}`);
export const getTimetableEntry = (id) => apiRequest(`/timetable/${id}`);
export const createTimetable = (data) => apiRequest('/timetable', { method: 'POST', body: data });
export const updateTimetable = (id, data) => apiRequest(`/timetable/${id}`, { method: 'PUT', body: data });
export const deleteTimetable = (id) => apiRequest(`/timetable/${id}`, { method: 'DELETE' });

// Aliases for Timetable
export const getTimetables = getTimetable;

// ─── Exam Results ────────────────────────────────────────────────────
export const getExamResults = (query = '') => apiRequest(`/exam-results${query ? `?${query}` : ''}`);
export const getExamResult = (id) => apiRequest(`/exam-results/${id}`);
export const createExamResult = (data) => apiRequest('/exam-results', { method: 'POST', body: data });
export const createBulkExamResults = (results) => apiRequest('/exam-results/bulk', { method: 'POST', body: { results } });
export const updateExamResult = (id, data) => apiRequest(`/exam-results/${id}`, { method: 'PUT', body: data });
export const deleteExamResult = (id) => apiRequest(`/exam-results/${id}`, { method: 'DELETE' });

// ─── Assignments ─────────────────────────────────────────────────────
export const getAssignments = (query = '') => apiRequest(`/assignments${query ? `?${query}` : ''}`);
export const getAssignment = (id) => apiRequest(`/assignments/${id}`);
export const createAssignment = (data) => apiRequest('/assignments', { method: 'POST', body: data });
export const updateAssignment = (id, data) => apiRequest(`/assignments/${id}`, { method: 'PUT', body: data });
export const submitAssignment = (id, data) => apiRequest(`/assignments/${id}/submit`, { method: 'POST', body: data });
export const deleteAssignment = (id) => apiRequest(`/assignments/${id}`, { method: 'DELETE' });

// ─── Online Classes ──────────────────────────────────────────────────
export const getOnlineClasses = (query = '') => apiRequest(`/online-classes${query ? `?${query}` : ''}`);
export const getOnlineClass = (id) => apiRequest(`/online-classes/${id}`);
export const createOnlineClass = (data) => apiRequest('/online-classes', { method: 'POST', body: data });
export const updateOnlineClass = (id, data) => apiRequest(`/online-classes/${id}`, { method: 'PUT', body: data });
export const deleteOnlineClass = (id) => apiRequest(`/online-classes/${id}`, { method: 'DELETE' });

// ─── Attendance ──────────────────────────────────────────────────────
export const getAttendance = (query = '') => apiRequest(`/attendance${query ? `?${query}` : ''}`);
export const getAttendanceRecord = (id) => apiRequest(`/attendance/${id}`);
export const markAttendance = (data) => apiRequest('/attendance', { method: 'POST', body: data });
export const markBulkAttendance = (records) => apiRequest('/attendance/bulk', { method: 'POST', body: { records } });
export const updateAttendance = (id, data) => apiRequest(`/attendance/${id}`, { method: 'PUT', body: data });
export const deleteAttendance = (id) => apiRequest(`/attendance/${id}`, { method: 'DELETE' });

// ─── Leave Requests ──────────────────────────────────────────────────
export const getLeaveRequests = (query = '') => apiRequest(`/leave-requests${query ? `?${query}` : ''}`);
export const getLeaveRequest = (id) => apiRequest(`/leave-requests/${id}`);
export const createLeaveRequest = (data) => apiRequest('/leave-requests', { method: 'POST', body: data });
export const updateLeaveRequest = (id, data) => apiRequest(`/leave-requests/${id}`, { method: 'PUT', body: data });
export const updateLeaveStatus = (id, data) => apiRequest(`/leave-requests/${id}/status`, { method: 'PUT', body: data });
export const deleteLeaveRequest = (id) => apiRequest(`/leave-requests/${id}`, { method: 'DELETE' });

// ─── Fee Management ──────────────────────────────────────────────────
export const getFees = (query = '') => apiRequest(`/fees${query ? `?${query}` : ''}`);
export const getFee = (id) => apiRequest(`/fees/${id}`);
export const createFee = (data) => apiRequest('/fees', { method: 'POST', body: data });
export const updateFee = (id, data) => apiRequest(`/fees/${id}`, { method: 'PUT', body: data });
export const deleteFee = (id) => apiRequest(`/fees/${id}`, { method: 'DELETE' });

// ─── Payroll ─────────────────────────────────────────────────────────
export const getPayrolls = (query = '') => apiRequest(`/payroll${query ? `?${query}` : ''}`);
export const getPayroll = (id) => apiRequest(`/payroll/${id}`);
export const createPayroll = (data) => apiRequest('/payroll', { method: 'POST', body: data });
export const updatePayroll = (id, data) => apiRequest(`/payroll/${id}`, { method: 'PUT', body: data });
export const deletePayroll = (id) => apiRequest(`/payroll/${id}`, { method: 'DELETE' });

// ─── Accounts ────────────────────────────────────────────────────────
export const getAccounts = (query = '') => apiRequest(`/accounts${query ? `?${query}` : ''}`);
export const getAccountSummary = (query = '') => apiRequest(`/accounts/summary${query ? `?${query}` : ''}`);
export const getAccount = (id) => apiRequest(`/accounts/${id}`);
export const createAccount = (data) => apiRequest('/accounts', { method: 'POST', body: data });
export const updateAccount = (id, data) => apiRequest(`/accounts/${id}`, { method: 'PUT', body: data });
export const deleteAccount = (id) => apiRequest(`/accounts/${id}`, { method: 'DELETE' });

// ─── Notice Board ────────────────────────────────────────────────────
export const getNotices = (query = '') => apiRequest(`/notices${query ? `?${query}` : ''}`);
export const getNotice = (id) => apiRequest(`/notices/${id}`);
export const createNotice = (data) => apiRequest('/notices', { method: 'POST', body: data });
export const updateNotice = (id, data) => apiRequest(`/notices/${id}`, { method: 'PUT', body: data });
export const deleteNotice = (id) => apiRequest(`/notices/${id}`, { method: 'DELETE' });

// ─── Messages ────────────────────────────────────────────────────────
export const getInbox = (userId) => apiRequest(`/messages/inbox/${userId}`);
export const getSentMessages = (userId) => apiRequest(`/messages/sent/${userId}`);
export const getMessage = (id) => apiRequest(`/messages/${id}`);
export const sendMessage = (data) => apiRequest('/messages', { method: 'POST', body: data });
export const markMessageRead = (id) => apiRequest(`/messages/${id}/read`, { method: 'PUT' });
export const toggleMessageStar = (id) => apiRequest(`/messages/${id}/star`, { method: 'PUT' });
export const deleteMessage = (id, userId) => apiRequest(`/messages/${id}?userId=${userId}`, { method: 'DELETE' });

// ─── Notifications ───────────────────────────────────────────────────
export const getNotifications = (userId, query = '') => apiRequest(`/notifications/user/${userId}${query ? `?${query}` : ''}`);
export const getNotification = (id) => apiRequest(`/notifications/${id}`);
export const createNotification = (data) => apiRequest('/notifications', { method: 'POST', body: data });
export const markNotificationRead = (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
export const markAllNotificationsRead = (userId) => apiRequest(`/notifications/user/${userId}/read-all`, { method: 'PUT' });
export const deleteNotification = (id) => apiRequest(`/notifications/${id}`, { method: 'DELETE' });

// ─── Library ─────────────────────────────────────────────────────────
export const getBooks = (query = '') => apiRequest(`/library${query ? `?${query}` : ''}`);
export const getBook = (id) => apiRequest(`/library/${id}`);
export const addBook = (data) => apiRequest('/library', { method: 'POST', body: data });
export const updateBook = (id, data) => apiRequest(`/library/${id}`, { method: 'PUT', body: data });
export const issueBook = (id, data) => apiRequest(`/library/${id}/issue`, { method: 'POST', body: data });
export const returnBook = (id, issueId, data = {}) => apiRequest(`/library/${id}/return/${issueId}`, { method: 'PUT', body: data });
export const deleteBook = (id) => apiRequest(`/library/${id}`, { method: 'DELETE' });

// Aliases for Library
export const getLibraryBooks = getBooks;
export const createLibraryBook = addBook;
export const deleteLibraryBook = deleteBook;

// ─── Transport ───────────────────────────────────────────────────────
export const getTransportRoutes = (query = '') => apiRequest(`/transport${query ? `?${query}` : ''}`);
export const getTransportRoute = (id) => apiRequest(`/transport/${id}`);
export const createTransportRoute = (data) => apiRequest('/transport', { method: 'POST', body: data });
export const updateTransportRoute = (id, data) => apiRequest(`/transport/${id}`, { method: 'PUT', body: data });
export const deleteTransportRoute = (id) => apiRequest(`/transport/${id}`, { method: 'DELETE' });

// Aliases for Transport
export const getTransports = getTransportRoutes;
export const createTransport = createTransportRoute;
export const deleteTransport = deleteTransportRoute;

// ─── Hostel ──────────────────────────────────────────────────────────
export const getHostelRooms = (query = '') => apiRequest(`/hostel${query ? `?${query}` : ''}`);
export const getHostelRoom = (id) => apiRequest(`/hostel/${id}`);
export const createHostelRoom = (data) => apiRequest('/hostel', { method: 'POST', body: data });
export const updateHostelRoom = (id, data) => apiRequest(`/hostel/${id}`, { method: 'PUT', body: data });
export const deleteHostelRoom = (id) => apiRequest(`/hostel/${id}`, { method: 'DELETE' });

// Aliases for Hostel
export const getHostels = getHostelRooms;
export const createHostel = createHostelRoom;
export const deleteHostel = deleteHostelRoom;

// ─── Inventory ───────────────────────────────────────────────────────
export const getInventory = (query = '') => apiRequest(`/inventory${query ? `?${query}` : ''}`);
export const getInventoryItem = (id) => apiRequest(`/inventory/${id}`);
export const addInventoryItem = (data) => apiRequest('/inventory', { method: 'POST', body: data });
export const updateInventoryItem = (id, data) => apiRequest(`/inventory/${id}`, { method: 'PUT', body: data });
export const deleteInventoryItem = (id) => apiRequest(`/inventory/${id}`, { method: 'DELETE' });

// ─── School Calendar ─────────────────────────────────────────────────
export const getCalendarEvents = (query = '') => apiRequest(`/calendar${query ? `?${query}` : ''}`);
export const getCalendarEvent = (id) => apiRequest(`/calendar/${id}`);
export const createCalendarEvent = (data) => apiRequest('/calendar', { method: 'POST', body: data });
export const updateCalendarEvent = (id, data) => apiRequest(`/calendar/${id}`, { method: 'PUT', body: data });
export const deleteCalendarEvent = (id) => apiRequest(`/calendar/${id}`, { method: 'DELETE' });

// ─── Reports ─────────────────────────────────────────────────────────
export const getReports = (query = '') => apiRequest(`/reports${query ? `?${query}` : ''}`);
export const getReport = (id) => apiRequest(`/reports/${id}`);
export const generateReport = (data) => apiRequest('/reports', { method: 'POST', body: data });
export const updateReport = (id, data) => apiRequest(`/reports/${id}`, { method: 'PUT', body: data });
export const deleteReport = (id) => apiRequest(`/reports/${id}`, { method: 'DELETE' });

// ─── Profile ─────────────────────────────────────────────────────────
export const getProfile = (userId) => apiRequest(`/profile/${userId}`);
export const updateProfile = (userId, data) => apiRequest(`/profile/${userId}`, { method: 'PUT', body: data });
export const changePassword = (userId, data) => apiRequest(`/profile/${userId}/password`, { method: 'PUT', body: data });

// ─── Settings ────────────────────────────────────────────────────────
export const getSettings = (userId) => apiRequest(`/settings/${userId}`);
export const updateSettings = (userId, data) => apiRequest(`/settings/${userId}`, { method: 'PUT', body: data });

// ─── Admin Settings (School-wide) ────────────────────────────────────
export const getAdminSettings = () => apiRequest('/admin-settings');
export const updateAdminSettings = (data) => apiRequest('/admin-settings', { method: 'PUT', body: data });
export const getModuleSettings = () => apiRequest('/admin-settings/modules');
export const updateModuleSettings = (data) => apiRequest('/admin-settings/modules', { method: 'PUT', body: data });
