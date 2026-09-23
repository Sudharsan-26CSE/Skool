import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getStudent, updateStudent } from '../../services/api';

const EditStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    admissionNo: '',
    classId: '',
    section: 'A',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentRelation: 'Father',
    address: '',
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await getStudent(id);
        const s = data.student;
        setFormData({
          name: s.user?.name || s.name || '',
          gender: s.gender || 'Male',
          dob: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
          admissionNo: s.admissionNo || '',
          classId: s.class?._id || s.class || '',
          section: s.section || 'A',
          email: s.user?.email || s.email || '',
          phone: s.user?.phone || s.phone || '',
          bloodGroup: s.bloodGroup || 'A+',
          parentName: s.parentName || '',
          parentPhone: s.parentPhone || '',
          parentEmail: s.parentEmail || '',
          parentRelation: s.parentRelation || 'Father',
          address: s.address || '',
        });
      } catch (err) {
        showToast('Failed to load student details', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [id, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateStudent(id, {
        ...formData,
        dateOfBirth: formData.dob
      });
      
      showToast('Student updated successfully!', 'success');
      navigate('/students');
    } catch (err) {
      showToast(err.message || 'Failed to update student.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-group">
          <div>
            <h1 className="page-title">Edit Student</h1>
            <p className="page-subtitle">Update student information</p>
          </div>
        </div>
      </div>

      <div className="form-page">
        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Information */}
          <div className="form-section">
            <h3>1. Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Student Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  className="form-input"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Section *</label>
                <select name="section" className="form-input" value={formData.section} onChange={handleChange}>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admission Number / Roll No *</label>
                <input
                  type="text"
                  name="admissionNo"
                  className="form-input"
                  placeholder="e.g. 10052"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="form-section">
            <h3>2. Contact & Medical Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Student Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" className="form-input" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Residential Address</label>
                <textarea
                  name="address"
                  className="form-input"
                  rows="3"
                  placeholder="Enter full street address"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 3: Parent/Guardian Info */}
          <div className="form-section">
            <h3>3. Parent / Guardian Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Parent/Guardian Full Name *</label>
                <input
                  type="text"
                  name="parentName"
                  className="form-input"
                  placeholder="e.g. Robert Doe"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Relationship *</label>
                <select name="parentRelation" className="form-input" value={formData.parentRelation} onChange={handleChange}>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div className="form-group">
                <label>Parent Phone Number *</label>
                <input
                  type="tel"
                  name="parentPhone"
                  className="form-input"
                  placeholder="+1 (555) 111-2222"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parent Email Address</label>
                <input
                  type="email"
                  name="parentEmail"
                  className="form-input"
                  placeholder="parent@example.com"
                  value={formData.parentEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditStudentPage;
