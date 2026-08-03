import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';

const AddStudentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    rollNo: '',
    class: 'Grade 10-A',
    email: '',
    phone: '',
    bloodGroup: 'A+',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentRelation: 'Father',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Student added successfully!');
    navigate('/students');
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/students')}>
            <ArrowLeft size={16} /> Back to List
          </button>
          <div>
            <h1 className="page-title">Add New Student</h1>
            <p className="page-subtitle">Fill out the student registration form</p>
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
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
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
                <label>Class / Grade *</label>
                <select name="class" className="form-input" value={formData.class} onChange={handleChange}>
                  <option value="Grade 9-A">Grade 9-A</option>
                  <option value="Grade 9-B">Grade 9-B</option>
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 11-A">Grade 11-A</option>
                  <option value="Grade 12-A">Grade 12-A</option>
                </select>
              </div>

              <div className="form-group">
                <label>Roll Number *</label>
                <input
                  type="text"
                  name="rollNo"
                  className="form-input"
                  placeholder="e.g. 10052"
                  value={formData.rollNo}
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
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Student
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddStudentPage;
