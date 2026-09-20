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
  console.log('🌱 Seeding database...');

  // Clear all
  await Promise.all([
    User.deleteMany(), Student.deleteMany(), Staff.deleteMany(),
    Class.deleteMany(), Subject.deleteMany(), Notice.deleteMany(),
    LibraryBook.deleteMany(), Transport.deleteMany(), Hostel.deleteMany(),
    Fee.deleteMany(), Payroll.deleteMany(), OnlineClass.deleteMany(),
    Assignment.deleteMany(), Timetable.deleteMany(),
  ]);

  // ── Users ───────────────────────────────────────────────────────
  const adminUser  = await User.create({ name: 'Admin User',        email: 'admin@skool.edu',   password: 'Admin@123',  role: 'admin'   });
  const teacherU1  = await User.create({ name: 'Dr. Sarah Connor',  email: 's.connor@skool.edu',password: 'Teacher@123',role: 'teacher', phone: '+1 555-0101' });
  const teacherU2  = await User.create({ name: 'Prof. Albert Vance',email: 'a.vance@skool.edu', password: 'Teacher@123',role: 'teacher', phone: '+1 555-0102' });
  const teacherU3  = await User.create({ name: 'Elena Rostova',     email: 'e.rostova@skool.edu',password:'Teacher@123',role: 'teacher', phone: '+1 555-0103' });
  const staffU1    = await User.create({ name: 'Robert Vance',      email: 'r.vance@skool.edu', password: 'Staff@123',  role: 'staff',   phone: '+1 555-0201' });
  const staffU2    = await User.create({ name: 'Clara Oswald',      email: 'c.oswald@skool.edu',password: 'Staff@123',  role: 'staff',   phone: '+1 555-0202' });
  const stuU1      = await User.create({ name: 'Janet Adebayo',     email: 'j.adebayo@skool.edu',password:'Student@123',role: 'student'  });
  const stuU2      = await User.create({ name: 'Marcus Chen',       email: 'm.chen@skool.edu',  password: 'Student@123',role: 'student'  });
  const stuU3      = await User.create({ name: 'Sophia Smith',      email: 's.smith@skool.edu', password: 'Student@123',role: 'student'  });
  const stuU4      = await User.create({ name: 'Lucas Williams',    email: 'l.williams@skool.edu',password:'Student@123',role:'student'  });

  // ── Classes ─────────────────────────────────────────────────────
  const cls1 = await Class.create({ name: 'Grade 10', section: 'A', capacity: 38 });
  const cls2 = await Class.create({ name: 'Grade 9',  section: 'B', capacity: 32 });
  const cls3 = await Class.create({ name: 'Grade 11', section: 'A', capacity: 30 });

  // ── Subjects ────────────────────────────────────────────────────
  const sub1 = await Subject.create({ code: 'MATH-101', name: 'Mathematics & Calculus',       category: 'Core Academic', credits: 4 });
  const sub2 = await Subject.create({ code: 'PHY-201',  name: 'Modern Physics & Lab',         category: 'Core Science',  credits: 4 });
  const sub3 = await Subject.create({ code: 'CS-301',   name: 'Computer Science & Python',    category: 'Technology',    credits: 4 });
  const sub4 = await Subject.create({ code: 'ENG-102',  name: 'English Literature',           category: 'Humanities',    credits: 3 });

  // ── Staff ───────────────────────────────────────────────────────
  const staff1 = await Staff.create({ user: teacherU1._id, department: 'Mathematics',     designation: 'Senior Lecturer', qualification: 'Ph.D Math', salary: 5400 });
  const staff2 = await Staff.create({ user: teacherU2._id, department: 'Physics',         designation: 'Professor',       qualification: 'M.Sc Physics', salary: 6100 });
  const staff3 = await Staff.create({ user: teacherU3._id, department: 'Computer Science',designation: 'Asst. Professor', qualification: 'M.Tech CSE', salary: 4800 });
  const staff4 = await Staff.create({ user: staffU1._id,   department: 'Administration',  designation: 'Chief Registrar', qualification: 'MBA', salary: 4800 });
  const staff5 = await Staff.create({ user: staffU2._id,   department: 'Library',         designation: 'Head Librarian',  qualification: 'M.Lib.Sc', salary: 4200 });

  // ── Students ────────────────────────────────────────────────────
  const stu1 = await Student.create({ user: stuU1._id, class: cls1._id, parentName: 'Michael Adebayo', parentPhone: '+1 555-1001', gender: 'female', bloodGroup: 'O+' });
  const stu2 = await Student.create({ user: stuU2._id, class: cls2._id, parentName: 'David Chen',      parentPhone: '+1 555-1002', gender: 'male',   bloodGroup: 'A+' });
  const stu3 = await Student.create({ user: stuU3._id, class: cls3._id, parentName: 'Sarah Smith',     parentPhone: '+1 555-1003', gender: 'female', bloodGroup: 'B+' });
  const stu4 = await Student.create({ user: stuU4._id, class: cls1._id, parentName: 'Robert Williams', parentPhone: '+1 555-1004', gender: 'male',   isActive: false });

  // ── Notices ─────────────────────────────────────────────────────
  await Notice.insertMany([
    { title: 'Annual Sports Meet 2026', category: 'Event',    content: 'Registrations open for all sports events.', postedBy: adminUser._id, audience: ['all'], validUntil: new Date('2026-10-15') },
    { title: 'Mid-Term Exam Schedule',  category: 'Academic', content: 'Exam timetable published for Grade 9–12.',  postedBy: adminUser._id, audience: ['all'], validUntil: new Date('2026-10-30'), isPinned: true },
    { title: 'Library Amnesty Week',    category: 'Library',  content: 'Return overdue books without penalty.',     postedBy: staffU2._id,   audience: ['student','teacher'] },
  ]);

  // ── Library Books ───────────────────────────────────────────────
  await LibraryBook.insertMany([
    { isbn: '978-0131103627', title: 'The C Programming Language', author: 'Brian W. Kernighan', totalCopies: 15, availableCopies: 11, category: 'Computer Science' },
    { isbn: '978-0451524935', title: '1984',                       author: 'George Orwell',       totalCopies: 25, availableCopies: 19, category: 'Literature' },
    { isbn: '978-0133570533', title: 'University Physics',         author: 'Hugh D. Young',       totalCopies: 18, availableCopies: 6,  category: 'Science' },
    { isbn: '978-0262033848', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen',    totalCopies: 12, availableCopies: 4,  category: 'Computer Science' },
  ]);

  // ── Transport ───────────────────────────────────────────────────
  await Transport.insertMany([
    { vehicleNo: 'BUS-01', driverName: 'John Miller',    driverPhone: '+1 555-0811', routeName: 'North Suburbs - Route A', capacity: 45 },
    { vehicleNo: 'BUS-02', driverName: 'Samuel Jackson', driverPhone: '+1 555-0812', routeName: 'East Downtown - Route B', capacity: 50 },
  ]);

  // ── Hostels ─────────────────────────────────────────────────────
  await Hostel.insertMany([
    { hostelName: 'Boys Hostel A',  roomNo: '101', roomType: 'double', capacity: 2, monthlyFee: 500, occupants: [stu2._id] },
    { hostelName: 'Girls Hostel B', roomNo: '205', roomType: 'triple', capacity: 3, monthlyFee: 400, occupants: [stu1._id, stu3._id] },
  ]);

  // ── Fees ────────────────────────────────────────────────────────
  await Fee.insertMany([
    { invoiceNo: 'INV-2026-001', student: stu1._id, feeType: 'Tuition Term 1',     amount: 4500, dueDate: new Date('2026-10-01'), status: 'paid',    paidDate: new Date(), paymentMode: 'online' },
    { invoiceNo: 'INV-2026-002', student: stu2._id, feeType: 'Annual Admission Fee',amount: 4200, dueDate: new Date('2026-10-15'), status: 'pending' },
    { invoiceNo: 'INV-2026-003', student: stu3._id, feeType: 'Lab & Tech Fee',      amount: 1800, dueDate: new Date('2026-09-30'), status: 'paid',    paidDate: new Date() },
    { invoiceNo: 'INV-2026-004', student: stu4._id, feeType: 'Tuition Term 1',      amount: 4000, dueDate: new Date('2026-08-30'), status: 'overdue' },
  ]);

  // ── Payroll ─────────────────────────────────────────────────────
  await Payroll.insertMany([
    { staff: staff1._id, month: 9, year: 2026, basicSalary: 5000, allowances: 400, deductions: 0, status: 'paid', paidDate: new Date() },
    { staff: staff2._id, month: 9, year: 2026, basicSalary: 5600, allowances: 500, deductions: 0, status: 'paid', paidDate: new Date() },
    { staff: staff4._id, month: 9, year: 2026, basicSalary: 4400, allowances: 400, deductions: 0, status: 'paid', paidDate: new Date() },
    { staff: staff5._id, month: 9, year: 2026, basicSalary: 3800, allowances: 400, deductions: 0, status: 'pending' },
  ]);

  // ── Online Classes ──────────────────────────────────────────────
  await OnlineClass.insertMany([
    { title: 'Calculus Advanced Problem Solving', teacher: staff1._id, class: cls1._id, subject: sub1._id, startTime: '10:00 AM', endTime: '11:30 AM', status: 'live', meetingLink: 'https://meet.example.com/calc-101' },
    { title: 'Quantum Mechanics Introduction',    teacher: staff2._id, class: cls3._id, subject: sub2._id, startTime: '02:00 PM', endTime: '03:30 PM', status: 'scheduled' },
    { title: 'Python Data Structures',            teacher: staff3._id, class: cls1._id, subject: sub3._id, startTime: '04:00 PM', endTime: '05:00 PM', status: 'scheduled' },
  ]);

  // ── Assignments ─────────────────────────────────────────────────
  await Assignment.insertMany([
    { title: 'Algebra II Polynomials Problem Set', subject: sub1._id, class: cls1._id, teacher: staff1._id, dueDate: new Date('2026-10-16'), status: 'active' },
    { title: 'Mechanics & Newton Laws Report',     subject: sub2._id, class: cls3._id, teacher: staff2._id, dueDate: new Date('2026-10-18'), status: 'active' },
  ]);

  // ── Timetable ───────────────────────────────────────────────────
  await Timetable.insertMany([
    { class: cls1._id, day: 'Monday',    startTime: '09:00 AM', endTime: '10:00 AM', subject: sub1._id, teacher: staff1._id, room: 'Room 301' },
    { class: cls1._id, day: 'Monday',    startTime: '10:15 AM', endTime: '11:15 AM', subject: sub2._id, teacher: staff2._id, room: 'Physics Lab 1' },
    { class: cls1._id, day: 'Tuesday',   startTime: '09:00 AM', endTime: '10:00 AM', subject: sub3._id, teacher: staff3._id, room: 'Computer Lab 2' },
    { class: cls1._id, day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', subject: sub4._id, teacher: staff1._id, room: 'Room 204' },
  ]);

  console.log('✅ Seed complete!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin:   admin@skool.edu    / Admin@123');
  console.log('   Teacher: s.connor@skool.edu / Teacher@123');
  console.log('   Staff:   r.vance@skool.edu  / Staff@123');
  console.log('   Student: j.adebayo@skool.edu/ Student@123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
