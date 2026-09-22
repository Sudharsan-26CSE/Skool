import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiCall = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("preskool-token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// --- AUTH ---
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  localStorage.setItem('preskool-token', user.accessToken);
  
  return { user, token: user.accessToken };
};

export const registerUser = async (userData) => {
  const { email, password, role, ...otherData } = userData;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  localStorage.setItem('preskool-token', user.accessToken);
  
  return { user, token: user.accessToken };
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  localStorage.setItem('preskool-token', user.accessToken);
  
  return { user, token: user.accessToken };
};

export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem('preskool-role');
  localStorage.removeItem('preskool-token');
};

export const getMe = async () => apiCall("/auth/me");

// --- DATA (MongoDB via Backend) ---
export const getStudents = async () => apiCall("/students");
export const getStudent = async (id) => apiCall(`/students/${id}`);
export const createStudent = async (data) => apiCall("/students", "POST", data);
export const updateStudent = async (id, data) => apiCall(`/students/${id}`, "PUT", data);
export const deleteStudent = async (id) => apiCall(`/students/${id}`, "DELETE");

export const getStaff = async (roleFilter) => apiCall(`/staff${roleFilter ? `?role=${roleFilter}` : ''}`);
export const getStaffMember = async (id) => apiCall(`/staff/${id}`);
export const createStaff = async (data) => apiCall("/staff", "POST", data);
export const updateStaff = async (id, data) => apiCall(`/staff/${id}`, "PUT", data);
export const deleteStaff = async (id) => apiCall(`/staff/${id}`, "DELETE");

export const getClasses = async () => apiCall("/classes");
export const getClass = async (id) => apiCall(`/classes/${id}`);
export const createClass = async (data) => apiCall("/classes", "POST", data);
export const updateClass = async (id, data) => apiCall(`/classes/${id}`, "PUT", data);
export const deleteClass = async (id) => apiCall(`/classes/${id}`, "DELETE");

export const getSubjects = async () => apiCall("/subjects");
export const getSubject = async (id) => apiCall(`/subjects/${id}`);
export const createSubject = async (data) => apiCall("/subjects", "POST", data);
export const updateSubject = async (id, data) => apiCall(`/subjects/${id}`, "PUT", data);
export const deleteSubject = async (id) => apiCall(`/subjects/${id}`, "DELETE");

export const getTimetables = async () => apiCall("/timetables");
export const getTimetable = async (id) => apiCall(`/timetables/${id}`);
export const createTimetable = async (data) => apiCall("/timetables", "POST", data);
export const updateTimetable = async (id, data) => apiCall(`/timetables/${id}`, "PUT", data);
export const deleteTimetable = async (id) => apiCall(`/timetables/${id}`, "DELETE");

export const getNotices = async () => apiCall("/notices");
export const getNotice = async (id) => apiCall(`/notices/${id}`);
export const createNotice = async (data) => apiCall("/notices", "POST", data);
export const updateNotice = async (id, data) => apiCall(`/notices/${id}`, "PUT", data);
export const deleteNotice = async (id) => apiCall(`/notices/${id}`, "DELETE");

export const getLibraryBooks = async () => apiCall("/libraryBooks");
export const createLibraryBook = async (data) => apiCall("/libraryBooks", "POST", data);
export const updateLibraryBook = async (id, data) => apiCall(`/libraryBooks/${id}`, "PUT", data);
export const deleteLibraryBook = async (id) => apiCall(`/libraryBooks/${id}`, "DELETE");

export const getTransports = async () => apiCall("/transports");
export const createTransport = async (data) => apiCall("/transports", "POST", data);
export const updateTransport = async (id, data) => apiCall(`/transports/${id}`, "PUT", data);
export const deleteTransport = async (id) => apiCall(`/transports/${id}`, "DELETE");

export const getHostels = async () => apiCall("/hostels");
export const createHostel = async (data) => apiCall("/hostels", "POST", data);
export const updateHostel = async (id, data) => apiCall(`/hostels/${id}`, "PUT", data);
export const deleteHostel = async (id) => apiCall(`/hostels/${id}`, "DELETE");

export const getFees = async () => apiCall("/fees");
export const getFee = async (id) => apiCall(`/fees/${id}`);
export const createFee = async (data) => apiCall("/fees", "POST", data);
export const updateFee = async (id, data) => apiCall(`/fees/${id}`, "PUT", data);
export const deleteFee = async (id) => apiCall(`/fees/${id}`, "DELETE");

export const getPayrolls = async () => apiCall("/payrolls");
export const getPayroll = async (id) => apiCall(`/payrolls/${id}`);
export const createPayroll = async (data) => apiCall("/payrolls", "POST", data);
export const updatePayroll = async (id, data) => apiCall(`/payrolls/${id}`, "PUT", data);
export const deletePayroll = async (id) => apiCall(`/payrolls/${id}`, "DELETE");

export const getOnlineClasses = async () => apiCall("/onlineClasses");
export const getOnlineClass = async (id) => apiCall(`/onlineClasses/${id}`);
export const createOnlineClass = async (data) => apiCall("/onlineClasses", "POST", data);
export const updateOnlineClass = async (id, data) => apiCall(`/onlineClasses/${id}`, "PUT", data);
export const deleteOnlineClass = async (id) => apiCall(`/onlineClasses/${id}`, "DELETE");

export const getAssignments = async () => apiCall("/assignments");
export const getAssignment = async (id) => apiCall(`/assignments/${id}`);
export const createAssignment = async (data) => apiCall("/assignments", "POST", data);
export const updateAssignment = async (id, data) => apiCall(`/assignments/${id}`, "PUT", data);
export const deleteAssignment = async (id) => apiCall(`/assignments/${id}`, "DELETE");

export const getResults = async () => apiCall("/results");
export const getResult = async (id) => apiCall(`/results/${id}`);
export const createResult = async (data) => apiCall("/results", "POST", data);
export const updateResult = async (id, data) => apiCall(`/results/${id}`, "PUT", data);
export const deleteResult = async (id) => apiCall(`/results/${id}`, "DELETE");

export const getAttendance = async () => apiCall("/attendance");
export const getAttendanceRecord = async (id) => apiCall(`/attendance/${id}`);
export const createAttendance = async (data) => apiCall("/attendance", "POST", data);
export const updateAttendance = async (id, data) => apiCall(`/attendance/${id}`, "PUT", data);
export const deleteAttendance = async (id) => apiCall(`/attendance/${id}`, "DELETE");

export const getLeaveRequests = async () => apiCall("/leaveRequests");
export const getLeaveRequest = async (id) => apiCall(`/leaveRequests/${id}`);
export const createLeaveRequest = async (data) => apiCall("/leaveRequests", "POST", data);
export const updateLeaveRequest = async (id, data) => apiCall(`/leaveRequests/${id}`, "PUT", data);
export const deleteLeaveRequest = async (id) => apiCall(`/leaveRequests/${id}`, "DELETE");

// Unused mocks
export const getInventory = async () => ({ inventory: [] });
export const createInventory = async () => null;
export const updateInventory = async () => null;
export const deleteInventory = async () => null;

export const getAccounts = async () => ({ accounts: [] });
export const getAccount = async () => null;
export const createAccount = async () => null;
export const updateAccount = async () => null;
export const deleteAccount = async () => null;

export const deleteEvent = async () => null;
export const createEvent = async () => null;
export const updateEvent = async () => null;
export const deleteUser = async () => null;
export const createUser = async () => null;
export const updateUser = async () => null;

export const createNotification = async (data) => ({ notification: data });
export const getNotifications = async () => ({ notifications: [] });
export const deleteNotification = async () => null;
