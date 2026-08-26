import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Award, Search, Download } from 'lucide-react';

const ExamResultsPage = () => {
  const results = [
    { id: 'STU-1001', name: 'Janet Adebayo', class: '10-A', math: '95', physics: '88', english: '92', computer: '98', gpa: '3.92', grade: 'A+' },
    { id: 'STU-1002', name: 'Marcus Chen', class: '9-B', math: '82', physics: '79', english: '85', computer: '90', gpa: '3.50', grade: 'A' },
    { id: 'STU-1003', name: 'Sophia Smith', class: '11-A', math: '70', physics: '68', english: '75', computer: '80', gpa: '3.00', grade: 'B' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Exam Results</h1>
          <p className="page-subtitle">Mid-Term Examination 2024 Report Cards</p>
        </div>
        <button className="btn btn-secondary">
          <Download size={16} /> Export All Results
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Class</th>
              <th>Math</th>
              <th>Physics</th>
              <th>English</th>
              <th>Comp Sci</th>
              <th>GPA</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.id}</strong></td>
                <td><strong>{r.name}</strong></td>
                <td>Grade {r.class}</td>
                <td>{r.math}</td>
                <td>{r.physics}</td>
                <td>{r.english}</td>
                <td>{r.computer}</td>
                <td><strong>{r.gpa}</strong></td>
                <td><span className="badge success">{r.grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ExamResultsPage;
