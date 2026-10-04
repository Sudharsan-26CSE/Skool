import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createHostel } from '../../services/api';

const AddHostelPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hostelName: '',
    hostelType: 'co-ed',
    roomNo: '',
    roomType: 'double',
    floor: 1,
    capacity: 2,
    monthlyFee: 500,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createHostel({
        ...formData,
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        monthlyFee: Number(formData.monthlyFee)
      });
      showToast('Hostel room added successfully!', 'success');
      navigate('/hostel');
    } catch (err) {
      showToast(err.message || 'Failed to add hostel room. Using offline mode.', 'error');
      navigate('/hostel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/hostel')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Add Hostel Room</h1>
          <p className="page-subtitle">Configure a new room in the student hostel</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 style={{ marginBottom: '1rem' }}>Hostel Info</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Hostel Name / Block *</label>
                <input type="text" name="hostelName" className="form-input" value={formData.hostelName} onChange={handleChange} placeholder="e.g. Block A" required />
              </div>
              <div className="form-group">
                <label>Hostel Type *</label>
                <select name="hostelType" className="form-input" value={formData.hostelType} onChange={handleChange} required>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="co-ed">Co-Ed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Floor *</label>
                <input type="number" name="floor" className="form-input" value={formData.floor} onChange={handleChange} min="0" required />
              </div>
            </div>

            <h3 style={{ margin: '1.5rem 0 1rem 0' }}>Room Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Room Number *</label>
                <input type="text" name="roomNo" className="form-input" value={formData.roomNo} onChange={handleChange} placeholder="e.g. 101" required />
              </div>
              <div className="form-group">
                <label>Room Type *</label>
                <select name="roomType" className="form-input" value={formData.roomType} onChange={handleChange} required>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="dormitory">Dormitory</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacity (Beds) *</label>
                <input type="number" name="capacity" className="form-input" value={formData.capacity} onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label>Monthly Fee ($)</label>
                <input type="number" name="monthlyFee" className="form-input" value={formData.monthlyFee} onChange={handleChange} min="0" />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/hostel')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Room'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddHostelPage;
