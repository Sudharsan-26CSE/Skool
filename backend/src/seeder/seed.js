require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const connectDB = require('../config/db');

const User        = require('../models/User');
const Student     = require('../models/Student');
const Staff       = require('../models/Staff');
const Class       = require('../models/Class');
const Subject     = require('../models/Subject');
const Notice      = require('../models/Notice');
const LibraryBook = require('../models/LibraryBook');
const Transport   = require('../models/Transport');
const Hostel      = require('../models/Hostel');
const Fee         = require('../models/Fee');
const Payroll     = require('../models/Payroll');
const OnlineClass = require('../models/OnlineClass');
const Assignment  = require('../models/Assignment');
const Timetable   = require('../models/Timetable');

const seed = async () => {
  await connectDB();
  console.log('🌱 Clearing database and seeding minimal data...');

  // Clear all
  await Promise.all([
    User.deleteMany(), Student.deleteMany(), Staff.deleteMany(),
    Class.deleteMany(), Subject.deleteMany(), Notice.deleteMany(),
    LibraryBook.deleteMany(), Transport.deleteMany(), Hostel.deleteMany(),
    Fee.deleteMany(), Payroll.deleteMany(), OnlineClass.deleteMany(),
    Assignment.deleteMany(), Timetable.deleteMany(),
  ]);

  // ── Users ───────────────────────────────────────────────────────
  const adminUser  = await User.create({ name: 'Admin User',        email: 'admin@skool.edu.in',   password: '1234qwer',  role: 'admin'   });
  const teacherU1  = await User.create({ name: 'Teacher',           email: 'Staff@skool.edu',   password: 'Teacher@123',role: 'teacher', phone: '+1 555-0101' });
  const staffU1    = await User.create({ name: 'Robert Vance',      email: 'r.vance@skool.edu', password: 'Staff@123',  role: 'staff',   phone: '+1 555-0201' });

  // ── Staff ───────────────────────────────────────────────────────
  await Staff.create({ user: teacherU1._id, department: 'Mathematics',     designation: 'Senior Lecturer', qualification: 'Ph.D Math', salary: 5400 });
  await Staff.create({ user: staffU1._id,   department: 'Administration',  designation: 'Chief Registrar', qualification: 'MBA', salary: 4800 });

  console.log('✅ Seed complete! All previous data cleared.');
  console.log('\n📋 Login Credentials (Create these in Firebase Auth!):');
  console.log('   Admin:   admin@skool.edu.in / 1234qwer');
  console.log('   Teacher: Staff@skool.edu    / Teacher@123');
  console.log('   Staff:   r.vance@skool.edu  / Staff@123');
  
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
