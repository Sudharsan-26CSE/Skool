import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';

const StudentListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    { id: 'STU-1001', name: 'Janet Adebayo', class: '10-A', parent: 'Michael Adebayo', phone: '+1 234 567 890', email: 'janet@example.com', gender: 'Female', status: 'Active' },
    { id: 'STU-1002', name: 'Marcus Chen', class: '9-B', parent: 'David Chen', phone: '+1 234 567 891', email: 'marcus@example.com', gender: 'Male', status: 'Active' },
    { id: 'STU-1003', name: 'Sophia Smith', class: '11-A', parent: 'Sarah Smith', phone: '+1 234 567 892', email: 'sophia@example.com', gender: 'Female', status: 'Pending' },
    { id: 'STU-1004', name: 'Lucas Williams', class: '8-C', parent: 'Robert Williams', phone: '+1 234 567 893', email: 'lucas@example.com', gender: 'Male', status: 'Active' },
    { id: 'STU-1005', name: 'Olivia Johnson', class: '12-A', parent: 'Emma Johnson', phone: '+1 234 567 894', email: 'olivia@example.com', gender: 'Female', status: 'Inactive' },
    { id: 'STU-1006', name: 'Ethan Davis', class: '10-B', parent: 'James Davis', phone: '+1 234 567 895', email: 'ethan@example.com', gender: 'Male', status: 'Active' },
    { id: 'STU-1007', name: 'Ava Wilson', class: '7-A', parent: 'Daniel Wilson', phone: '+1 234 567 896', email: 'ava@example.com', gender: 'Female', status: 'Active' },
  ];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Manage all registered students and their academic profiles</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/students/add')}>
          <Plus size={16} /> Add New Student
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)' }} />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-2) var(--space-4)', paddingLeft: '36px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', outline: 'none' }}
            />
          </div>
          <div className="data-table-actions">
            <button className="btn btn-secondary">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Class</th>
              <th>Gender</th>
              <th>Parent / Guardian</th>
              <th>Contact Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td><strong>{student.id}</strong></td>
                <td>
                  <div className="table-user">
                    <div className="table-avatar">{student.name.charAt(0)}</div>
                    <div className="table-user-info">
                      <span className="table-user-name">{student.name}</span>
                      <span className="table-user-email">{student.email}</span>
                    </div>
                  </div>
                </td>
                <td>Grade {student.class}</td>
                <td>{student.gender}</td>
                <td>{student.parent}</td>
                <td>{student.phone}</td>
                <td>
                  <span className={`badge ${student.status === 'Active' ? 'success' : student.status === 'Pending' ? 'warning' : 'error'}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-sm" title="View Profile" onClick={() => navigate(`/students/${student.id}`)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Edit Student">
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Delete" style={{ color: 'var(--error)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pagination-info">Showing 1 to {filteredStudents.length} of 3,654 entries</span>
          <div className="pagination-buttons">
            <button className="pagination-btn">‹</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">›</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentListPage;
