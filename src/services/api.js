import { auth, db } from '../firebase';
import { 
  collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, 
  query, where
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword as firebaseLogin,
  createUserWithEmailAndPassword as firebaseRegister
} from 'firebase/auth';

// Helper to format Firestore document
const formatDoc = (docSnap) => ({
  _id: docSnap.id,
  ...docSnap.data()
});

// Helper for generic collection fetch
const fetchCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(formatDoc);
};

// ─── Auth ────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const userCredential = await firebaseLogin(auth, email, password);
  return { user: userCredential.user, token: userCredential.user.accessToken };
};

export const registerUser = async (userData) => {
  const userCredential = await firebaseRegister(auth, userData.email, userData.password);
  return { user: userCredential.user, token: userCredential.user.accessToken };
};

export const getUsers = () => fetchCollection('users');

export const checkServerHealth = async () => ({ status: 'online', service: 'Firebase' });

// ─── Students ────────────────────────────────────────────────────────
export const getStudents = () => fetchCollection('students');
export const getStudent = async (id) => formatDoc(await getDoc(doc(db, 'students', id)));
export const createStudent = async (data) => await addDoc(collection(db, 'students'), data);
export const updateStudent = async (id, data) => await updateDoc(doc(db, 'students', id), data);
export const deleteStudent = async (id) => await deleteDoc(doc(db, 'students', id));

// ─── Staff ───────────────────────────────────────────────────────────
export const getStaff = () => fetchCollection('staff');
export const getStaffMember = async (id) => formatDoc(await getDoc(doc(db, 'staff', id)));
export const createStaff = async (data) => await addDoc(collection(db, 'staff'), data);
export const updateStaff = async (id, data) => await updateDoc(doc(db, 'staff', id), data);
export const deleteStaff = async (id) => await deleteDoc(doc(db, 'staff', id));

// ─── Classes ─────────────────────────────────────────────────────────
export const getClasses = () => fetchCollection('classes');
export const getClass = async (id) => formatDoc(await getDoc(doc(db, 'classes', id)));
export const createClass = async (data) => await addDoc(collection(db, 'classes'), data);
export const updateClass = async (id, data) => await updateDoc(doc(db, 'classes', id), data);
export const deleteClass = async (id) => await deleteDoc(doc(db, 'classes', id));

// ─── Subjects ────────────────────────────────────────────────────────
export const getSubjects = () => fetchCollection('subjects');
export const getSubject = async (id) => formatDoc(await getDoc(doc(db, 'subjects', id)));
export const createSubject = async (data) => await addDoc(collection(db, 'subjects'), data);
export const updateSubject = async (id, data) => await updateDoc(doc(db, 'subjects', id), data);
export const deleteSubject = async (id) => await deleteDoc(doc(db, 'subjects', id));

// ─── Timetable ───────────────────────────────────────────────────────
export const getTimetable = () => fetchCollection('timetable');
export const getTimetables = getTimetable;
export const getTimetableEntry = async (id) => formatDoc(await getDoc(doc(db, 'timetable', id)));
export const createTimetable = async (data) => await addDoc(collection(db, 'timetable'), data);
export const updateTimetable = async (id, data) => await updateDoc(doc(db, 'timetable', id), data);
export const deleteTimetable = async (id) => await deleteDoc(doc(db, 'timetable', id));

// ─── Exam Results ────────────────────────────────────────────────────
export const getExamResults = () => fetchCollection('exam-results');
export const getExamResult = async (id) => formatDoc(await getDoc(doc(db, 'exam-results', id)));
export const createExamResult = async (data) => await addDoc(collection(db, 'exam-results'), data);
export const createBulkExamResults = async (results) => {
  for (const res of results) await addDoc(collection(db, 'exam-results'), res);
  return { success: true };
};
export const updateExamResult = async (id, data) => await updateDoc(doc(db, 'exam-results', id), data);
export const deleteExamResult = async (id) => await deleteDoc(doc(db, 'exam-results', id));

// ─── Assignments ─────────────────────────────────────────────────────
export const getAssignments = () => fetchCollection('assignments');
export const getAssignment = async (id) => formatDoc(await getDoc(doc(db, 'assignments', id)));
export const createAssignment = async (data) => await addDoc(collection(db, 'assignments'), data);
export const updateAssignment = async (id, data) => await updateDoc(doc(db, 'assignments', id), data);
export const submitAssignment = async (id, data) => await updateDoc(doc(db, 'assignments', id), { submission: data });
export const deleteAssignment = async (id) => await deleteDoc(doc(db, 'assignments', id));

// ─── Online Classes ──────────────────────────────────────────────────
export const getOnlineClasses = () => fetchCollection('online-classes');
export const getOnlineClass = async (id) => formatDoc(await getDoc(doc(db, 'online-classes', id)));
export const createOnlineClass = async (data) => await addDoc(collection(db, 'online-classes'), data);
export const updateOnlineClass = async (id, data) => await updateDoc(doc(db, 'online-classes', id), data);
export const deleteOnlineClass = async (id) => await deleteDoc(doc(db, 'online-classes', id));

// ─── Attendance ──────────────────────────────────────────────────────
export const getAttendance = () => fetchCollection('attendance');
export const getAttendanceRecord = async (id) => formatDoc(await getDoc(doc(db, 'attendance', id)));
export const markAttendance = async (data) => await addDoc(collection(db, 'attendance'), data);
export const markBulkAttendance = async (records) => {
  for (const rec of records) await addDoc(collection(db, 'attendance'), rec);
  return { success: true };
};
export const updateAttendance = async (id, data) => await updateDoc(doc(db, 'attendance', id), data);
export const deleteAttendance = async (id) => await deleteDoc(doc(db, 'attendance', id));

// ─── Leave Requests ──────────────────────────────────────────────────
export const getLeaveRequests = () => fetchCollection('leave-requests');
export const getLeaveRequest = async (id) => formatDoc(await getDoc(doc(db, 'leave-requests', id)));
export const createLeaveRequest = async (data) => await addDoc(collection(db, 'leave-requests'), data);
export const updateLeaveRequest = async (id, data) => await updateDoc(doc(db, 'leave-requests', id), data);
export const updateLeaveStatus = async (id, data) => await updateDoc(doc(db, 'leave-requests', id), data);
export const deleteLeaveRequest = async (id) => await deleteDoc(doc(db, 'leave-requests', id));

// ─── Fee Management ──────────────────────────────────────────────────
export const getFees = () => fetchCollection('fees');
export const getFee = async (id) => formatDoc(await getDoc(doc(db, 'fees', id)));
export const createFee = async (data) => await addDoc(collection(db, 'fees'), data);
export const updateFee = async (id, data) => await updateDoc(doc(db, 'fees', id), data);
export const deleteFee = async (id) => await deleteDoc(doc(db, 'fees', id));

// ─── Payroll ─────────────────────────────────────────────────────────
export const getPayrolls = () => fetchCollection('payroll');
export const getPayroll = async (id) => formatDoc(await getDoc(doc(db, 'payroll', id)));
export const createPayroll = async (data) => await addDoc(collection(db, 'payroll'), data);
export const updatePayroll = async (id, data) => await updateDoc(doc(db, 'payroll', id), data);
export const deletePayroll = async (id) => await deleteDoc(doc(db, 'payroll', id));

// ─── Accounts ────────────────────────────────────────────────────────
export const getAccounts = () => fetchCollection('accounts');
export const getAccountSummary = async () => ({ revenue: 0, expenses: 0 }); // Placeholder
export const getAccount = async (id) => formatDoc(await getDoc(doc(db, 'accounts', id)));
export const createAccount = async (data) => await addDoc(collection(db, 'accounts'), data);
export const updateAccount = async (id, data) => await updateDoc(doc(db, 'accounts', id), data);
export const deleteAccount = async (id) => await deleteDoc(doc(db, 'accounts', id));

// ─── Notice Board ────────────────────────────────────────────────────
export const getNotices = () => fetchCollection('notices');
export const getNotice = async (id) => formatDoc(await getDoc(doc(db, 'notices', id)));
export const createNotice = async (data) => await addDoc(collection(db, 'notices'), data);
export const updateNotice = async (id, data) => await updateDoc(doc(db, 'notices', id), data);
export const deleteNotice = async (id) => await deleteDoc(doc(db, 'notices', id));

// ─── Messages ────────────────────────────────────────────────────────
export const getInbox = async (userId) => {
  const q = query(collection(db, 'messages'), where('receiver', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(formatDoc);
};
export const getSentMessages = async (userId) => {
  const q = query(collection(db, 'messages'), where('sender', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(formatDoc);
};
export const getMessage = async (id) => formatDoc(await getDoc(doc(db, 'messages', id)));
export const sendMessage = async (data) => await addDoc(collection(db, 'messages'), data);
export const markMessageRead = async (id) => await updateDoc(doc(db, 'messages', id), { isRead: true });
export const toggleMessageStar = async (id) => {
  const m = await getMessage(id);
  await updateDoc(doc(db, 'messages', id), { isStarred: !m.isStarred });
};
export const deleteMessage = async (id) => await deleteDoc(doc(db, 'messages', id));

// ─── Notifications ───────────────────────────────────────────────────
export const getNotifications = async (userId) => {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(formatDoc);
};
export const getNotification = async (id) => formatDoc(await getDoc(doc(db, 'notifications', id)));
export const createNotification = async (data) => await addDoc(collection(db, 'notifications'), data);
export const markNotificationRead = async (id) => await updateDoc(doc(db, 'notifications', id), { isRead: true });
export const markAllNotificationsRead = async (userId) => { return { success: true }; }; // Requires batch
export const deleteNotification = async (id) => await deleteDoc(doc(db, 'notifications', id));

// ─── Library ─────────────────────────────────────────────────────────
export const getBooks = () => fetchCollection('library');
export const getLibraryBooks = getBooks;
export const getBook = async (id) => formatDoc(await getDoc(doc(db, 'library', id)));
export const addBook = async (data) => await addDoc(collection(db, 'library'), data);
export const createLibraryBook = addBook;
export const updateBook = async (id, data) => await updateDoc(doc(db, 'library', id), data);
export const issueBook = async (id, data) => await updateDoc(doc(db, 'library', id), { issueData: data });
export const returnBook = async (id, issueId, data) => await updateDoc(doc(db, 'library', id), { returnData: data });
export const deleteBook = async (id) => await deleteDoc(doc(db, 'library', id));
export const deleteLibraryBook = deleteBook;

// ─── Transport ───────────────────────────────────────────────────────
export const getTransportRoutes = () => fetchCollection('transport');
export const getTransports = getTransportRoutes;
export const getTransportRoute = async (id) => formatDoc(await getDoc(doc(db, 'transport', id)));
export const createTransportRoute = async (data) => await addDoc(collection(db, 'transport'), data);
export const createTransport = createTransportRoute;
export const updateTransportRoute = async (id, data) => await updateDoc(doc(db, 'transport', id), data);
export const deleteTransportRoute = async (id) => await deleteDoc(doc(db, 'transport', id));
export const deleteTransport = deleteTransportRoute;

// ─── Hostel ──────────────────────────────────────────────────────────
export const getHostelRooms = () => fetchCollection('hostel');
export const getHostels = getHostelRooms;
export const getHostelRoom = async (id) => formatDoc(await getDoc(doc(db, 'hostel', id)));
export const createHostelRoom = async (data) => await addDoc(collection(db, 'hostel'), data);
export const createHostel = createHostelRoom;
export const updateHostelRoom = async (id, data) => await updateDoc(doc(db, 'hostel', id), data);
export const deleteHostelRoom = async (id) => await deleteDoc(doc(db, 'hostel', id));
export const deleteHostel = deleteHostelRoom;

// ─── Inventory ───────────────────────────────────────────────────────
export const getInventory = () => fetchCollection('inventory');
export const getInventoryItem = async (id) => formatDoc(await getDoc(doc(db, 'inventory', id)));
export const addInventoryItem = async (data) => await addDoc(collection(db, 'inventory'), data);
export const updateInventoryItem = async (id, data) => await updateDoc(doc(db, 'inventory', id), data);
export const deleteInventoryItem = async (id) => await deleteDoc(doc(db, 'inventory', id));

// ─── School Calendar ─────────────────────────────────────────────────
export const getCalendarEvents = () => fetchCollection('calendar');
export const getCalendarEvent = async (id) => formatDoc(await getDoc(doc(db, 'calendar', id)));
export const createCalendarEvent = async (data) => await addDoc(collection(db, 'calendar'), data);
export const updateCalendarEvent = async (id, data) => await updateDoc(doc(db, 'calendar', id), data);
export const deleteCalendarEvent = async (id) => await deleteDoc(doc(db, 'calendar', id));

// ─── Reports ─────────────────────────────────────────────────────────
export const getReports = () => fetchCollection('reports');
export const getReport = async (id) => formatDoc(await getDoc(doc(db, 'reports', id)));
export const generateReport = async (data) => await addDoc(collection(db, 'reports'), data);
export const updateReport = async (id, data) => await updateDoc(doc(db, 'reports', id), data);
export const deleteReport = async (id) => await deleteDoc(doc(db, 'reports', id));

// ─── Profile & Settings ──────────────────────────────────────────────
export const getProfile = async (userId) => formatDoc(await getDoc(doc(db, 'users', userId)));
export const updateProfile = async (userId, data) => await updateDoc(doc(db, 'users', userId), data);
export const changePassword = async () => { return { success: true }; };
export const getSettings = async (userId) => formatDoc(await getDoc(doc(db, 'settings', userId)));
export const updateSettings = async (userId, data) => await updateDoc(doc(db, 'settings', userId), data);

// ─── Admin Settings ──────────────────────────────────────────────────
export const getAdminSettings = async () => formatDoc(await getDoc(doc(db, 'adminSettings', 'global')));
export const updateAdminSettings = async (data) => await updateDoc(doc(db, 'adminSettings', 'global'), data);
export const getModuleSettings = async () => formatDoc(await getDoc(doc(db, 'adminSettings', 'modules')));
export const updateModuleSettings = async (data) => await updateDoc(doc(db, 'adminSettings', 'modules'), data);
