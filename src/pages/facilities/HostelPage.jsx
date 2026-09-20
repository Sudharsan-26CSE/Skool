import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Home, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getHostels, deleteHostel } from '../../services/api';

const HostelPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const data = await getHostels();
      setHostels(data.hostels || []);
    } catch (err) {
      showToast('Failed to load hostel data. Using offline mode.', 'warning');
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteHostel(id);
      showToast('Hostel room deleted successfully', 'success');
      fetchHostels();
    } catch (err) {
      showToast(err.message || 'Failed to delete hostel room', 'error');
    }
  };

  const fallbackHostels = [
    { _id: '1', hostelName: 'Boys Hostel A', roomNo: '101', roomType: 'double', capacity: 2, occupants: [], monthlyFee: 500, isAvailable: true },
    { _id: '2', hostelName: 'Girls Hostel B', roomNo: '205', roomType: 'triple', capacity: 3, occupants: [{}, {}], monthlyFee: 400, isAvailable: true },
    { _id: '3', hostelName: 'Boys Hostel A', roomNo: '102', roomType: 'single', capacity: 1, occupants: [{}], monthlyFee: 800, isAvailable: false },
  ];

  const displayHostels = hostels.length > 0 ? hostels : fallbackHostels;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hostel Management</h1>
          <p className="page-subtitle">Student accommodation, room availability, and allocation</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/hostel/add')}>
            <Plus size={16} /> Add Room
          </button>
        )}
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading rooms...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Block / Hostel Name</th>
                <th>Room No.</th>
                <th>Room Type</th>
                <th>Capacity</th>
                <th>Available Beds</th>
                <th>Monthly Fee</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayHostels.length === 0 ? (
                <tr><td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center' }}>No rooms found</td></tr>
              ) : displayHostels.map((h) => {
                const occupantsCount = h.occupants?.length || 0;
                const availableBeds = h.capacity - occupantsCount;
                return (
                  <tr key={h._id}>
                    <td><strong>{h.hostelName}</strong></td>
                    <td>{h.roomNo}</td>
                    <td style={{ textTransform: 'capitalize' }}>{h.roomType}</td>
                    <td>{h.capacity}</td>
                    <td>{availableBeds}</td>
                    <td>${h.monthlyFee}</td>
                    <td>
                      <span className={`badge ${availableBeds > 0 ? 'success' : 'error'}`}>
                        {availableBeds > 0 ? 'Available' : 'Full'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <button className="icon-btn danger" onClick={() => handleDelete(h._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HostelPage;
