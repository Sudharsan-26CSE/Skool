import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PieChart, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AccountsPage = () => {
  const transactions = [
    { id: 'TXN-901', type: 'Income', category: 'Tuition Fee Collection', amount: 4500.00, date: 'May 12, 2024' },
    { id: 'TXN-902', type: 'Expense', category: 'Laboratory Supplies', amount: 1250.00, date: 'May 11, 2024' },
    { id: 'TXN-903', type: 'Expense', category: 'Utility & Electricity Bill', amount: 3400.00, date: 'May 10, 2024' },
    { id: 'TXN-904', type: 'Income', category: 'Admission Fees', amount: 8200.00, date: 'May 08, 2024' },
  ];

  const chartData = [
    { name: 'Jan', revenue: 40000, expenses: 24000 },
    { name: 'Feb', revenue: 30000, expenses: 13980 },
    { name: 'Mar', revenue: 20000, expenses: 9800 },
    { name: 'Apr', revenue: 27800, expenses: 3908 },
    { name: 'May', revenue: 18900, expenses: 4800 },
    { name: 'Jun', revenue: 23900, expenses: 3800 },
    { name: 'Jul', revenue: 34900, expenses: 4300 },
  ];

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpense = chartData.reduce((acc, curr) => acc + curr.expenses, 0);
  const profitLoss = totalRevenue - totalExpense;
  const profitMargin = ((profitLoss / totalRevenue) * 100).toFixed(1);

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
            <div className="stat-value">${totalRevenue.toLocaleString()}</div>
            <span className="stat-change positive">+14% vs last year</span>
          </div>
          <div className="stat-icon green"><ArrowUpRight size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Expenditure</h3>
            <div className="stat-value">${totalExpense.toLocaleString()}</div>
            <span className="stat-change negative">-3% budget save</span>
          </div>
          <div className="stat-icon red"><ArrowDownRight size={24} /></div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <h3>Net Profit</h3>
            <div className="stat-value">${profitLoss.toLocaleString()}</div>
            <span className="stat-change positive">{profitMargin}% Margin</span>
          </div>
          <div className="stat-icon blue"><DollarSign size={24} /></div>
        </div>
      </div>
      
      <div className="detail-card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Revenue vs Expenses Overview</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ff7300" fill="#ff7300" />
            </AreaChart>
          </ResponsiveContainer>
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
                <td>
                  <strong style={{ color: t.type === 'Income' ? 'var(--success)' : 'var(--error)' }}>
                    {t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </strong>
                </td>
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
