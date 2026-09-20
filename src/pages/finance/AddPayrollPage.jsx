import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createPayroll } from '../../services/api';

const AddPayrollPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '60d0fe4f5311236168a109ce', // Mock ObjectId
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 5000,
    hra: 500,
    da: 200,
    tax: 300,
    pf: 150,
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
      await createPayroll({
        staff: formData.staffId,
        month: Number(formData.month),
        year: Number(formData.year),
        basicSalary: Number(formData.basicSalary),
        allowances: {
          hra: Number(formData.hra),
          da: Number(formData.da)
        },
        deductions: {
          tax: Number(formData.tax),
          pf: Number(formData.pf)
        },
        remarks: formData.remarks,
        status: 'pending'
      });
      showToast('Payroll structured successfully!', 'success');
      navigate('/payroll');
    } catch (err) {
      showToast(err.message || 'Failed to structure payroll. Using offline mode.', 'error');
      navigate('/payroll');
    } finally {
      setLoading(false);
    }
  };

  const netPay = Number(formData.basicSalary) + Number(formData.hra) + Number(formData.da) - Number(formData.tax) - Number(formData.pf);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/payroll')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Process Staff Payroll</h1>
          <p className="page-subtitle">Structure salary, allowances, and deductions</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 style={{ marginBottom: '1rem' }}>Employee Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Staff Member *</label>
                <select name="staffId" className="form-input" value={formData.staffId} onChange={handleChange} required>
                  <option value="60d0fe4f5311236168a109ce">Dr. Sarah Connor (Teacher)</option>
                  <option value="60d0fe4f5311236168a109cd">Prof. Albert Vance (Teacher)</option>
                  <option value="60d0fe4f5311236168a109cc">Robert Vance (Staff)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Month *</label>
                <select name="month" className="form-input" value={formData.month} onChange={handleChange} required>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input type="number" name="year" className="form-input" value={formData.year} onChange={handleChange} required />
              </div>
            </div>

            <h3 style={{ margin: '1rem 0' }}>Earnings</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Basic Salary ($) *</label>
                <input type="number" name="basicSalary" className="form-input" value={formData.basicSalary} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label>HRA ($)</label>
                <input type="number" name="hra" className="form-input" value={formData.hra} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>DA ($)</label>
                <input type="number" name="da" className="form-input" value={formData.da} onChange={handleChange} min="0" />
              </div>
            </div>

            <h3 style={{ margin: '1rem 0' }}>Deductions</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Tax ($)</label>
                <input type="number" name="tax" className="form-input" value={formData.tax} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>Provident Fund (PF) ($)</label>
                <input type="number" name="pf" className="form-input" value={formData.pf} onChange={handleChange} min="0" />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
              <strong>Calculated Net Pay: ${netPay.toLocaleString()}</strong>
            </div>

            <div className="form-grid" style={{ marginTop: '1.5rem' }}>
              <div className="form-group full-width">
                <label>Remarks / Note</label>
                <textarea name="remarks" className="form-input" value={formData.remarks} onChange={handleChange} rows="2"></textarea>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/payroll')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Payroll'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddPayrollPage;
