import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

const seedCleanDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not set');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    console.log('Connected to MongoDB:', db.databaseName);

    // 1. Check or preserve existing users
    const usersColl = db.collection('users');
    let adminUser = await usersColl.findOne({ email: 'admin@skool.edu.in' });
    let teacherUser = await usersColl.findOne({ email: 'staff@skool.edu' });
    let studentUser = await usersColl.findOne({ email: '24104070@nec.edu.in' });

    const salt = await bcrypt.genSalt(10);

    if (!adminUser) {
      const pwd = await bcrypt.hash('1234qwer', salt);
      const res = await usersColl.insertOne({
        name: 'Admin User',
        email: 'admin@skool.edu.in',
        password: pwd,
        role: 'admin',
        isActive: true,
        phone: '+91 9876543210',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      adminUser = await usersColl.findOne({ _id: res.insertedId });
    }

    if (!teacherUser) {
      const pwd = await bcrypt.hash('Teacher@123', salt);
      const res = await usersColl.insertOne({
        name: 'Sarah Connor',
        email: 'staff@skool.edu',
        password: pwd,
        role: 'teacher',
        isActive: true,
        phone: '+91 9876543211',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      teacherUser = await usersColl.findOne({ _id: res.insertedId });
    }

    if (!studentUser) {
      const pwd = await bcrypt.hash('Student@123', salt);
      const res = await usersColl.insertOne({
        name: 'Sudhan S',
        email: '24104070@nec.edu.in',
        password: pwd,
        role: 'student',
        isActive: true,
        phone: '+91 9876543212',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      studentUser = await usersColl.findOne({ _id: res.insertedId });
    }

    // Additional Staff & Faculty Users
    let staffUser2 = await usersColl.findOne({ email: 'registrar@skool.edu.in' });
    if (!staffUser2) {
      const pwd = await bcrypt.hash('Staff@123', salt);
      const res = await usersColl.insertOne({
        name: 'Michael Adebayo',
        email: 'registrar@skool.edu.in',
        password: pwd,
        role: 'staff',
        isActive: true,
        phone: '+91 9876543213',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      staffUser2 = await usersColl.findOne({ _id: res.insertedId });
    }

    let teacherUser2 = await usersColl.findOne({ email: 'turing@skool.edu.in' });
    if (!teacherUser2) {
      const pwd = await bcrypt.hash('Teacher@123', salt);
      const res = await usersColl.insertOne({
        name: 'Alan Turing',
        email: 'turing@skool.edu.in',
        role: 'teacher',
        password: pwd,
        isActive: true,
        phone: '+91 9876543214',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      teacherUser2 = await usersColl.findOne({ _id: res.insertedId });
    }

    let teacherUser3 = await usersColl.findOne({ email: 'vance@skool.edu.in' });
    if (!teacherUser3) {
      const pwd = await bcrypt.hash('Teacher@123', salt);
      const res = await usersColl.insertOne({
        name: 'Albert Vance',
        email: 'vance@skool.edu.in',
        role: 'teacher',
        password: pwd,
        isActive: true,
        phone: '+91 9876543215',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      teacherUser3 = await usersColl.findOne({ _id: res.insertedId });
    }

    // Additional Student Users
    const studentProfiles = [
      { name: 'Aarav Sharma', email: 'aarav.s@skool.edu.in', phone: '+91 9123456780', parent: 'Rajesh Sharma' },
      { name: 'Priya Patel', email: 'priya.p@skool.edu.in', phone: '+91 9123456781', parent: 'Mukesh Patel' },
      { name: 'Rohan Verma', email: 'rohan.v@skool.edu.in', phone: '+91 9123456782', parent: 'Suresh Verma' },
      { name: 'Ananya Iyer', email: 'ananya.i@skool.edu.in', phone: '+91 9123456783', parent: 'Raman Iyer' },
      { name: 'Kavya Reddy', email: 'kavya.r@skool.edu.in', phone: '+91 9123456784', parent: 'Venkat Reddy' }
    ];

    const studentUserDocs = [];
    for (const sp of studentProfiles) {
      let u = await usersColl.findOne({ email: sp.email });
      if (!u) {
        const pwd = await bcrypt.hash('Student@123', salt);
        const res = await usersColl.insertOne({
          name: sp.name,
          email: sp.email,
          role: 'student',
          password: pwd,
          phone: sp.phone,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        u = await usersColl.findOne({ _id: res.insertedId });
      }
      studentUserDocs.push({ ...u, parentName: sp.parent });
    }

    // 2. Staffs Collection
    const staffsColl = db.collection('staffs');
    await staffsColl.deleteMany({}); // clear stale staff and insert fresh clean records
    const staffInserts = [
      {
        employeeId: 'EMP-101',
        user: teacherUser._id,
        name: 'Sarah Connor',
        department: 'Mathematics',
        designation: 'Senior Lecturer',
        qualification: 'Ph.D Mathematics',
        experience: 8,
        salary: 5400,
        role: 'teacher',
        isActive: true,
        createdAt: new Date()
      },
      {
        employeeId: 'EMP-102',
        user: staffUser2._id,
        name: 'Michael Adebayo',
        department: 'Administration',
        designation: 'Chief Registrar',
        qualification: 'MBA Education Mgmt',
        experience: 12,
        salary: 4800,
        role: 'staff',
        isActive: true,
        createdAt: new Date()
      },
      {
        employeeId: 'EMP-103',
        user: teacherUser2._id,
        name: 'Alan Turing',
        department: 'Computer Science',
        designation: 'Lead Faculty',
        qualification: 'M.S. Computer Science',
        experience: 10,
        salary: 6200,
        role: 'teacher',
        isActive: true,
        createdAt: new Date()
      },
      {
        employeeId: 'EMP-104',
        user: teacherUser3._id,
        name: 'Albert Vance',
        department: 'Physics',
        designation: 'Associate Professor',
        qualification: 'M.Sc Physics',
        experience: 6,
        salary: 5100,
        role: 'teacher',
        isActive: true,
        createdAt: new Date()
      },
      {
        employeeId: 'EMP-105',
        name: 'Elena Rostova',
        department: 'Facilities & Library',
        designation: 'Head Librarian',
        qualification: 'Master of Library Science',
        experience: 7,
        salary: 4200,
        role: 'staff',
        isActive: true,
        createdAt: new Date()
      }
    ];
    await staffsColl.insertMany(staffInserts);
    const dbStaffs = await staffsColl.find({}).toArray();
    console.log(`Seeded ${dbStaffs.length} staff records.`);

    // 3. Classes Collection
    const classesColl = db.collection('classes');
    await classesColl.deleteMany({});
    const classInserts = [
      { name: 'Grade 10', section: 'A', className: 'Grade 10-A', capacity: 35, room: 'Room 101', classTeacher: dbStaffs[0]._id, createdAt: new Date() },
      { name: 'Grade 10', section: 'B', className: 'Grade 10-B', capacity: 35, room: 'Room 102', classTeacher: dbStaffs[2]._id, createdAt: new Date() },
      { name: 'Grade 9',  section: 'A', className: 'Grade 9-A',  capacity: 35, room: 'Room 201', classTeacher: dbStaffs[3]._id, createdAt: new Date() },
      { name: 'Grade 9',  section: 'B', className: 'Grade 9-B',  capacity: 35, room: 'Room 202', classTeacher: dbStaffs[0]._id, createdAt: new Date() },
      { name: 'Grade 11', section: 'A', className: 'Grade 11-A', capacity: 30, room: 'Room 301', classTeacher: dbStaffs[2]._id, createdAt: new Date() },
      { name: 'Grade 12', section: 'A', className: 'Grade 12-A', capacity: 30, room: 'Room 401', classTeacher: dbStaffs[3]._id, createdAt: new Date() }
    ];
    await classesColl.insertMany(classInserts);
    const dbClasses = await classesColl.find({}).toArray();
    console.log(`Seeded ${dbClasses.length} classes.`);

    // 4. Subjects Collection
    const subjectsColl = db.collection('subjects');
    await subjectsColl.deleteMany({});
    const subjectInserts = [
      { code: 'MATH-101', name: 'Mathematics - Algebra & Calculus', category: 'Core Academic', credits: 4, teacher: dbStaffs[0]._id, createdAt: new Date() },
      { code: 'PHY-102',  name: 'Physics - Classical & Quantum', category: 'Science', credits: 4, teacher: dbStaffs[3]._id, createdAt: new Date() },
      { code: 'CHEM-103', name: 'Chemistry - Organic & Inorganic', category: 'Science', credits: 3, teacher: dbStaffs[3]._id, createdAt: new Date() },
      { code: 'CS-104',   name: 'Computer Science & Python', category: 'Technology', credits: 4, teacher: dbStaffs[2]._id, createdAt: new Date() },
      { code: 'ENG-105',  name: 'English Literature & Rhetoric', category: 'Humanities', credits: 3, teacher: dbStaffs[0]._id, createdAt: new Date() },
      { code: 'BIO-106',  name: 'Biology - Genetics & Ecology', category: 'Science', credits: 3, teacher: dbStaffs[3]._id, createdAt: new Date() }
    ];
    await subjectsColl.insertMany(subjectInserts);
    const dbSubjects = await subjectsColl.find({}).toArray();
    console.log(`Seeded ${dbSubjects.length} subjects.`);

    // 5. Students Collection
    const studentsColl = db.collection('students');
    await studentsColl.deleteMany({});
    const grade10A = dbClasses.find(c => c.className === 'Grade 10-A');
    const grade9A = dbClasses.find(c => c.className === 'Grade 9-A');
    const grade11A = dbClasses.find(c => c.className === 'Grade 11-A');

    const studentInserts = [
      {
        admissionNo: 'STU-1001',
        user: studentUser._id,
        name: studentUser.name || 'Sudhan S',
        email: studentUser.email,
        class: grade10A._id,
        className: 'Grade 10-A',
        section: 'A',
        parentName: 'Sundaram S',
        parentPhone: '+91 9443123450',
        parentEmail: 'sundaram@gmail.com',
        dateOfBirth: new Date('2008-04-12'),
        gender: 'male',
        bloodGroup: 'O+',
        address: '14 Gandhi Road, Chennai',
        isActive: true,
        createdAt: new Date()
      },
      ...studentUserDocs.map((u, i) => ({
        admissionNo: `STU-100${i + 2}`,
        user: u._id,
        name: u.name,
        email: u.email,
        class: i % 2 === 0 ? grade10A._id : (i % 3 === 0 ? grade11A._id : grade9A._id),
        className: i % 2 === 0 ? 'Grade 10-A' : (i % 3 === 0 ? 'Grade 11-A' : 'Grade 9-A'),
        section: i % 2 === 0 ? 'A' : 'A',
        parentName: u.parentName,
        parentPhone: u.phone,
        parentEmail: `parent.${u.email}`,
        dateOfBirth: new Date('2008-07-20'),
        gender: i % 2 === 0 ? 'male' : 'female',
        bloodGroup: 'B+',
        address: `${20 + i} Temple Street, Bengaluru`,
        isActive: true,
        createdAt: new Date()
      }))
    ];
    await studentsColl.insertMany(studentInserts);
    const dbStudents = await studentsColl.find({}).toArray();
    console.log(`Seeded ${dbStudents.length} students.`);

    // 6. Fees Collection
    const feesColl = db.collection('fees');
    await feesColl.deleteMany({});
    const feeInserts = [
      {
        invoiceNo: 'INV-2026-001',
        student: dbStudents[0]._id,
        studentName: dbStudents[0].name,
        className: dbStudents[0].className,
        feeType: 'Tuition Fee - Term 1',
        amount: 25000,
        discount: 2000,
        totalAmount: 23000,
        dueDate: new Date('2026-10-15'),
        paidDate: new Date('2026-09-10'),
        status: 'paid',
        paymentMode: 'online',
        notes: 'Term 1 fee paid in full',
        createdAt: new Date()
      },
      {
        invoiceNo: 'INV-2026-002',
        student: dbStudents[1]._id,
        studentName: dbStudents[1].name,
        className: dbStudents[1].className,
        feeType: 'Tuition Fee - Term 1',
        amount: 25000,
        discount: 0,
        totalAmount: 25000,
        dueDate: new Date('2026-10-15'),
        paidDate: new Date('2026-09-12'),
        status: 'paid',
        paymentMode: 'bank-transfer',
        notes: 'Bank transfer received',
        createdAt: new Date()
      },
      {
        invoiceNo: 'INV-2026-003',
        student: dbStudents[2]._id,
        studentName: dbStudents[2].name,
        className: dbStudents[2].className,
        feeType: 'Laboratory & Tech Fee',
        amount: 8500,
        discount: 500,
        totalAmount: 8000,
        dueDate: new Date('2026-10-30'),
        status: 'pending',
        paymentMode: 'cash',
        notes: 'Pending parent confirmation',
        createdAt: new Date()
      },
      {
        invoiceNo: 'INV-2026-004',
        student: dbStudents[3]._id,
        studentName: dbStudents[3].name,
        className: dbStudents[3].className,
        feeType: 'Tuition Fee - Term 1',
        amount: 25000,
        discount: 0,
        totalAmount: 25000,
        dueDate: new Date('2026-09-01'),
        status: 'overdue',
        paymentMode: 'online',
        notes: 'Notice sent to parent',
        createdAt: new Date()
      }
    ];
    await feesColl.insertMany(feeInserts);
    console.log('Seeded fees.');

    // 7. Notices Collection
    const noticesColl = db.collection('notices');
    await noticesColl.deleteMany({});
    const noticeInserts = [
      {
        title: 'Mid-Term Examination Schedule Announced',
        content: 'Mid-term examinations for Grades 8 through 12 will commence from October 10th. Timetables are now published under the Academics section.',
        category: 'Academic',
        isPinned: true,
        postedBy: adminUser._id,
        validFrom: new Date(),
        audience: ['all'],
        createdAt: new Date()
      },
      {
        title: 'Annual Science & Tech Fair 2026',
        content: 'All students are invited to submit their innovative project proposals to the Computer Science & Science departments by October 5th.',
        category: 'Event',
        isPinned: false,
        postedBy: adminUser._id,
        validFrom: new Date(),
        audience: ['all'],
        createdAt: new Date()
      },
      {
        title: 'Faculty Academic Meeting on Curriculum Revision',
        content: 'Mandatory staff meeting on Friday at 3:30 PM in Conference Room A to review syllabus completion and mid-term assessments.',
        category: 'Meeting',
        isPinned: false,
        postedBy: adminUser._id,
        validFrom: new Date(),
        audience: ['teacher', 'staff'],
        createdAt: new Date()
      },
      {
        title: 'Library Digital Resource Portal Upgrade',
        content: 'Over 500 new e-books and research journals in Science, Mathematics, and Computer Science have been added to the school library portal.',
        category: 'Library',
        isPinned: false,
        postedBy: adminUser._id,
        validFrom: new Date(),
        audience: ['all'],
        createdAt: new Date()
      }
    ];
    await noticesColl.insertMany(noticeInserts);
    console.log('Seeded notices.');

    // 8. Attendance Collection
    const attendancesColl = db.collection('attendances');
    await attendancesColl.deleteMany({});
    const todayStr = new Date().toISOString().split('T')[0];
    const attendanceInserts = dbStudents.map((s, idx) => ({
      student: s._id,
      studentName: s.name,
      admissionNo: s.admissionNo,
      class: s.class,
      className: s.className,
      date: todayStr,
      status: idx === 3 ? 'absent' : idx === 2 ? 'late' : 'present',
      time: idx === 3 ? '-' : idx === 2 ? '08:45 AM' : '08:15 AM',
      userType: 'student',
      markedBy: adminUser._id,
      createdAt: new Date()
    }));
    await attendancesColl.insertMany(attendanceInserts);
    console.log('Seeded attendance records.');

    // 9. Timetables Collection
    const timetablesColl = db.collection('timetables');
    await timetablesColl.deleteMany({});
    const timetableInserts = [
      { class: grade10A._id, className: 'Grade 10-A', day: 'Monday', time: '09:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Sarah Connor', room: 'Room 101', createdAt: new Date() },
      { class: grade10A._id, className: 'Grade 10-A', day: 'Monday', time: '10:15 AM - 11:15 AM', subject: 'Physics', teacher: 'Albert Vance', room: 'Physics Lab', createdAt: new Date() },
      { class: grade10A._id, className: 'Grade 10-A', day: 'Monday', time: '11:30 AM - 12:30 PM', subject: 'Computer Science', teacher: 'Alan Turing', room: 'CS Lab 1', createdAt: new Date() },
      { class: grade10A._id, className: 'Grade 10-A', day: 'Tuesday', time: '09:00 AM - 10:00 AM', subject: 'Chemistry', teacher: 'Albert Vance', room: 'Chemistry Lab', createdAt: new Date() },
      { class: grade10A._id, className: 'Grade 10-A', day: 'Tuesday', time: '10:15 AM - 11:15 AM', subject: 'English', teacher: 'Sarah Connor', room: 'Room 101', createdAt: new Date() }
    ];
    await timetablesColl.insertMany(timetableInserts);
    console.log('Seeded timetables.');

    // 10. Online Classes Collection
    const onlineClassesColl = db.collection('onlineclasses');
    await onlineClassesColl.deleteMany({});
    const onlineClassInserts = [
      {
        topic: 'Advanced Polynomial Factoring',
        subject: 'Mathematics',
        className: 'Grade 10-A',
        teacherName: 'Sarah Connor',
        date: '2026-09-25',
        time: '10:00 AM',
        duration: '60 mins',
        meetingUrl: 'https://meet.google.com/sko-math-adv',
        status: 'Scheduled',
        createdAt: new Date()
      },
      {
        topic: 'Introduction to Quantum Mechanics & Photons',
        subject: 'Physics',
        className: 'Grade 11-A',
        teacherName: 'Albert Vance',
        date: '2026-09-26',
        time: '11:30 AM',
        duration: '45 mins',
        meetingUrl: 'https://meet.google.com/sko-phys-qnt',
        status: 'Scheduled',
        createdAt: new Date()
      }
    ];
    await onlineClassesColl.insertMany(onlineClassInserts);
    console.log('Seeded online classes.');

    // 11. Assignments Collection
    const assignmentsColl = db.collection('assignments');
    await assignmentsColl.deleteMany({});
    const assignmentInserts = [
      {
        title: 'Polynomial Functions & Quadratic Curves Problem Set',
        subject: 'Mathematics',
        className: 'Grade 10-A',
        dueDate: '2026-10-02',
        assignedBy: 'Sarah Connor',
        submissions: '4/6',
        status: 'Active',
        instructions: 'Complete exercises 4.1 to 4.5 and upload scanned solutions.',
        createdAt: new Date()
      },
      {
        title: 'Newtonian Dynamics Laboratory Report',
        subject: 'Physics',
        className: 'Grade 10-A',
        dueDate: '2026-10-05',
        assignedBy: 'Albert Vance',
        submissions: '5/6',
        status: 'Active',
        instructions: 'Submit experimental findings on frictional coefficients.',
        createdAt: new Date()
      },
      {
        title: 'Data Structures: Linked Lists Implementation',
        subject: 'Computer Science',
        className: 'Grade 10-A',
        dueDate: '2026-10-08',
        assignedBy: 'Alan Turing',
        submissions: '6/6',
        status: 'Active',
        instructions: 'Write Python code implementing singly and doubly linked lists.',
        createdAt: new Date()
      }
    ];
    await assignmentsColl.insertMany(assignmentInserts);
    console.log('Seeded assignments.');

    // 12. Exam Results Collection
    const examResultsColl = db.collection('examresults');
    await examResultsColl.deleteMany({});
    const examResultInserts = [
      {
        student: dbStudents[0]._id,
        admissionNo: dbStudents[0].admissionNo,
        name: dbStudents[0].name,
        className: '10-A',
        examName: 'Mid-Term Examination 2026',
        math: '94',
        physics: '90',
        chemistry: '88',
        computer: '98',
        english: '92',
        gpa: '3.92',
        grade: 'A+',
        percentage: '92.4%',
        createdAt: new Date()
      },
      {
        student: dbStudents[1]._id,
        admissionNo: dbStudents[1].admissionNo,
        name: dbStudents[1].name,
        className: '10-A',
        examName: 'Mid-Term Examination 2026',
        math: '86',
        physics: '82',
        chemistry: '84',
        computer: '89',
        english: '85',
        gpa: '3.52',
        grade: 'A',
        percentage: '85.2%',
        createdAt: new Date()
      },
      {
        student: dbStudents[2]._id,
        admissionNo: dbStudents[2].admissionNo,
        name: dbStudents[2].name,
        className: '10-A',
        examName: 'Mid-Term Examination 2026',
        math: '90',
        physics: '94',
        chemistry: '91',
        computer: '96',
        english: '88',
        gpa: '3.85',
        grade: 'A+',
        percentage: '91.8%',
        createdAt: new Date()
      }
    ];
    await examResultsColl.insertMany(examResultInserts);
    console.log('Seeded exam results.');

    // 13. Library Books Collection
    const libraryColl = db.collection('librarybooks');
    await libraryColl.deleteMany({});
    const bookInserts = [
      { bookTitle: 'Concepts of Physics (Vol 1 & 2)', isbn: '978-8177091878', author: 'H.C. Verma', category: 'Physics', availableCopies: 14, totalCopies: 15, shelfLocation: 'Shelf P-04', createdAt: new Date() },
      { bookTitle: 'Higher Engineering Mathematics', isbn: '978-9386173522', author: 'B.S. Grewal', category: 'Mathematics', availableCopies: 8, totalCopies: 10, shelfLocation: 'Shelf M-02', createdAt: new Date() },
      { bookTitle: 'Introduction to Algorithms (CLRS)', isbn: '978-0262033848', author: 'Cormen, Leiserson, Rivest', category: 'Computer Science', availableCopies: 5, totalCopies: 6, shelfLocation: 'Shelf CS-01', createdAt: new Date() },
      { bookTitle: 'To Kill a Mockingbird', isbn: '978-0446310789', author: 'Harper Lee', category: 'Literature', availableCopies: 12, totalCopies: 12, shelfLocation: 'Shelf E-08', createdAt: new Date() }
    ];
    await libraryColl.insertMany(bookInserts);
    console.log('Seeded library books.');

    // 14. Transports & Hostels
    const transportsColl = db.collection('transports');
    await transportsColl.deleteMany({});
    await transportsColl.insertMany([
      { routeName: 'Route 1 - North Campus to City Center', vehicleNo: 'KA-01-EA-1042', driverName: 'Ramesh Kumar', driverPhone: '+91 9845012345', capacity: 42, feePerTerm: 12000, createdAt: new Date() },
      { routeName: 'Route 2 - South Ring Road & IT Corridor', vehicleNo: 'KA-01-EA-2088', driverName: 'Gopal Swamy', driverPhone: '+91 9845012346', capacity: 38, feePerTerm: 14000, createdAt: new Date() }
    ]);

    const hostelsColl = db.collection('hostels');
    await hostelsColl.deleteMany({});
    await hostelsColl.insertMany([
      { hostelName: 'Boys Academic Residency (Block A)', type: 'Boys', totalRooms: 40, capacity: 120, occupiedBeds: 88, wardenName: 'K. Somasekhar', wardenPhone: '+91 9448011223', createdAt: new Date() },
      { hostelName: 'Girls Academic Residency (Block B)', type: 'Girls', totalRooms: 35, capacity: 105, occupiedBeds: 74, wardenName: 'Dr. Meenakshi Sundaram', wardenPhone: '+91 9448011224', createdAt: new Date() }
    ]);
    console.log('Seeded transports and hostels.');

    console.log('\n🌟 ALL COLLECTIONS SUCCESSFULLY SEEDED WITH CLEAN, REAL DATABASE RECORDS!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedCleanDatabase();
