import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { CreditCard, Download, Plus, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getPayrolls } from '../../services/api';

const PayrollPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [payrollList, setPayrollList] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const data = await getPayrolls();
      setPayrollList(data.payrolls || []);
    } catch (err) {
      showToast('Failed to load payroll records. Using offline mode.', 'warning');
      setPayrollList([]);
    } finally {
      setLoading(false);
    }
  };



  const handleApprove = (id) => {
    // Simulated approval
    showToast(`Payroll ${id} approved successfully!`, 'success');
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Payroll</h1>
          <p className="page-subtitle">Salary disbursements and monthly compensation</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/payroll/add')}>
            <CreditCard size={16} /> Process Monthly Payroll
          </button>
        )}
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading payroll records...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payroll ID</th>
                <th>Employee</th>
                <th>Role</th>
                <th>Period</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollList.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>No payroll records found</td></tr>
              ) : payrollList.map((p) => {
                const isPaid = p.status === 'paid' || p.status === 'Paid';
                const isPending = p.status === 'pending' || p.status === 'Pending';
                
                return (
                  <tr key={p._id}>
                    <td><strong>{p._id.substring(0,8)}</strong></td>
                    <td>{p.staff?.name || 'Unknown'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.staff?.role || 'Unknown'}</td>
                    <td>{new Date(0, (p.month || 5) - 1).toLocaleString('default', { month: 'short' })} {p.year || 2024}</td>
                    <td><strong>${p.netPay?.toLocaleString()}</strong></td>
                    <td>
                      <span className={`badge ${isPaid ? 'success' : isPending ? 'warning' : 'info'}`} style={{ textTransform: 'capitalize' }}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost btn-sm" title="Download Slip"><Download size={16} /></button>
                        {isAdmin && isPending && (
                          <button className="icon-btn success" title="Approve Payment" onClick={() => handleApprove(p._id)}>
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                      </div>
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

export default PayrollPage;
