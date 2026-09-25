import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Award, Search, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../../components/common/ToastContext';
import { getResults } from '../../services/api';

const ExamResultsPage = () => {
  const { showToast } = useToast();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExamResults();
  }, []);

  const fetchExamResults = async () => {
    try {
      setLoading(true);
      const res = await getResults();
      const list = res.examresults || res.results || (Array.isArray(res) ? res : []);
      setResults(list);
    } catch (err) {
      console.error('Failed to load exam results:', err);
      showToast('Failed to load exam results.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter(r => {
    const studentName = r.student?.name || '';
    const subName = r.subject?.name || '';
    const term = searchTerm.toLowerCase();
    return studentName.toLowerCase().includes(term) || subName.toLowerCase().includes(term);
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Examination Results Report', 14, 15);
    const tableColumn = ["Roll No / ID", "Student Name", "Class", "Subject", "Score", "Grade"];
    const tableRows = [];

    filtered.forEach(r => {
      const student = r.student;
      const cls = r.class;
      const sub = r.subject;
      const rowData = [
        student?.rollNumber || student?.admissionNumber || r._id?.slice(-5).toUpperCase() || '-',
        student?.name || 'Student',
        cls?.name ? `${cls.name} ${cls.section || ''}` : '-',
        sub?.name || 'General',
        `${r.marksObtained || 0} / ${r.maxMarks || 100}`,
        r.grade || 'Pass'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('Exam_Results_Report.pdf');
    showToast('Exam results exported to PDF!', 'success');
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Exam Results & Scorecards</h1>
          <p className="page-subtitle">Standardized assessment grades and student scorecards</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={exportPDF}>
            <Download size={16} /> Export All Results
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-4)', maxWidth: '350px' }}>
        <div className="header-search" style={{ margin: 0, width: '100%' }}>
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search student name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="data-table-container glass-card hover-lift">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading exam results...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Assessment</th>
                <th>Marks Obtained</th>
                <th>Max Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No exam scorecards found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const s = r.student;
                  const c = r.class;
                  const sub = r.subject;
                  return (
                    <tr key={r._id}>
                      <td><strong>{s?.rollNumber || s?.admissionNumber || r._id.slice(-6).toUpperCase()}</strong></td>
                      <td><strong>{s?.name || 'Enrolled Student'}</strong></td>
                      <td>{c?.name ? `${c.name} ${c.section || ''}` : '-'}</td>
                      <td>{sub?.name || 'General Subject'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{r.examType || 'Term Exam'}</td>
                      <td><strong>{r.marksObtained}</strong></td>
                      <td>{r.maxMarks}</td>
                      <td>
                        <span className={`badge ${['A+', 'A'].includes(r.grade) ? 'success' : ['B+', 'B'].includes(r.grade) ? 'info' : 'warning'}`}>
                          {r.grade || 'Pass'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamResultsPage;
