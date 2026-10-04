import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createTransport } from '../../services/api';

const AddTransportPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    routeName: '',
    routeNo: '',
    vehicleNo: '',
    vehicleType: 'bus',
    capacity: 40,
    driverName: '',
    driverPhone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTransport({
        ...formData,
        capacity: Number(formData.capacity),
      });
      showToast('Transport route added successfully!', 'success');
      navigate('/transport');
    } catch (err) {
      showToast(err.message || 'Failed to add route. Using offline mode.', 'error');
      navigate('/transport');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/transport')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Add Transport Route</h1>
          <p className="page-subtitle">Configure a new vehicle and route</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 style={{ marginBottom: '1rem' }}>Vehicle & Driver Info</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Vehicle Number (License Plate) *</label>
                <input type="text" name="vehicleNo" className="form-input" value={formData.vehicleNo} onChange={handleChange} placeholder="e.g. AB-12-CD-3456" required />
              </div>
              <div className="form-group">
                <label>Vehicle Type *</label>
                <select name="vehicleType" className="form-input" value={formData.vehicleType} onChange={handleChange} required>
                  <option value="bus">Bus</option>
                  <option value="van">Van</option>
                  <option value="mini-bus">Mini-Bus</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Seating Capacity *</label>
                <input type="number" name="capacity" className="form-input" value={formData.capacity} onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label>Driver Name *</label>
                <input type="text" name="driverName" className="form-input" value={formData.driverName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Driver Phone *</label>
                <input type="text" name="driverPhone" className="form-input" value={formData.driverPhone} onChange={handleChange} required />
              </div>
            </div>

            <h3 style={{ margin: '1.5rem 0 1rem 0' }}>Route Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Route Name *</label>
                <input type="text" name="routeName" className="form-input" value={formData.routeName} onChange={handleChange} placeholder="e.g. North Suburbs - Downtown" required />
              </div>
              <div className="form-group">
                <label>Route Number / ID</label>
                <input type="text" name="routeNo" className="form-input" value={formData.routeNo} onChange={handleChange} placeholder="e.g. R-01" />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transport')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Route'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddTransportPage;
