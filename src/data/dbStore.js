import dbSnapshot from './dbSnapshot.json';

const STORAGE_KEY = 'preskool_live_db_v1';

const COLLECTION_MAP = {
  staff: 'staffs',
  staffs: 'staffs',
  teacher: 'staffs',
  teachers: 'staffs',
  attendance: 'attendances',
  attendances: 'attendances',
  leave: 'leaves',
  leaves: 'leaves',
  leaveRequests: 'leaves',
  leaverequests: 'leaves',
  library: 'librarybooks',
  libraryBooks: 'librarybooks',
  librarybooks: 'librarybooks',
  onlineClass: 'onlineclasses',
  onlineClasses: 'onlineclasses',
  onlineclasses: 'onlineclasses',
  examResult: 'examresults',
  examResults: 'examresults',
  examresults: 'examresults',
  results: 'examresults',
  result: 'examresults',
  payroll: 'payrolls',
  payrolls: 'payrolls',
  transport: 'transports',
  transports: 'transports',
  hostel: 'hostels',
  hostels: 'hostels',
  fee: 'fees',
  fees: 'fees',
  class: 'classes',
  classes: 'classes',
  subject: 'subjects',
  subjects: 'subjects',
  assignment: 'assignments',
  assignments: 'assignments',
  student: 'students',
  students: 'students',
  notice: 'notices',
  notices: 'notices',
  user: 'users',
  users: 'users'
};

const resolveCollection = (name) => {
  if (!name) return name;
  const lower = name.toLowerCase();
  return COLLECTION_MAP[name] || COLLECTION_MAP[lower] || name;
};

// Initialize DB from snapshot + local storage
export const getDatabaseState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all collections exist
      return { ...dbSnapshot, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to parse stored DB state, falling back to snapshot:', e);
  }
  return { ...dbSnapshot };
};

export const saveDatabaseState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to persist DB state:', e);
  }
};

// Populate relations (user, class, student, staff)
const populateDoc = (doc, targetColl, state) => {
  if (!doc) return doc;
  const populated = { ...doc };

  // Populate 'user'
  if (populated.user) {
    const userId = typeof populated.user === 'object' ? populated.user._id : populated.user;
    const userDoc = (state.users || []).find(u => u._id === userId);
    if (userDoc) {
      populated.user = { ...userDoc };
    } else if (typeof populated.user === 'string') {
      populated.user = {
        _id: populated.user,
        name: populated.name || populated.studentName || 'User',
        email: populated.email || '',
        role: targetColl === 'students' ? 'student' : targetColl === 'staffs' ? (populated.role || 'teacher') : 'user'
      };
    }
  } else if (targetColl === 'students') {
    populated.user = {
      _id: populated._id,
      name: populated.name,
      email: populated.email,
      role: 'student'
    };
  } else if (targetColl === 'staffs') {
    populated.user = {
      _id: populated._id,
      name: populated.name,
      email: populated.email || 'staff@skool.edu',
      role: populated.role || 'teacher'
    };
  }

  // Populate 'class'
  if (populated.class) {
    const classId = typeof populated.class === 'object' ? populated.class._id : populated.class;
    const classDoc = (state.classes || []).find(c => c._id === classId);
    if (classDoc) {
      populated.class = { ...classDoc };
    }
  }

  // Populate 'student'
  if (populated.student) {
    const studentId = typeof populated.student === 'object' ? populated.student._id : populated.student;
    const studentDoc = (state.students || []).find(s => s._id === studentId);
    if (studentDoc) {
      populated.student = populateDoc(studentDoc, 'students', state);
    }
  }

  // Populate 'staff'
  if (populated.staff) {
    const staffId = typeof populated.staff === 'object' ? populated.staff._id : populated.staff;
    const staffDoc = (state.staffs || []).find(s => s._id === staffId);
    if (staffDoc) {
      populated.staff = populateDoc(staffDoc, 'staffs', state);
    }
  }

  return populated;
};

// Query collection
export const queryLocalCollection = (rawName, params = {}) => {
  const targetColl = resolveCollection(rawName);
  const state = getDatabaseState();
  let items = (state[targetColl] || []).map(item => populateDoc(item, targetColl, state));

  const { role, classId, className, date } = params;

  if (classId) {
    items = items.filter(item => {
      const cId = item.class?._id || item.class;
      return String(cId) === String(classId);
    });
  }

  if (className) {
    items = items.filter(item => (item.className || item.class?.className || '') === className);
  }

  if (date) {
    items = items.filter(item => String(item.date || item.createdAt || '').startsWith(date));
  }

  if (targetColl === 'staffs' && role) {
    items = items.filter(item => {
      const itemRole = item.role || item.user?.role || '';
      const designation = (item.designation || '').toLowerCase();
      const dept = (item.department || '').toLowerCase();
      if (role === 'teacher') {
        return itemRole === 'teacher' || designation.includes('teacher') || designation.includes('lecturer') || designation.includes('professor') || dept.includes('math') || dept.includes('science') || dept.includes('english');
      } else if (role === 'staff') {
        return itemRole !== 'teacher' && !designation.includes('teacher') && !designation.includes('lecturer') && !designation.includes('professor');
      }
      return true;
    });
  }

  return {
    success: true,
    count: items.length,
    [rawName]: items,
    [targetColl]: items,
    items,
    data: items
  };
};

export const getLocalItemById = (rawName, id) => {
  const targetColl = resolveCollection(rawName);
  const state = getDatabaseState();
  const items = state[targetColl] || [];
  const found = items.find(i => String(i._id || i.id) === String(id));
  if (!found) {
    return null;
  }
  return populateDoc(found, targetColl, state);
};

export const createLocalItem = (rawName, data) => {
  const targetColl = resolveCollection(rawName);
  const state = getDatabaseState();
  const items = [...(state[targetColl] || [])];
  
  const newItem = {
    ...data,
    _id: data._id || `db_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  items.unshift(newItem);
  state[targetColl] = items;
  saveDatabaseState(state);

  return populateDoc(newItem, targetColl, state);
};

export const updateLocalItem = (rawName, id, data) => {
  const targetColl = resolveCollection(rawName);
  const state = getDatabaseState();
  const items = [...(state[targetColl] || [])];
  const index = items.findIndex(i => String(i._id || i.id) === String(id));

  if (index === -1) {
    // If not found, add it
    return createLocalItem(rawName, { ...data, _id: id });
  }

  items[index] = {
    ...items[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  state[targetColl] = items;
  saveDatabaseState(state);

  return populateDoc(items[index], targetColl, state);
};

export const deleteLocalItem = (rawName, id) => {
  const targetColl = resolveCollection(rawName);
  const state = getDatabaseState();
  const items = (state[targetColl] || []).filter(i => String(i._id || i.id) !== String(id));

  state[targetColl] = items;
  saveDatabaseState(state);

  return { success: true, message: 'Item deleted successfully' };
};

// Calculate real Overview Stats from DB state
export const getLocalDashboardStats = () => {
  const state = getDatabaseState();
  const students = state.students || [];
  const staffs = state.staffs || [];
  const classes = state.classes || [];
  const fees = state.fees || [];
  const attendances = state.attendances || [];
  const notices = state.notices || [];
  const users = state.users || [];

  const totalRevenue = fees.reduce((sum, f) => sum + (f.status === 'paid' ? (Number(f.totalAmount || f.amount) || 0) : 0), 0);
  const pendingFees = fees.reduce((sum, f) => sum + (f.status !== 'paid' ? (Number(f.totalAmount || f.amount) || 0) : 0), 0);

  // Fee categories
  const feeCategories = {};
  const gradPalette = [
    { gradId: 'gradDonutPro', cssGrad: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { gradId: 'gradDonutBusiness', cssGrad: 'linear-gradient(135deg, #06b6d4, #38bdf8)' },
    { gradId: 'gradDonutEnterprise', cssGrad: 'linear-gradient(135deg, #10b981, #34d399)' },
    { gradId: 'gradDonutAddons', cssGrad: 'linear-gradient(135deg, #f59e0b, #fb923c)' }
  ];

  fees.forEach(f => {
    const type = f.feeType || f.className || 'General Tuition';
    const amt = Number(f.totalAmount || f.amount) || 0;
    if (!feeCategories[type]) feeCategories[type] = 0;
    feeCategories[type] += amt;
  });

  const totalCalculatedRevenue = Object.values(feeCategories).reduce((a, b) => a + b, 0) || totalRevenue || 1;
  const revenueDistribution = Object.entries(feeCategories).map(([label, val], idx) => {
    const palette = gradPalette[idx % gradPalette.length];
    const pctNum = (val / totalCalculatedRevenue) * 100;
    return {
      label,
      value: val,
      percent: `${pctNum.toFixed(1)}%`,
      gradId: palette.gradId,
      cssGrad: palette.cssGrad
    };
  });

  const totalUsers = Math.max(users.length, students.length + staffs.length, 1);
  const enrolledStudents = students.length;
  const activeClasses = classes.length;
  const activeStaff = staffs.length;

  const enrollmentFunnel = {
    steps: [
      { label: '1. Registered Users', count: totalUsers.toString(), pct: '100%' },
      { label: '2. Enrolled Students', count: enrolledStudents.toString(), pct: `${Math.round((enrolledStudents / totalUsers) * 100)}%` },
      { label: '3. Active Classes', count: activeClasses.toString(), pct: `${Math.min(100, Math.round((activeClasses / Math.max(enrolledStudents, 1)) * 100))}%` },
      { label: '4. Verified Faculty', count: activeStaff.toString(), pct: `${Math.min(100, Math.round((activeStaff / totalUsers) * 100))}%` }
    ]
  };

  const classDistribution = classes.map(c => {
    const cStudents = students.filter(s => {
      const cId = s.class?._id || s.class;
      return String(cId) === String(c._id) || (s.className && s.className === c.className);
    });
    return {
      name: c.className || c.name,
      students: cStudents.length,
      capacity: c.capacity || 40,
      utilization: `${Math.min(100, Math.round((cStudents.length / (c.capacity || 40)) * 100))}%`
    };
  });

  let attendanceRate = '95.0%';
  if (attendances.length > 0) {
    const presentCount = attendances.filter(a => a.status === 'present').length;
    attendanceRate = `${Math.round((presentCount / attendances.length) * 100)}%`;
  }

  const populatedStudents = students.slice(0, 5).map(s => populateDoc(s, 'students', state));
  const recentNotices = notices.slice(0, 5);

  return {
    success: true,
    totalStudents: students.length,
    totalStaff: staffs.length,
    totalClasses: classes.length,
    totalRevenue,
    pendingFees,
    attendanceRate,
    revenueDistribution,
    enrollmentFunnel,
    classDistribution,
    recentStudents: populatedStudents,
    recentNotices
  };
};
