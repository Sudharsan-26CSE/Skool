import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { User, Phone, Mail, Calendar, MapPin, Building, GraduationCap, Save, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { updateStudent, getMe } from '../../services/api';

const StudentProfileForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    department: '',
    course: '',
    yearOfStudy: '1st Year',
    semester: '1st Semester',
    section: 'A',
    academicYear: '2025-2026',
    admissionYear: '2025',
    address: '',
    city: '',
    state: '',
    pincode: '',
    guardianName: '',
    guardianPhone: '',
    bloodGroup: 'O+',
    profilePhoto: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const email = localStorage.getItem('preskool-email') || '';
        const res = await getMe(email);
        if (res && res.user) {
          // In a real app, you'd fetch the student record linked to this user
          // For demo, we just pre-fill name and email
          setFormData(prev => ({
            ...prev,
            name: res.user.name || '',
            email: res.user.email || email,
            studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Create or update student profile via API
      await updateStudent(formData.studentId || 'new', formData);
      showToast('Profile updated successfully!', 'success');
      setTimeout(() => navigate('/dashboard/student'), 1500);
    } catch (err) {
      showToast('Failed to update profile. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `form-control glass-input ${errors[field] ? 'border-red-500' : ''}`;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Profile Details</h1>
          <p className="page-subtitle">Complete your academic and personal information</p>
        </div>
      </div>

      {fetching ? (
        <div className="flex justify-center p-10"><div className="spinner"></div></div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="dashboard-card glass-card mb-6">
            <div className="dashboard-card-header mb-4">
              <h2><User size={18} className="mr-2 inline-block text-indigo-500" /> Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="John Doe" />
                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Student ID / Reg No <span className="text-red-500">*</span></label>
                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className={inputClass('studentId')} placeholder="STU-12345" />
                {errors.studentId && <span className="text-red-500 text-xs mt-1">{errors.studentId}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="student@skool.edu" />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} placeholder="9876543210" />
                {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control glass-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-control glass-input">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-control glass-input">
                  <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-card glass-card mb-6">
            <div className="dashboard-card-header mb-4">
              <h2><GraduationCap size={18} className="mr-2 inline-block text-emerald-500" /> Academic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="form-control glass-input" placeholder="e.g. Computer Science" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course / Degree</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} className="form-control glass-input" placeholder="e.g. B.Tech" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year of Study</label>
                <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className="form-control glass-input">
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} className="form-control glass-input">
                  <option>1st Semester</option><option>2nd Semester</option><option>3rd Semester</option>
                  <option>4th Semester</option><option>5th Semester</option><option>6th Semester</option>
                  <option>7th Semester</option><option>8th Semester</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <input type="text" name="section" value={formData.section} onChange={handleChange} className="form-control glass-input" placeholder="e.g. A" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Academic Year</label>
                <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} className="form-control glass-input" placeholder="2025-2026" />
              </div>
            </div>
          </div>

          <div className="dashboard-card glass-card mb-6">
            <div className="dashboard-card-header mb-4">
              <h2><MapPin size={18} className="mr-2 inline-block text-amber-500" /> Contact & Guardian Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Full Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="form-control glass-input h-24" placeholder="Enter your full residential address"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control glass-input" placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State & Pincode</label>
                <div className="flex gap-2">
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control glass-input w-2/3" placeholder="State" />
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="form-control glass-input w-1/3" placeholder="ZIP" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[rgba(150,160,180,0.15)] pt-6">
              <div>
                <label className="block text-sm font-medium mb-1">Parent/Guardian Name</label>
                <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="form-control glass-input" placeholder="Guardian's Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent/Guardian Phone</label>
                <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} className="form-control glass-input" placeholder="Guardian's Phone" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/dashboard/student')} className="btn btn-secondary glass-btn">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary shadow-lg">
              {loading ? <span className="spinner mr-2" style={{width:'16px', height:'16px', borderWidth:'2px'}}></span> : <Save size={18} className="mr-2" />}
              {loading ? 'Saving...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default StudentProfileForm;
