import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getTransports, deleteTransport } from '../../services/api';

const TransportPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await getTransports();
      setRoutes(data.transports || []);
    } catch (err) {
      showToast('Failed to load transport routes. Using offline mode.', 'warning');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await deleteTransport(id);
      showToast('Transport route deleted successfully', 'success');
      fetchRoutes();
    } catch (err) {
      showToast(err.message || 'Failed to delete transport route', 'error');
    }
  };



  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Transport</h1>
          <p className="page-subtitle">Bus routes, drivers, and student bus pass tracking</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/transport/add')}>
            <Plus size={16} /> Add Transport Route
          </button>
        )}
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading routes...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus #</th>
                <th>Route Name</th>
                <th>Assigned Driver</th>
                <th>Driver Phone</th>
                <th>Capacity</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center' }}>No routes found</td></tr>
              ) : routes.map((r) => (
                <tr key={r._id}>
                  <td><strong>{r.vehicleNo}</strong></td>
                  <td>{r.routeName}</td>
                  <td>{r.driverName}</td>
                  <td>{r.driverPhone}</td>
                  <td>{r.capacity} Seats</td>
                  <td>
                    <span className={`badge ${r.isActive ? 'success' : 'error'}`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="icon-btn danger" onClick={() => handleDelete(r._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TransportPage;
