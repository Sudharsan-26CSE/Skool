import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, BookOpen, Award } from 'lucide-react';
import { getStudent } from '../../services/api';
import { useToast } from '../../components/common/ToastContext';

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showToast } = useToast();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const data = await getStudent(id);
        setStudent(data.student);
      } catch (err) {
        showToast('Failed to load student details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudentDetails();
  }, [id, showToast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading profile...</div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>Student not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/students')}>
            <ArrowLeft size={16} /> Back to Directory
          </button>
          <div>
            <h1 className="page-title">Student Profile: {student.user?.name || student.name || 'Unnamed'}</h1>
            <p className="page-subtitle">ID: {student.admissionNo} • {student.class?.name || student.class?.className || 'N/A'}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/students/edit/${id}`)}>
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="profile-header">
        <div className="profile-avatar">{(student.user?.name || student.name || 'S').charAt(0)}</div>
        <div className="profile-info">
          <h1>{student.user?.name || student.name}</h1>
          <p>{student.class?.name || student.class?.className || 'N/A'} • Roll No: {student.admissionNo}</p>
          <div className="profile-meta">
            <div className="profile-meta-item">
              <Mail size={16} /> {student.user?.email || student.email || 'N/A'}
            </div>
            <div className="profile-meta-item">
              <Phone size={16} /> {student.user?.phone || student.phone || 'N/A'}
            </div>
            <div className="profile-meta-item">
              <MapPin size={16} /> {student.address || 'N/A'}
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
            <span className="detail-value">{student.user?.name || student.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{student.gender || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Birth</span>
            <span className="detail-value">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Blood Group</span>
            <span className="detail-value">{student.bloodGroup || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Admission Date</span>
            <span className="detail-value">{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Parent & Guardian Details</h3>
          <div className="detail-row">
            <span className="detail-label">Guardian Name</span>
            <span className="detail-value">{student.parentName || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Relationship</span>
            <span className="detail-value">{student.parentRelation || 'Parent'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Contact Phone</span>
            <span className="detail-value">{student.parentPhone || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Contact Email</span>
            <span className="detail-value">{student.parentEmail || 'N/A'}</span>
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
