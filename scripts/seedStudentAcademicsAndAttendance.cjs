const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('skool');

  console.log('Connected to MongoDB Atlas: skool database');

  const students = await db.collection('students').find().toArray();
  console.log(`Found ${students.length} students to seed academic scores and attendance for`);

  // Helper to get subjects based on class/stream
  const getSubjectsForStudent = (s) => {
    const cls = (s.className || s.grade || '').toLowerCase();
    if (cls.includes('computer')) {
      return ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'English'];
    }
    if (cls.includes('vocational')) {
      return ['Vocational Practice', 'Information Technology', 'English', 'Mathematics', 'Physics'];
    }
    if (cls.includes('commerce')) {
      return ['Accountancy', 'Economics', 'Business Studies', 'English', 'Mathematics'];
    }
    if (cls.includes('maths biology') || cls.includes('bio')) {
      return ['Biology', 'Mathematics', 'Physics', 'Chemistry', 'English'];
    }
    if (cls.includes('science')) {
      return ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'];
    }
    // Default 9th and 10th
    return ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'];
  };

  const getGradeAndGpa = (marks) => {
    if (marks >= 90) return { grade: 'A+', gpa: 4.0 };
    if (marks >= 80) return { grade: 'A', gpa: 3.7 };
    if (marks >= 70) return { grade: 'B+', gpa: 3.3 };
    if (marks >= 60) return { grade: 'B', gpa: 3.0 };
    if (marks >= 50) return { grade: 'C', gpa: 2.5 };
    if (marks >= 40) return { grade: 'D', gpa: 2.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  const examResultsToInsert = [];
  const attendancesToInsert = [];

  // Seed deterministic scores and attendance based on student index
  let studentIndex = 0;
  for (const s of students) {
    studentIndex++;
    const subjects = getSubjectsForStudent(s);
    let totalMarks = 0;

    // Generate balanced realistic marks between 75 and 98
    const baseMark = 80 + (studentIndex % 15);
    const subjectMarksList = [];

    subjects.forEach((subj, subIdx) => {
      const variation = ((subIdx * 7 + studentIndex * 3) % 15) - 5;
      const mark = Math.min(99, Math.max(68, baseMark + variation));
      totalMarks += mark;
      const { grade, gpa } = getGradeAndGpa(mark);

      subjectMarksList.push({ subject: subj, mark, grade, gpa });

      examResultsToInsert.push({
        _id: `res_${s._id}_${subIdx + 1}`,
        id: `res_${s._id}_${subIdx + 1}`,
        student: s._id,
        studentName: s.name,
        admissionNo: s.admissionNo || `STU-${s._id.slice(-4)}`,
        className: s.className || `${s.grade}-${s.section}`,
        gradeName: s.grade,
        section: s.section,
        examName: 'Annual Academic Assessment 2026',
        subject: subj,
        marks: mark,
        totalMarks: 100,
        grade,
        date: '2026-10-01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    const avgMarks = Math.round(totalMarks / subjects.length);
    const { grade: cumGrade, gpa: cumGpa } = getGradeAndGpa(avgMarks);
    const attendanceNum = Math.min(99, Math.max(82, 90 + ((studentIndex * 5) % 9) - 2));

    // Update student document with overall metrics
    await db.collection('students').updateOne(
      { _id: s._id },
      {
        $set: {
          attendanceRate: `${attendanceNum}%`,
          attendancePercent: attendanceNum,
          academicScore: `${avgMarks}%`,
          totalMarks: `${totalMarks}/${subjects.length * 100}`,
          gpa: cumGpa.toFixed(1),
          cumulativeGrade: `${cumGrade} (${avgMarks}%)`,
          subjectScores: subjectMarksList
        }
      }
    );

    // Create 3 attendance log entries for this student
    const dates = ['2026-10-01', '2026-10-02', '2026-10-03'];
    dates.forEach((d, dIdx) => {
      const isAbsent = (studentIndex + dIdx) % 13 === 0;
      attendancesToInsert.push({
        _id: `att_${s._id}_${dIdx + 1}`,
        id: `att_${s._id}_${dIdx + 1}`,
        student: s._id,
        studentName: s.name,
        className: s.className || `${s.grade}-${s.section}`,
        date: d,
        status: isAbsent ? 'absent' : 'present',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  }

  // Clear and insert bulk examresults
  await db.collection('examresults').deleteMany({});
  await db.collection('examresults').insertMany(examResultsToInsert);
  console.log(`✅ Stored ${examResultsToInsert.length} exam results into MongoDB Atlas`);

  // Clear and insert bulk attendances
  await db.collection('attendances').deleteMany({});
  await db.collection('attendances').insertMany(attendancesToInsert);
  console.log(`✅ Stored ${attendancesToInsert.length} attendance records into MongoDB Atlas`);

  // Also sync liveDbData.js
  const collections = [
    'users', 'students', 'staffs', 'classes', 'subjects', 'attendances',
    'examresults', 'fees', 'exams', 'grades', 'timetables', 'events', 'notices',
    'leaves', 'library', 'transport', 'hostel', 'settings', 'admissions'
  ];

  const fullData = {};
  for (const col of collections) {
    fullData[col] = await db.collection(col).find({}).toArray();
  }

  const fileContent = `export const liveDbData = ${JSON.stringify(fullData, null, 2)};\n`;
  const destPath = path.join(__dirname, '..', 'src', 'data', 'liveDbData.js');
  fs.writeFileSync(destPath, fileContent, 'utf8');
  console.log(`✅ Successfully updated ${destPath} with live MongoDB Atlas records`);

  await client.close();
}

run().catch(console.error);
