import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, BookOpen, Award } from 'lucide-react';

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = {
    id: id || 'STU-1001',
    name: 'Janet Adebayo',
    class: 'Grade 10-A',
    rollNumber: '10045',
    admissionDate: 'August 15, 2021',
    gender: 'Female',
    dateOfBirth: 'March 14, 2008',
    email: 'janet.adebayo@preskool.edu',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, IL',
    parentName: 'Michael Adebayo',
    parentRelation: 'Father',
    parentPhone: '+1 (555) 987-6543',
    parentEmail: 'michael.a@example.com',
    bloodGroup: 'O+',
    gpa: '3.92',
    attendanceRate: '98%',
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/students')}>
            <ArrowLeft size={16} /> Back to Directory
          </button>
          <div>
            <h1 className="page-title">Student Profile: {student.name}</h1>
            <p className="page-subtitle">ID: {student.id} • {student.class}</p>
          </div>
        </div>
        <button className="btn btn-primary">
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="profile-header">
        <div className="profile-avatar">{student.name.charAt(0)}</div>
        <div className="profile-info">
          <h1>{student.name}</h1>
          <p>{student.class} • Roll No: {student.rollNumber}</p>
          <div className="profile-meta">
            <div className="profile-meta-item">
              <Mail size={16} /> {student.email}
            </div>
            <div className="profile-meta-item">
              <Phone size={16} /> {student.phone}
            </div>
            <div className="profile-meta-item">
              <MapPin size={16} /> {student.address}
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Personal Information</h3>
          <div className="detail-row">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{student.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{student.gender}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Birth</span>
            <span className="detail-value">{student.dateOfBirth}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Blood Group</span>
            <span className="detail-value">{student.bloodGroup}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Admission Date</span>
            <span className="detail-value">{student.admissionDate}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Parent & Guardian Details</h3>
          <div className="detail-row">
            <span className="detail-label">Guardian Name</span>
            <span className="detail-value">{student.parentName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Relationship</span>
            <span className="detail-value">{student.parentRelation}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Contact Phone</span>
            <span className="detail-value">{student.parentPhone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Contact Email</span>
            <span className="detail-value">{student.parentEmail}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Academic Performance</h3>
          <div className="detail-row">
            <span className="detail-label">Current GPA</span>
            <span className="detail-value" style={{ color: 'var(--success)', fontWeight: 'var(--font-bold)' }}>{student.gpa}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Overall Attendance</span>
            <span className="detail-value">{student.attendanceRate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Academic Standing</span>
            <span className="badge success">Honors Roll</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Fee & Payment Status</h3>
          <div className="detail-row">
            <span className="detail-label">Annual Tuition Fee</span>
            <span className="detail-value">$4,500.00</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Paid to Date</span>
            <span className="detail-value" style={{ color: 'var(--success)' }}>$4,500.00</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Balance Due</span>
            <span className="detail-value">$0.00</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment Status</span>
            <span className="badge success">Paid</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetailsPage;
