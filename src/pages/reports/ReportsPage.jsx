import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PieChart, Download, Calendar, Filter } from 'lucide-react';

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Generate and download school analytical reports</p>
        </div>
        <button className="btn btn-primary">
          <Download size={16} /> Export Custom PDF Report
        </button>
      </div>

      <div className="detail-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Academic Performance Metrics</h2>
          </div>
          <div className="chart-placeholder">
            [ Bar Chart: Grade-by-Grade Average GPA Statistics ]
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Attendance Distribution</h2>
          </div>
          <div className="chart-placeholder">
            [ Line Chart: Monthly Student & Staff Attendance Rates ]
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
