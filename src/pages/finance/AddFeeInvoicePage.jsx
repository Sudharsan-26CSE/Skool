import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createFee } from '../../services/api';

const AddFeeInvoicePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '60d0fe4f5311236168a109cf', // Mock ObjectId for student
    feeType: 'tuition',
    amount: '',
    dueDate: '',
    academicYear: '2023-2024',
    remarks: '',
  });

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
      showToast(err.message || 'Failed to generate invoice. Using offline mode.', 'error');
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
          <p className="page-subtitle">Create a new fee invoice for a student</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Student (ID) *</label>
                <select name="studentId" className="form-input" value={formData.studentId} onChange={handleChange} required>
                  <option value="60d0fe4f5311236168a109cf">Janet Adebayo (Grade 10-A)</option>
                  <option value="60d0fe4f5311236168a109d0">Marcus Chen (Grade 9-B)</option>
                  <option value="60d0fe4f5311236168a109d1">Sophia Smith (Grade 11-A)</option>
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
