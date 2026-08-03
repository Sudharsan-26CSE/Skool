import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Building, Plus } from 'lucide-react';

const HostelPage = () => {
  const hostels = [
    { block: 'Block A - Newton Hall', type: 'Boys Hostel', rooms: '50 Rooms', occupancy: '92%', warden: 'Mr. David Miller' },
    { block: 'Block B - Curie Hall', type: 'Girls Hostel', rooms: '50 Rooms', occupancy: '88%', warden: 'Mrs. Susan Bones' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hostel & Accommodation</h1>
          <p className="page-subtitle">Residential blocks, room allocations, and warden contacts</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Allocate Room
        </button>
      </div>

      <div className="detail-grid">
        {hostels.map((h, idx) => (
          <div key={idx} className="detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="badge info">{h.type}</span>
              <span className="badge success">{h.occupancy} Occupied</span>
            </div>
            <h3 style={{ border: 'none', padding: 0, margin: 'var(--space-2) 0' }}>{h.block}</h3>
            <div className="detail-row">
              <span className="detail-label">Total Rooms</span>
              <span className="detail-value">{h.rooms}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Warden In-Charge</span>
              <span className="detail-value">{h.warden}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default HostelPage;
