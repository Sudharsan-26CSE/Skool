// Pure frontend mock store with rich initial data for Admin and all roles

const initialStudents = [
  { _id: 'stu-1', admissionNo: 'STU-1001', user: { name: 'Janet Adebayo' }, class: { className: 'Grade 10-A' }, parentName: 'Michael Adebayo', parentPhone: '+1 (555) 234-5678', isActive: true },
  { _id: 'stu-2', admissionNo: 'STU-1002', user: { name: 'Marcus Chen' }, class: { className: 'Grade 9-B' }, parentName: 'David Chen', parentPhone: '+1 (555) 234-5679', isActive: true },
  { _id: 'stu-3', admissionNo: 'STU-1003', user: { name: 'Sophia Smith' }, class: { className: 'Grade 11-A' }, parentName: 'Sarah Smith', parentPhone: '+1 (555) 234-5680', isActive: true },
  { _id: 'stu-4', admissionNo: 'STU-1004', user: { name: 'Lucas Williams' }, class: { className: 'Grade 8-C' }, parentName: 'Robert Williams', parentPhone: '+1 (555) 234-5681', isActive: false },
  { _id: 'stu-5', admissionNo: 'STU-1005', user: { name: 'Olivia Johnson' }, class: { className: 'Grade 12-A' }, parentName: 'Emma Johnson', parentPhone: '+1 (555) 234-5682', isActive: true },
  { _id: 'stu-6', admissionNo: 'STU-1006', user: { name: 'Liam Brown' }, class: { className: 'Grade 10-B' }, parentName: 'Thomas Brown', parentPhone: '+1 (555) 234-5683', isActive: true },
  { _id: 'stu-7', admissionNo: 'STU-1007', user: { name: 'Ava Martinez' }, class: { className: 'Grade 9-A' }, parentName: 'Carlos Martinez', parentPhone: '+1 (555) 234-5684', isActive: true },
];

const initialStaff = [
  { _id: 'tch-1', employeeId: 'TCH-201', department: 'Mathematics', designation: 'Senior Lecturer', qualification: 'Ph.D in Applied Math', experience: '8 years', joiningDate: '2018-08-15', user: { name: 'Dr. Sarah Connor', role: 'teacher', email: 's.connor@preskool.edu', phone: '+1 555-0101' }, isActive: true },
  { _id: 'tch-2', employeeId: 'TCH-202', department: 'Physics & Science', designation: 'Professor', qualification: 'M.Sc Physics', experience: '12 years', joiningDate: '2015-01-10', user: { name: 'Prof. Albert Vance', role: 'teacher', email: 'a.vance@preskool.edu', phone: '+1 555-0102' }, isActive: true },
  { _id: 'tch-3', employeeId: 'TCH-203', department: 'Computer Science', designation: 'Assistant Professor', qualification: 'M.Tech CSE', experience: '5 years', joiningDate: '2020-07-01', user: { name: 'Elena Rostova', role: 'teacher', email: 'e.rostova@preskool.edu', phone: '+1 555-0103' }, isActive: true },
  { _id: 'tch-4', employeeId: 'TCH-204', department: 'English Literature', designation: 'Head of Department', qualification: 'Ph.D English', experience: '15 years', joiningDate: '2012-09-01', user: { name: 'Arthur Pendelton', role: 'teacher', email: 'a.pendelton@preskool.edu', phone: '+1 555-0104' }, isActive: true },
  { _id: 'stf-1', employeeId: 'STF-301', department: 'Administration', designation: 'Chief Registrar', qualification: 'MBA Administration', experience: '9 years', joiningDate: '2019-02-14', user: { name: 'Robert Vance', role: 'staff', email: 'r.vance@preskool.edu', phone: '+1 555-0201' }, isActive: true },
  { _id: 'stf-2', employeeId: 'STF-302', department: 'Library', designation: 'Head Librarian', qualification: 'M.Lib.Sc', experience: '7 years', joiningDate: '2021-04-10', user: { name: 'Clara Oswald', role: 'staff', email: 'c.oswald@preskool.edu', phone: '+1 555-0202' }, isActive: true },
  { _id: 'stf-3', employeeId: 'STF-303', department: 'Finance & Accounts', designation: 'Lead Accountant', qualification: 'CPA / M.Com', experience: '11 years', joiningDate: '2017-11-20', user: { name: 'Gregory House', role: 'staff', email: 'g.house@preskool.edu', phone: '+1 555-0203' }, isActive: true },
  { _id: 'stf-4', employeeId: 'STF-304', department: 'IT Support', designation: 'Network Administrator', qualification: 'B.S Computer Engineering', experience: '4 years', joiningDate: '2022-03-15', user: { name: 'James Holden', role: 'staff', email: 'j.holden@preskool.edu', phone: '+1 555-0204' }, isActive: true }
];

const initialClasses = [
  { _id: 'cls-1', name: 'Grade 9', section: 'A', classTeacher: { name: 'Arthur Pendelton' }, capacity: 35 },
  { _id: 'cls-2', name: 'Grade 9', section: 'B', classTeacher: { name: 'Elena Rostova' }, capacity: 32 },
  { _id: 'cls-3', name: 'Grade 10', section: 'A', classTeacher: { name: 'Dr. Sarah Connor' }, capacity: 38 },
  { _id: 'cls-4', name: 'Grade 10', section: 'B', classTeacher: { name: 'Prof. Albert Vance' }, capacity: 36 },
  { _id: 'cls-5', name: 'Grade 11', section: 'A', classTeacher: { name: 'Dr. Sarah Connor' }, capacity: 30 },
  { _id: 'cls-6', name: 'Grade 12', section: 'A', classTeacher: { name: 'Prof. Albert Vance' }, capacity: 28 },
];

const initialSubjects = [
  { _id: 'sub-1', code: 'MATH-101', name: 'Mathematics & Calculus', category: 'Core Academic', credits: 4, description: 'Grade 10, Grade 11' },
  { _id: 'sub-2', code: 'PHY-201', name: 'Modern Physics & Lab', category: 'Core Science', credits: 4, description: 'Grade 11, Grade 12' },
  { _id: 'sub-3', code: 'ENG-102', name: 'English Literature & Composition', category: 'Humanities', credits: 3, description: 'Grade 9, Grade 10' },
  { _id: 'sub-4', code: 'CS-301', name: 'Computer Science & Python', category: 'Technology', credits: 4, description: 'Grade 10, Grade 11' },
  { _id: 'sub-5', code: 'CHEM-202', name: 'Organic & Inorganic Chemistry', category: 'Core Science', credits: 4, description: 'Grade 11, Grade 12' },
  { _id: 'sub-6', code: 'BIO-105', name: 'General Biology & Genetics', category: 'Life Sciences', credits: 3, description: 'Grade 9, Grade 10' },
  { _id: 'sub-7', code: 'HIST-104', name: 'World History & Civics', category: 'Social Sciences', credits: 3, description: 'Grade 9, Grade 10' },
];

const initialTimetable = [
  { _id: 'tt-1', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Mathematics & Calculus', room: 'Room 301', teacher: 'Dr. Sarah Connor' },
  { _id: 'tt-2', day: 'Monday', startTime: '10:15 AM', endTime: '11:15 AM', subject: 'Modern Physics & Lab', room: 'Physics Lab 1', teacher: 'Prof. Albert Vance' },
  { _id: 'tt-3', day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Computer Science & Python', room: 'Computer Lab 2', teacher: 'Elena Rostova' },
  { _id: 'tt-4', day: 'Tuesday', startTime: '10:15 AM', endTime: '11:15 AM', subject: 'English Literature', room: 'Room 204', teacher: 'Arthur Pendelton' },
  { _id: 'tt-5', day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Organic Chemistry', room: 'Chemistry Lab', teacher: 'Dr. Sarah Connor' },
  { _id: 'tt-6', day: 'Thursday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Mathematics & Calculus', room: 'Room 301', teacher: 'Dr. Sarah Connor' },
  { _id: 'tt-7', day: 'Friday', startTime: '10:15 AM', endTime: '11:15 AM', subject: 'World History', room: 'Room 105', teacher: 'Arthur Pendelton' },
];

const initialNotices = [
  { _id: 'not-1', title: 'Annual Sports Meet 2026 Registration Open', category: 'Event', validFrom: '2026-09-01', validUntil: '2026-10-15', content: 'Registrations are now open for track, field, football, and basketball tournaments. Submit entries to the athletics department.', postedBy: { name: 'Principal Office' } },
  { _id: 'not-2', title: 'Mid-Term Examination Schedule Released', category: 'Academic', validFrom: '2026-09-10', validUntil: '2026-10-30', content: 'The comprehensive examination timetable for Grades 9 through 12 has been published. Please review class schedules.', postedBy: { name: 'Academic Dean' } },
  { _id: 'not-3', title: 'Parent-Teacher Conference Day', category: 'Meeting', validFrom: '2026-09-15', validUntil: '2026-09-25', content: 'Semester progress discussion sessions will be held this Saturday between 9:00 AM and 3:00 PM in the auditorium.', postedBy: { name: 'Administration' } },
  { _id: 'not-4', title: 'Library Book Return & Amnesty Week', category: 'Library', validFrom: '2026-09-12', validUntil: '2026-09-28', content: 'All students with overdue books can return them without late penalty fees during this week.', postedBy: { name: 'Clara Oswald' } },
];

const initialLibraryBooks = [
  { _id: 'lib-1', isbn: '978-0131103627', title: 'The C Programming Language', author: 'Brian W. Kernighan', totalCopies: 15, availableCopies: 11, category: 'Computer Science' },
  { _id: 'lib-2', isbn: '978-0451524935', title: '1984', author: 'George Orwell', totalCopies: 25, availableCopies: 19, category: 'Literature' },
  { _id: 'lib-3', isbn: '978-0133570533', title: 'University Physics with Modern Physics', author: 'Hugh D. Young', totalCopies: 18, availableCopies: 6, category: 'Science' },
  { _id: 'lib-4', isbn: '978-0262033848', title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen', totalCopies: 12, availableCopies: 4, category: 'Computer Science' },
  { _id: 'lib-5', isbn: '978-0062316097', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', totalCopies: 20, availableCopies: 14, category: 'History' },
];

const initialTransports = [
  { _id: 'tr-1', vehicleNo: 'BUS-01', driverName: 'John Miller', driverPhone: '+1 555-0811', routeName: 'North Suburbs - Route A', capacity: 45, isActive: true },
  { _id: 'tr-2', vehicleNo: 'BUS-02', driverName: 'Samuel Jackson', driverPhone: '+1 555-0812', routeName: 'East Downtown - Route B', capacity: 50, isActive: true },
  { _id: 'tr-3', vehicleNo: 'BUS-03', driverName: 'Marcus Reynolds', driverPhone: '+1 555-0813', routeName: 'West Valley - Route C', capacity: 40, isActive: true },
];

const initialHostels = [
  { _id: 'hst-1', hostelName: 'Boys Hostel A', roomNo: '101', roomType: 'double', capacity: 2, occupants: [{ name: 'Marcus Chen' }], monthlyFee: 500, isAvailable: true },
  { _id: 'hst-2', hostelName: 'Girls Hostel B', roomNo: '205', roomType: 'triple', capacity: 3, occupants: [{ name: 'Janet Adebayo' }, { name: 'Sophia Smith' }], monthlyFee: 400, isAvailable: true },
  { _id: 'hst-3', hostelName: 'Boys Hostel A', roomNo: '102', roomType: 'single', capacity: 1, occupants: [{ name: 'Lucas Williams' }], monthlyFee: 800, isAvailable: false },
  { _id: 'hst-4', hostelName: 'Girls Hostel B', roomNo: '208', roomType: 'double', capacity: 2, occupants: [], monthlyFee: 500, isAvailable: true },
];

const initialFees = [
  { _id: 'INV-2026-001', student: { name: 'Janet Adebayo', class: { name: 'Grade 10-A' } }, feeType: 'Tuition Term 1', amount: 4500, totalAmount: 4500, dueDate: '2026-10-01', status: 'paid' },
  { _id: 'INV-2026-002', student: { name: 'Marcus Chen', class: { name: 'Grade 9-B' } }, feeType: 'Annual Admission Fee', amount: 4200, totalAmount: 4200, dueDate: '2026-10-15', status: 'pending' },
  { _id: 'INV-2026-003', student: { name: 'Sophia Smith', class: { name: 'Grade 11-A' } }, feeType: 'Laboratory & Tech Fee', amount: 1800, totalAmount: 1800, dueDate: '2026-09-30', status: 'paid' },
  { _id: 'INV-2026-004', student: { name: 'Lucas Williams', class: { name: 'Grade 8-C' } }, feeType: 'Tuition Term 1', amount: 4000, totalAmount: 4000, dueDate: '2026-08-30', status: 'overdue' },
];

const initialPayrolls = [
  { _id: 'PAY-101', staff: { name: 'Dr. Sarah Connor', role: 'Teacher' }, netPay: 5400.00, status: 'paid', month: 9, year: 2026 },
  { _id: 'PAY-102', staff: { name: 'Prof. Albert Vance', role: 'Teacher' }, netPay: 6100.00, status: 'paid', month: 9, year: 2026 },
  { _id: 'PAY-103', staff: { name: 'Robert Vance', role: 'Head Registrar' }, netPay: 4800.00, status: 'paid', month: 9, year: 2026 },
  { _id: 'PAY-104', staff: { name: 'Clara Oswald', role: 'Head Librarian' }, netPay: 4200.00, status: 'pending', month: 9, year: 2026 },
];

const initialOnlineClasses = [
  { _id: 'on-1', title: 'Calculus Advanced Problem Solving', teacher: { name: 'Dr. Sarah Connor' }, class: { name: 'Grade 12-A' }, startTime: '10:00 AM', endTime: '11:30 AM', status: 'live' },
  { _id: 'on-2', title: 'Quantum Mechanics Introduction', teacher: { name: 'Prof. Albert Vance' }, class: { name: 'Grade 11-A' }, startTime: '02:00 PM', endTime: '03:30 PM', status: 'scheduled' },
  { _id: 'on-3', title: 'Python Data Structures', teacher: { name: 'Elena Rostova' }, class: { name: 'Grade 10-A' }, startTime: '04:00 PM', endTime: '05:00 PM', status: 'scheduled' },
];

// In-memory store initialized with deep clones
let db = {
  students: [...initialStudents],
  staff: [...initialStaff],
  classes: [...initialClasses],
  subjects: [...initialSubjects],
  timetables: [...initialTimetable],
  notices: [...initialNotices],
  libraryBooks: [...initialLibraryBooks],
  transports: [...initialTransports],
  hostels: [...initialHostels],
  fees: [...initialFees],
  payrolls: [...initialPayrolls],
  onlineClasses: [...initialOnlineClasses],
  assignments: [],
  results: [],
  attendance: [],
  leaveRequests: [],
  accounts: []
};

export const loginUser = async (email, password) => {
  const user = { name: 'Admin User', email: 'admin@skool.com', role: 'admin' };
  localStorage.setItem('token', 'mock-token-123');
  localStorage.setItem('preskool-role', 'admin');
  return { user, token: 'mock-token-123' };
};

export const registerUser = async (userData) => {
  return { user: userData, token: 'mock-token-123' };
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

// Students API
export const getStudents = async () => ({ students: [...db.students] });
export const getStudent = async (id) => db.students.find(s => s._id === id) || db.students[0];
export const createStudent = async (data) => {
  const newStudent = {
    _id: `stu-${Date.now()}`,
    admissionNo: data.admissionNo || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    user: { name: data.name || data.firstName || 'New Student' },
    class: { className: data.className || data.class || 'Grade 10-A' },
    parentName: data.parentName || 'Parent Name',
    parentPhone: data.parentPhone || '+1 (555) 000-0000',
    isActive: true,
    ...data
  };
  db.students.unshift(newStudent);
  return { student: newStudent };
};
export const updateStudent = async (id, data) => {
  db.students = db.students.map(s => s._id === id ? { ...s, ...data } : s);
  return { student: db.students.find(s => s._id === id) };
};
export const deleteStudent = async (id) => {
  db.students = db.students.filter(s => s._id !== id);
  return { message: 'Deleted successfully' };
};

// Staff API (supports 'teacher' or 'staff' filter)
export const getStaff = async (roleFilter) => {
  let list = db.staff;
  if (roleFilter === 'teacher') {
    list = db.staff.filter(s => s.user?.role === 'teacher');
  } else if (roleFilter === 'staff') {
    list = db.staff.filter(s => s.user?.role === 'staff');
  }
  return { staff: [...list] };
};
export const getStaffMember = async (id) => db.staff.find(s => s._id === id) || db.staff[0];
export const createStaff = async (data) => {
  const newStaff = {
    _id: `stf-${Date.now()}`,
    employeeId: data.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
    department: data.department || 'Academic',
    designation: data.designation || 'Instructor',
    user: {
      name: data.name || data.fullName || 'Staff Member',
      role: data.role || 'staff',
      email: data.email || 'staff@preskool.edu',
      phone: data.phone || '+1 555-0199'
    },
    isActive: true,
    ...data
  };
  db.staff.unshift(newStaff);
  return { staff: newStaff };
};
export const updateStaff = async (id, data) => {
  db.staff = db.staff.map(s => s._id === id ? { ...s, ...data } : s);
  return { staff: db.staff.find(s => s._id === id) };
};
export const deleteStaff = async (id) => {
  db.staff = db.staff.filter(s => s._id !== id);
  return { message: 'Deleted successfully' };
};

// Classes API
export const getClasses = async () => ({ classes: [...db.classes] });
export const getClass = async (id) => db.classes.find(c => c._id === id) || db.classes[0];
export const createClass = async (data) => {
  const newClass = {
    _id: `cls-${Date.now()}`,
    name: data.name || data.className || 'Grade 10',
    section: data.section || 'A',
    classTeacher: { name: data.teacherName || 'Dr. Sarah Connor' },
    capacity: Number(data.capacity) || 35,
    ...data
  };
  db.classes.push(newClass);
  return { class: newClass };
};
export const updateClass = async (id, data) => {
  db.classes = db.classes.map(c => c._id === id ? { ...c, ...data } : c);
  return { class: db.classes.find(c => c._id === id) };
};
export const deleteClass = async (id) => {
  db.classes = db.classes.filter(c => c._id !== id);
  return { message: 'Deleted successfully' };
};

// Subjects API
export const getSubjects = async () => ({ subjects: [...db.subjects] });
export const getSubject = async (id) => db.subjects.find(s => s._id === id) || db.subjects[0];
export const createSubject = async (data) => {
  const newSub = {
    _id: `sub-${Date.now()}`,
    code: data.code || `SUB-${Math.floor(100 + Math.random() * 900)}`,
    name: data.subjectName || data.name || 'New Subject',
    category: data.category || 'Academic',
    credits: Number(data.credits) || 3,
    description: data.description || 'General Curriculum',
    ...data
  };
  db.subjects.push(newSub);
  return { subject: newSub };
};
export const updateSubject = async (id, data) => {
  db.subjects = db.subjects.map(s => s._id === id ? { ...s, ...data } : s);
  return { subject: db.subjects.find(s => s._id === id) };
};
export const deleteSubject = async (id) => {
  db.subjects = db.subjects.filter(s => s._id !== id);
  return { message: 'Deleted successfully' };
};

// Timetable API
export const getTimetables = async () => ({ timetables: [...db.timetables] });
export const getTimetable = async (id) => db.timetables.find(t => t._id === id) || db.timetables[0];
export const createTimetable = async (data) => {
  const newSlot = {
    _id: `tt-${Date.now()}`,
    day: data.day || 'Monday',
    startTime: data.startTime || '09:00 AM',
    endTime: data.endTime || '10:00 AM',
    subject: data.subject || 'Mathematics',
    room: data.room || 'Room 101',
    teacher: data.teacher || 'Dr. Sarah Connor',
    ...data
  };
  db.timetables.push(newSlot);
  return { timetable: newSlot };
};
export const updateTimetable = async (id, data) => {
  db.timetables = db.timetables.map(t => t._id === id ? { ...t, ...data } : t);
  return { timetable: db.timetables.find(t => t._id === id) };
};
export const deleteTimetable = async (id) => {
  db.timetables = db.timetables.filter(t => t._id !== id);
  return { message: 'Deleted successfully' };
};

// Notice Board API
export const getNotices = async () => ({ notices: [...db.notices] });
export const getNotice = async (id) => db.notices.find(n => n._id === id) || db.notices[0];
export const createNotice = async (data) => {
  const newNotice = {
    _id: `not-${Date.now()}`,
    title: data.title || 'School Circular',
    category: data.category || 'General',
    validFrom: data.validFrom || new Date().toISOString().split('T')[0],
    validUntil: data.validUntil || '',
    content: data.content || '',
    postedBy: { name: 'Admin Office' },
    ...data
  };
  db.notices.unshift(newNotice);
  return { notice: newNotice };
};
export const updateNotice = async (id, data) => {
  db.notices = db.notices.map(n => n._id === id ? { ...n, ...data } : n);
  return { notice: db.notices.find(n => n._id === id) };
};
export const deleteNotice = async (id) => {
  db.notices = db.notices.filter(n => n._id !== id);
  return { message: 'Deleted successfully' };
};

// Facilities: Library, Transport, Hostel, Inventory
export const getLibraryBooks = async () => ({ libraryBooks: [...db.libraryBooks] });
export const createLibraryBook = async (data) => {
  const newBook = { _id: `lib-${Date.now()}`, isbn: data.isbn || 'ISBN-000', title: data.title || 'Book', author: data.author || 'Author', totalCopies: Number(data.totalCopies) || 5, availableCopies: Number(data.totalCopies) || 5, category: data.category || 'General', ...data };
  db.libraryBooks.unshift(newBook);
  return { book: newBook };
};
export const updateLibraryBook = async (id, data) => {
  db.libraryBooks = db.libraryBooks.map(b => b._id === id ? { ...b, ...data } : b);
  return { book: db.libraryBooks.find(b => b._id === id) };
};
export const deleteLibraryBook = async (id) => {
  db.libraryBooks = db.libraryBooks.filter(b => b._id !== id);
  return { message: 'Deleted successfully' };
};

export const getTransports = async () => ({ transports: [...db.transports] });
export const createTransport = async (data) => {
  const newTr = { _id: `tr-${Date.now()}`, vehicleNo: data.vehicleNo || 'BUS-00', driverName: data.driverName || 'Driver', driverPhone: data.driverPhone || '+1 555-0000', routeName: data.routeName || 'Campus Route', capacity: Number(data.capacity) || 40, isActive: true, ...data };
  db.transports.push(newTr);
  return { transport: newTr };
};
export const updateTransport = async (id, data) => {
  db.transports = db.transports.map(t => t._id === id ? { ...t, ...data } : t);
  return { transport: db.transports.find(t => t._id === id) };
};
export const deleteTransport = async (id) => {
  db.transports = db.transports.filter(t => t._id !== id);
  return { message: 'Deleted successfully' };
};

export const getHostels = async () => ({ hostels: [...db.hostels] });
export const createHostel = async (data) => {
  const newHostel = { _id: `hst-${Date.now()}`, hostelName: data.hostelName || 'Hostel A', roomNo: data.roomNo || '101', roomType: data.roomType || 'double', capacity: Number(data.capacity) || 2, occupants: [], monthlyFee: Number(data.monthlyFee) || 500, isAvailable: true, ...data };
  db.hostels.push(newHostel);
  return { hostel: newHostel };
};
export const updateHostel = async (id, data) => {
  db.hostels = db.hostels.map(h => h._id === id ? { ...h, ...data } : h);
  return { hostel: db.hostels.find(h => h._id === id) };
};
export const deleteHostel = async (id) => {
  db.hostels = db.hostels.filter(h => h._id !== id);
  return { message: 'Deleted successfully' };
};

export const getInventory = async () => ({ inventory: [...db.inventory] });
export const createInventory = async (data) => null;
export const updateInventory = async () => null;
export const deleteInventory = async () => null;

// Finance: Fees, Payroll, Accounts
export const getFees = async () => ({ fees: [...db.fees] });
export const getFee = async (id) => db.fees.find(f => f._id === id) || db.fees[0];
export const createFee = async (data) => {
  const newFee = { _id: `INV-${Date.now()}`, student: { name: data.studentName || 'Student Name', class: { name: data.className || 'Grade 10-A' } }, feeType: data.feeType || 'Tuition', amount: Number(data.amount) || 2500, totalAmount: Number(data.amount) || 2500, dueDate: data.dueDate || new Date().toISOString().split('T')[0], status: 'pending', ...data };
  db.fees.unshift(newFee);
  return { fee: newFee };
};
export const updateFee = async (id, data) => {
  db.fees = db.fees.map(f => f._id === id ? { ...f, ...data } : f);
  return { fee: db.fees.find(f => f._id === id) };
};
export const deleteFee = async (id) => {
  db.fees = db.fees.filter(f => f._id !== id);
  return { message: 'Deleted successfully' };
};

export const getPayrolls = async () => ({ payrolls: [...db.payrolls] });
export const getPayroll = async (id) => db.payrolls.find(p => p._id === id) || db.payrolls[0];
export const createPayroll = async (data) => {
  const newPayroll = { _id: `PAY-${Date.now()}`, staff: { name: data.staffName || 'Staff Member', role: data.role || 'Teacher' }, netPay: Number(data.netPay) || 5000, status: 'paid', month: Number(data.month) || 9, year: Number(data.year) || 2026, ...data };
  db.payrolls.unshift(newPayroll);
  return { payroll: newPayroll };
};
export const updatePayroll = async (id, data) => {
  db.payrolls = db.payrolls.map(p => p._id === id ? { ...p, ...data } : p);
  return { payroll: db.payrolls.find(p => p._id === id) };
};
export const deletePayroll = async (id) => {
  db.payrolls = db.payrolls.filter(p => p._id !== id);
  return { message: 'Deleted successfully' };
};

export const getAccounts = async () => ({ accounts: [...db.accounts] });
export const getAccount = async () => null;
export const createAccount = async () => null;
export const updateAccount = async () => null;
export const deleteAccount = async () => null;

// Academics & Online Classes
export const getOnlineClasses = async () => ({ onlineClasses: [...db.onlineClasses] });
export const getOnlineClass = async (id) => db.onlineClasses.find(o => o._id === id) || db.onlineClasses[0];
export const createOnlineClass = async (data) => {
  const newClass = { _id: `on-${Date.now()}`, title: data.title || 'Online Lecture', teacher: { name: data.teacherName || 'Dr. Sarah Connor' }, class: { name: data.className || 'Grade 10-A' }, startTime: data.startTime || '10:00 AM', endTime: data.endTime || '11:00 AM', status: 'scheduled', ...data };
  db.onlineClasses.push(newClass);
  return { onlineClass: newClass };
};
export const updateOnlineClass = async (id, data) => {
  db.onlineClasses = db.onlineClasses.map(o => o._id === id ? { ...o, ...data } : o);
  return { onlineClass: db.onlineClasses.find(o => o._id === id) };
};
export const deleteOnlineClass = async (id) => {
  db.onlineClasses = db.onlineClasses.filter(o => o._id !== id);
  return { message: 'Deleted successfully' };
};

// Assignments, Results, Attendance, Leave Requests
export const getAssignments = async () => ({ assignments: [...db.assignments] });
export const getAssignment = async () => null;
export const createAssignment = async () => null;
export const updateAssignment = async () => null;
export const deleteAssignment = async () => null;

export const getResults = async () => ({ results: [...db.results] });
export const getResult = async () => null;
export const createResult = async () => null;
export const updateResult = async () => null;
export const deleteResult = async () => null;

export const getAttendance = async () => ({ attendance: [...db.attendance] });
export const getAttendanceRecord = async () => null;
export const createAttendance = async () => null;
export const updateAttendance = async () => null;
export const deleteAttendance = async () => null;

export const getLeaveRequests = async () => ({ requests: [...db.leaveRequests] });
export const getLeaveRequest = async () => null;
export const createLeaveRequest = async () => null;
export const updateLeaveRequest = async () => null;
export const deleteLeaveRequest = async () => null;

export const deleteEvent = async () => null;
export const createEvent = async () => null;
export const updateEvent = async () => null;
export const deleteUser = async () => null;
export const createUser = async () => null;
export const updateUser = async () => null;

export const createNotification = async (data) => ({ notification: data });
export const getNotifications = async () => ({ notifications: [] });
export const deleteNotification = async () => null;

