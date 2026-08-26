import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, BookOpen, Search } from 'lucide-react';

const SubjectManagementPage = () => {
  const subjects = [
    { code: 'SUB-101', name: 'Mathematics', category: 'Core Academic', credits: '4 Credits', teacher: 'Dr. Sarah Connor' },
    { code: 'SUB-102', name: 'Physics', category: 'Science', credits: '4 Credits', teacher: 'Prof. Albert Vance' },
    { code: 'SUB-103', name: 'English Literature', category: 'Humanities', credits: '3 Credits', teacher: 'Ms. Emma Watson' },
    { code: 'SUB-104', name: 'Computer Science', category: 'Technology', credits: '4 Credits', teacher: 'Mr. Alan Turing' },
    { code: 'SUB-105', name: 'Chemistry', category: 'Science', credits: '4 Credits', teacher: 'Mrs. Maria Garcia' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Subject Management</h1>
          <p className="page-subtitle">Academic curriculum and course code allocation</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add New Subject
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Category</th>
              <th>Academic Credits</th>
              <th>Department Head</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => (
              <tr key={sub.code}>
                <td><strong>{sub.code}</strong></td>
                <td>
                  <div className="cell-with-icon">
                    <BookOpen size={16} color="var(--primary)" />
                    <strong>{sub.name}</strong>
                  </div>
                </td>
                <td><span className="badge neutral">{sub.category}</span></td>
                <td>{sub.credits}</td>
                <td>{sub.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SubjectManagementPage;
