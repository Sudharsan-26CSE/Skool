import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createFee, getStudents } from '../../services/api';

const AddFeeInvoicePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    feeType: 'tuition',
    amount: '',
    dueDate: '',
    academicYear: '2023-2024',
    remarks: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      const list = res.students || (Array.isArray(res) ? res : []);
      setStudents(list);
      if (list.length > 0) {
        setFormData(prev => ({ ...prev, studentId: list[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createFee({
        student: formData.studentId,
        feeType: formData.feeType,
        amount: Number(formData.amount),
        dueDate: formData.dueDate,
        academicYear: formData.academicYear,
        remarks: formData.remarks,
        status: 'unpaid',
      });
      showToast('Fee invoice generated successfully!', 'success');
      navigate('/fees');
    } catch (err) {
      showToast(err.message || 'Failed to generate invoice.', 'error');
      navigate('/fees');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/fees')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Generate Fee Invoice</h1>
          <p className="page-subtitle">Create a new fee invoice for an enrolled student</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Student *</label>
                <select name="studentId" className="form-input" value={formData.studentId} onChange={handleChange} required>
                  {students.length === 0 ? (
                    <option value="">No students found</option>
                  ) : (
                    students.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.rollNumber || s.admissionNumber || s.grade || 'Enrolled'})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Fee Type *</label>
                <select name="feeType" className="form-input" value={formData.feeType} onChange={handleChange} required>
                  <option value="tuition">Tuition Fee</option>
                  <option value="admission">Admission Fee</option>
                  <option value="exam">Exam Fee</option>
                  <option value="transport">Transport Fee</option>
                  <option value="hostel">Hostel Fee</option>
                  <option value="library">Library Fee</option>
                  <option value="lab">Lab Fee</option>
                  <option value="sports">Sports Fee</option>
                  <option value="other">Other Fee</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount ($) *</label>
                <input type="number" name="amount" className="form-input" value={formData.amount} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input type="date" name="dueDate" className="form-input" value={formData.dueDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Academic Year *</label>
                <input type="text" name="academicYear" className="form-input" value={formData.academicYear} onChange={handleChange} required />
              </div>
              <div className="form-group full-width">
                <label>Remarks / Note</label>
                <textarea name="remarks" className="form-input" value={formData.remarks} onChange={handleChange} rows="3"></textarea>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/fees')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddFeeInvoicePage;
