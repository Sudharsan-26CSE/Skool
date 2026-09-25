import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PieChart, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getFees, getPayrolls } from '../../services/api';

const AccountsPage = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const [feesRes, payrollRes] = await Promise.all([
        getFees().catch(() => ({ fees: [] })),
        getPayrolls().catch(() => ({ payrolls: [] }))
      ]);

      const feesList = feesRes.fees || (Array.isArray(feesRes) ? feesRes : []);
      const payrollList = payrollRes.payrolls || (Array.isArray(payrollRes) ? payrollRes : []);

      // Build real ledger transactions
      const txns = [];
      let revSum = 0;
      let expSum = 0;

      const monthMap = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();

      // Prepopulate current year months
      monthNames.slice(0, 9).forEach(m => {
        monthMap[m] = { name: m, revenue: 0, expenses: 0 };
      });

      // Map fee collections
      feesList.forEach(f => {
        const amt = Number(f.totalAmount || f.amount) || 0;
        if (f.status === 'paid') {
          revSum += amt;
          const d = f.paidDate ? new Date(f.paidDate) : new Date(f.createdAt || Date.now());
          const mName = monthNames[d.getMonth()] || 'Sep';
          if (!monthMap[mName]) monthMap[mName] = { name: mName, revenue: 0, expenses: 0 };
          monthMap[mName].revenue += amt;

          txns.push({
            id: f.invoiceNo || f._id?.substring(0, 8) || 'TXN-FEE',
            type: 'Income',
            category: f.feeType || 'Tuition Fee Collection',
            amount: amt,
            date: d.toLocaleDateString()
          });
        }
      });

      // Map staff payroll disbursements
      payrollList.forEach(p => {
        const amt = Number(p.netPay || p.basicSalary) || 0;
        if (p.status === 'paid' || p.status === 'Paid') {
          expSum += amt;
          const d = p.paymentDate ? new Date(p.paymentDate) : new Date(p.createdAt || Date.now());
          const mName = monthNames[d.getMonth()] || 'Sep';
          if (!monthMap[mName]) monthMap[mName] = { name: mName, revenue: 0, expenses: 0 };
          monthMap[mName].expenses += amt;

          txns.push({
            id: p._id?.substring(0, 8) || 'TXN-PAY',
            type: 'Expense',
            category: `Payroll - ${p.staffName || p.staff?.name || p.role || 'Faculty'}`,
            amount: amt,
            date: d.toLocaleDateString()
          });
        }
      });

      setTotalRevenue(revSum);
      setTotalExpense(expSum);
      setTransactions(txns);

      const dynamicChart = Object.values(monthMap);
      setChartData(dynamicChart.length > 0 ? dynamicChart : [
        { name: 'Jul', revenue: 25000, expenses: 18000 },
        { name: 'Aug', revenue: 30000, expenses: 22000 },
        { name: 'Sep', revenue: revSum, expenses: expSum }
      ]);
    } catch (err) {
      console.error('Failed to load accounts data:', err);
    } finally {
      setLoading(false);
    }
  };

  const profitLoss = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((profitLoss / totalRevenue) * 100).toFixed(1) : '0.0';

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Accounting</h1>
          <p className="page-subtitle">School income, expenses, and ledger entries</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card hover-lift">
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
            <span className="stat-change positive">From fee invoices</span>
          </div>
          <div className="stat-icon green"><ArrowUpRight size={24} /></div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-info">
            <h3>Total Expenditure</h3>
            <div className="stat-value">₹{totalExpense.toLocaleString()}</div>
            <span className="stat-change negative">From faculty payrolls</span>
          </div>
          <div className="stat-icon red"><ArrowDownRight size={24} /></div>
        </div>
        
        <div className="stat-card glass-card hover-lift">
          <div className="stat-info">
            <h3>Net Operating Balance</h3>
            <div className="stat-value">₹{profitLoss.toLocaleString()}</div>
            <span className={`stat-change ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
              {profitMargin}% Operating Margin
            </span>
          </div>
          <div className="stat-icon blue"><DollarSign size={24} /></div>
        </div>
      </div>
      
      <div className="detail-card glass-card hover-lift" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Revenue vs Expenses Overview</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Fee Revenue (₹)" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="expenses" name="Expenditure / Payroll (₹)" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="data-table-container glass-card hover-lift">
        <div className="data-table-header">
          <h2>Financial Ledger Entries</h2>
          <span className="badge neutral">Active Records</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading financial ledger...</div>
        ) : (
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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No financial ledger transactions recorded.
                  </td>
                </tr>
              ) : transactions.map((t, idx) => (
                <tr key={t.id || idx}>
                  <td><strong>{t.id}</strong></td>
                  <td><span className={`badge ${t.type === 'Income' ? 'success' : 'error'}`}>{t.type}</span></td>
                  <td>{t.category}</td>
                  <td>
                    <strong style={{ color: t.type === 'Income' ? 'var(--success)' : 'var(--error)' }}>
                      {t.type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </strong>
                  </td>
                  <td>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;
