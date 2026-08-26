import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { DollarSign, Plus, Download, CreditCard } from 'lucide-react';

const FeeManagementPage = () => {
  const feeInvoices = [
    { invoice: 'INV-2024-001', student: 'Janet Adebayo', class: '10-A', amount: '$4,500', dueDate: 'May 01, 2024', status: 'Paid' },
    { invoice: 'INV-2024-002', student: 'Marcus Chen', class: '9-B', amount: '$4,200', dueDate: 'May 15, 2024', status: 'Pending' },
    { invoice: 'INV-2024-003', student: 'Sophia Smith', class: '11-A', amount: '$4,800', dueDate: 'Apr 30, 2024', status: 'Overdue' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track student tuition fees, invoices, and payments</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary">
            <Download size={16} /> Fee Report
          </button>
          <button className="btn btn-primary">
            <Plus size={16} /> Generate Invoice
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Fees Collected</h3>
            <div className="stat-value">$184,250</div>
            <span className="stat-change positive">88% of target</span>
          </div>
          <div className="stat-icon green"><DollarSign size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Balance</h3>
            <div className="stat-value">$24,100</div>
            <span className="stat-change negative">42 Outstanding Invoices</span>
          </div>
          <div className="stat-icon orange"><CreditCard size={24} /></div>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Total Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeInvoices.map((inv) => (
              <tr key={inv.invoice}>
                <td><strong>{inv.invoice}</strong></td>
                <td>{inv.student}</td>
                <td>Grade {inv.class}</td>
                <td><strong>{inv.amount}</strong></td>
                <td>{inv.dueDate}</td>
                <td>
                  <span className={`badge ${inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'error'}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm">View Receipt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default FeeManagementPage;
