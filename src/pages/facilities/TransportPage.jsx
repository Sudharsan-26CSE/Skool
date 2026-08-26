import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Bus, Plus } from 'lucide-react';

const TransportPage = () => {
  const routes = [
    { vehicleNo: 'BUS-01', driver: 'John Miller', phone: '+1 555-0811', routeName: 'North Suburbs - Route A', capacity: '45 Seats', status: 'Active' },
    { vehicleNo: 'BUS-02', driver: 'Samuel Jackson', phone: '+1 555-0812', routeName: 'East Downtown - Route B', capacity: '50 Seats', status: 'Active' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Transport</h1>
          <p className="page-subtitle">Bus routes, drivers, and student bus pass tracking</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Transport Route
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bus #</th>
              <th>Route Name</th>
              <th>Assigned Driver</th>
              <th>Driver Phone</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.vehicleNo}>
                <td><strong>{r.vehicleNo}</strong></td>
                <td>{r.routeName}</td>
                <td>{r.driver}</td>
                <td>{r.phone}</td>
                <td>{r.capacity}</td>
                <td><span className="badge success">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default TransportPage;
