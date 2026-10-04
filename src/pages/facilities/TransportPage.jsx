import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getTransports, deleteTransport, getTransportRoutes, deleteTransportRoute, createTransportRoute } from '../../services/api';

const TransportPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [routes, setRoutes] = useState([]); // Bus routes
  const [transportRoutes, setTransportRoutes] = useState([]); // Destinations
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await getTransports();
      setRoutes(data?.transports || data?.data || data?.items || []);
    } catch (err) {
      console.warn('Failed to load bus routes:', err);
      showToast('Failed to load bus routes. Using offline mode.', 'warning');
      setRoutes([]);
    }

    try {
      const routesRes = await getTransportRoutes();
      setTransportRoutes(routesRes?.transportRoutes || routesRes?.['transport-routes'] || routesRes?.transportroutes || routesRes?.data || routesRes?.items || []);
    } catch (err) {
      console.warn('Failed to load transport destinations:', err);
      setTransportRoutes([]);
    }
    
    setLoading(false);
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

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination route?')) return;
    try {
      await deleteTransportRoute(id);
      showToast('Destination deleted successfully', 'success');
      fetchRoutes();
    } catch (err) {
      showToast(err.message || 'Failed to delete destination', 'error');
    }
  };



  const handleAddDestination = async () => {
    const dest = window.prompt('Enter Destination (e.g. Madurai):');
    if (!dest) return;
    const route = window.prompt('Enter Route/Connection (e.g. Kovilpatti → Virudhunagar → Madurai):');
    if (!route) return;
    const notes = window.prompt('Enter Notes (optional):');
    
    try {
      await createTransportRoute({ destination: dest, route, notes: notes || '' });
      showToast('Destination added successfully!', 'success');
      fetchRoutes();
    } catch(err) {
      showToast(err.message || 'Failed to add destination.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Transport</h1>
          <p className="page-subtitle">Bus routes, drivers, and student bus pass tracking</p>
        </div>
      </div>

      {/* Bus Routes table removed as per user request */}

      <div className="data-table-container" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Transport Routes & Connections</h2>
          {isAdmin && (
            <button className="btn btn-secondary" onClick={handleAddDestination}>
              <Plus size={16} /> Add Destination
            </button>
          )}
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading routes...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Route / Connection</th>
                <th>Notes</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {transportRoutes.length === 0 ? (
                <tr><td colSpan={isAdmin ? 4 : 3} style={{ textAlign: 'center' }}>No transport routes found</td></tr>
              ) : transportRoutes.map((r) => (
                <tr key={r._id}>
                  <td><strong>{r.destination}</strong></td>
                  <td>{r.route}</td>
                  <td>{r.notes || 'Available'}</td>
                  {isAdmin && (
                    <td>
                      <button className="icon-btn danger" onClick={() => handleDeleteRoute(r._id)}>
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
