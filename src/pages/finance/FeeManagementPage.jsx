import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { DollarSign, Plus, Download, CreditCard, FileSpreadsheet } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getFees } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

const FeeManagementPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [feeInvoices, setFeeInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const data = await getFees();
      setFeeInvoices(data.fees || []);
    } catch (err) {
      showToast('Failed to load fees. Using offline mode.', 'warning');
      setFeeInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(displayFees.map(f => ({
      InvoiceNo: f._id,
      StudentName: f.student?.name || 'Unknown',
      Class: f.student?.class?.name || 'Unknown',
      FeeType: f.feeType,
      Amount: f.amount,
      TotalAmount: f.totalAmount,
      Status: f.status,
      DueDate: new Date(f.dueDate).toLocaleDateString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fees");
    XLSX.writeFile(wb, "Fee_Report.xlsx");
    showToast('Excel report generated!', 'success');
  };

  const feeInvoicesFallback = [
    { _id: 'INV-2024-001', student: { name: 'Janet Adebayo', class: { name: 'Grade 10-A' } }, feeType: 'tuition', totalAmount: 4500, dueDate: '2024-05-01', status: 'paid' },
    { _id: 'INV-2024-002', student: { name: 'Marcus Chen', class: { name: 'Grade 9-B' } }, feeType: 'admission', totalAmount: 4200, dueDate: '2024-05-15', status: 'pending' },
    { _id: 'INV-2024-003', student: { name: 'Sophia Smith', class: { name: 'Grade 11-A' } }, feeType: 'tuition', totalAmount: 4800, dueDate: '2024-04-30', status: 'overdue' },
  ];

  const displayFees = feeInvoices.length > 0 ? feeInvoices : feeInvoicesFallback;

  const totalCollected = displayFees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.totalAmount, 0);
  const totalPending = displayFees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.totalAmount, 0);
  const pendingCount = displayFees.filter(f => f.status !== 'paid').length;

  // Chart data
  const chartData = [
    { name: 'Grade 9', previous: 40000, current: 45000 },
    { name: 'Grade 10', previous: 50000, current: 55000 },
    { name: 'Grade 11', previous: 60000, current: 62000 },
    { name: 'Grade 12', previous: 65000, current: 70000 },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track student tuition fees, invoices, and payments</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} /> Export Excel
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => navigate('/fees/add')}>
              <Plus size={16} /> Generate Invoice
            </button>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Fees Collected</h3>
            <div className="stat-value">${totalCollected.toLocaleString()}</div>
            <span className="stat-change positive">Current Academic Year</span>
          </div>
          <div className="stat-icon green"><DollarSign size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Balance</h3>
            <div className="stat-value">${totalPending.toLocaleString()}</div>
            <span className="stat-change negative">{pendingCount} Outstanding Invoices</span>
          </div>
          <div className="stat-icon orange"><CreditCard size={24} /></div>
        </div>
      </div>
      
      <div className="detail-card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Previous vs Current Year Fee Collection</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="previous" name="Previous Year" fill="#8884d8" />
              <Bar dataKey="current" name="Current Year" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading invoices...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Fee Type</th>
                <th>Total Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayFees.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center' }}>No invoices found</td></tr>
              ) : displayFees.map((inv) => {
                const isPaid = inv.status === 'paid' || inv.status === 'Paid';
                const isPending = inv.status === 'pending' || inv.status === 'Pending';
                return (
                  <tr key={inv._id}>
                    <td><strong>{inv._id.substring(0,8)}</strong></td>
                    <td>{inv.student?.name || 'Unknown'}</td>
                    <td>{inv.student?.class?.name || inv.student?.class || 'Unknown'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{inv.feeType}</td>
                    <td><strong>${inv.totalAmount?.toLocaleString()}</strong></td>
                    <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${isPaid ? 'success' : isPending ? 'warning' : 'error'}`} style={{ textTransform: 'capitalize' }}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm">View Receipt</button>
                    </td>
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

export default FeeManagementPage;
