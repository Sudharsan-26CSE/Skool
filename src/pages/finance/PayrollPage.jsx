import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { CreditCard, Download, Plus } from 'lucide-react';

const PayrollPage = () => {
  const payrollList = [
    { id: 'PAY-101', staff: 'Dr. Sarah Connor', role: 'Teacher', salary: '$5,400.00', status: 'Paid', date: 'May 01, 2024' },
    { id: 'PAY-102', staff: 'Prof. Albert Vance', role: 'Teacher', salary: '$6,100.00', status: 'Paid', date: 'May 01, 2024' },
    { id: 'PAY-103', staff: 'Robert Vance', role: 'Head Librarian', salary: '$4,200.00', status: 'Processing', date: 'May 01, 2024' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Payroll</h1>
          <p className="page-subtitle">Salary disbursements and monthly compensation</p>
        </div>
        <button className="btn btn-primary">
          <CreditCard size={16} /> Process Monthly Payroll
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Payroll ID</th>
              <th>Employee</th>
              <th>Role</th>
              <th>Net Salary</th>
              <th>Disbursement Date</th>
              <th>Status</th>
              <th>Slip</th>
            </tr>
          </thead>
          <tbody>
            {payrollList.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.id}</strong></td>
                <td>{p.staff}</td>
                <td>{p.role}</td>
                <td><strong>{p.salary}</strong></td>
                <td>{p.date}</td>
                <td>
                  <span className={`badge ${p.status === 'Paid' ? 'success' : 'warning'}`}>{p.status}</span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm"><Download size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
