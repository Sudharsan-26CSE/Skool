import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PieChart, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

const AccountsPage = () => {
  const transactions = [
    { id: 'TXN-901', type: 'Income', category: 'Tuition Fee Collection', amount: '+$4,500.00', date: 'May 12, 2024' },
    { id: 'TXN-902', type: 'Expense', category: 'Laboratory Supplies', amount: '-$1,250.00', date: 'May 11, 2024' },
    { id: 'TXN-903', type: 'Expense', category: 'Utility & Electricity Bill', amount: '-$3,400.00', date: 'May 10, 2024' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Accounting</h1>
          <p className="page-subtitle">School income, expenses, and ledger entries</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <div className="stat-value">$345,000</div>
            <span className="stat-change positive">+14% vs last year</span>
          </div>
          <div className="stat-icon green"><ArrowUpRight size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Expenditure</h3>
            <div className="stat-value">$198,400</div>
            <span className="stat-change negative">-3% budget save</span>
          </div>
          <div className="stat-icon red"><ArrowDownRight size={24} /></div>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.id}</strong></td>
                <td><span className={`badge ${t.type === 'Income' ? 'success' : 'error'}`}>{t.type}</span></td>
                <td>{t.category}</td>
                <td><strong style={{ color: t.type === 'Income' ? 'var(--success)' : 'var(--error)' }}>{t.amount}</strong></td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;
