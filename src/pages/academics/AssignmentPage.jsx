import React, { useRef, useState, useCallback, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UploadCloud, CalendarDays, FileText, CheckCircle2,
  ArrowLeft, X, Paperclip, User, BookOpen, AlignLeft,
  Sparkles, Eye, Download, ExternalLink, Check, Award,
  Clock, Search, Filter, Printer, ZoomIn, ZoomOut, ChevronRight,
  AlertCircle
} from 'lucide-react';
import { getAssignments, createAssignment } from '../../services/api';

/* ─── DEFAULT ENROLLED STUDENTS & SUBMISSIONS ────────────────────── */
const DEFAULT_STUDENTS = [
  {
    id: 'STU-1001',
    name: 'Sudhan S',
    email: '24104070@nec.edu.in',
    rollNo: 'STU-1001',
    className: 'Grade 10-A',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1002',
    name: 'John Doe',
    email: 'john.doe@skool.edu',
    rollNo: 'STU-1002',
    className: 'Grade 10-A',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1003',
    name: 'Jane Smith',
    email: 'jane.smith@skool.edu',
    rollNo: 'STU-1003',
    className: 'Grade 10-A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1004',
    name: 'Robert Brown',
    email: 'robert.b@skool.edu',
    rollNo: 'STU-1004',
    className: 'Grade 10-A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1005',
    name: 'Emily Davis',
    email: 'emily.d@skool.edu',
    rollNo: 'STU-1005',
    className: 'Grade 10-A',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'STU-1006',
    name: 'Michael Wilson',
    email: 'michael.w@skool.edu',
    rollNo: 'STU-1006',
    className: 'Grade 10-A',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
];

const INITIAL_MOCK_SUBMISSIONS = {
  // Assignment 1: Mathematics - Polynomial Functions
  '6ab24d498b0ae2f000a8d771': [
    {
      studentId: 'STU-1001',
      studentName: 'Sudhan S',
      rollNo: 'STU-1001',
      className: 'Grade 10-A',
      email: '24104070@nec.edu.in',
      submittedAt: 'Sep 23, 2026, 02:30 PM',
      status: 'Submitted',
      score: 95,
      maxScore: 100,
      gradeLetter: 'A+',
      feedback: 'Outstanding mathematical rigor. The quadratic vertex derivations and graphical sketches are completely accurate.',
      fileName: 'Polynomial_Functions_Solutions_SudhanS.pdf',
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
      notes: 'Completed all 5 exercises with full step-by-step quadratic formula derivations. Scanned copy attached.',
      documentContent: {
        title: 'Polynomial Functions & Quadratic Curves — Problem Set 4',
        subject: 'Mathematics',
        submittedBy: 'Sudhan S (STU-1001)',
        teacher: 'Sarah Connor',
        pages: [
          `EXERCISE 4.1: ROOTS OF QUADRATIC POLYNOMIALS
Problem 1: Solve f(x) = 2x² - 4x - 6 = 0 using the quadratic formula.

Step 1: Identify coefficients:
  a = 2,  b = -4,  c = -6

Step 2: Compute Discriminant (Δ):
  Δ = b² - 4ac = (-4)² - 4(2)(-6) = 16 + 48 = 64
  Since Δ > 0, there are two distinct real roots.

Step 3: Quadratic Formula:
  x = (-b ± √Δ) / (2a)
  x = (4 ± √64) / (2 × 2) = (4 ± 8) / 4
  x₁ = (4 + 8) / 4 = 12 / 4 = 3
  x₂ = (4 - 8) / 4 = -4 / 4 = -1

Verification:
  f(3)  = 2(3)² - 4(3) - 6 = 18 - 12 - 6 = 0  ✓
  f(-1) = 2(-1)² - 4(-1) - 6 = 2 + 4 - 6 = 0  ✓
Result: The solutions are x = 3 and x = -1.`,

          `EXERCISE 4.2: VERTEX & AXIS OF SYMMETRY
Problem 2: Find the vertex and graph characteristics of g(x) = -x² + 6x - 5.

Step 1: Vertex coordinate formula:
  h = -b / (2a) = -6 / (2 × -1) = -6 / -2 = 3
  k = g(3) = -(3)² + 6(3) - 5 = -9 + 18 - 5 = 4
  Vertex (h, k) = (3, 4)

Step 2: Axis of symmetry: x = 3.
  Since a = -1 < 0, the parabola opens downward with a MAXIMUM value of 4 at x = 3.

Step 3: Intercepts:
  y-intercept (x = 0): g(0) = -5 -> (0, -5)
  x-intercepts (y = 0): -x² + 6x - 5 = 0 => x² - 6x + 5 = 0
  (x - 1)(x - 5) = 0 => x = 1 and x = 5.

Conclusion:
  Vertex at (3, 4). Parabola intersects x-axis at (1, 0) and (5, 0).
  Sketch matches theoretical curve perfectly.`
        ]
      }
    },
    {
      studentId: 'STU-1002',
      studentName: 'John Doe',
      rollNo: 'STU-1002',
      className: 'Grade 10-A',
      email: 'john.doe@skool.edu',
      submittedAt: 'Sep 22, 2026, 11:15 AM',
      status: 'Graded',
      score: 88,
      maxScore: 100,
      gradeLetter: 'A',
      feedback: 'Good work! Watch your signs in exercise 4.3.',
      fileName: 'Quadratics_Problem_Set_JohnDoe.pdf',
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      notes: 'Completed sections 4.1 to 4.4.',
      documentContent: {
        title: 'Polynomial Functions Problem Set',
        subject: 'Mathematics',
        submittedBy: 'John Doe (STU-1002)',
        teacher: 'Sarah Connor',
        pages: [
          `JOHN DOE — HOMEWORK SUBMISSION
Subject: Mathematics (Algebra II)
Topic: Polynomial Functions & Quadratic Curves

Answers to Exercises:
1. Roots of 2x² - 4x - 6 = 0:
   x = 3 and x = -1. Discriminant = 64.
2. Vertex of -x² + 6x - 5:
   Vertex at (3, 4). Opens downward.
3. Graph analysis completed with coordinates table.`
        ]
      }
    },
    {
      studentId: 'STU-1003',
      studentName: 'Jane Smith',
      rollNo: 'STU-1003',
      className: 'Grade 10-A',
      email: 'jane.smith@skool.edu',
      submittedAt: 'Sep 22, 2026, 04:45 PM',
      status: 'Submitted',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: 'Jane_Smith_Math_HW.docx',
      fileSize: '1.2 MB',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      notes: 'Please find my quadratic homework attached. Questions 1 to 5 answered.',
      documentContent: {
        title: 'Jane Smith Coursework Submission',
        subject: 'Mathematics',
        submittedBy: 'Jane Smith (STU-1003)',
        teacher: 'Sarah Connor',
        pages: [
          `Jane Smith - Grade 10-A
Polynomial Functions Assignment
All problems completed with step-by-step mathematical reasoning.`
        ]
      }
    },
    {
      studentId: 'STU-1004',
      studentName: 'Robert Brown',
      rollNo: 'STU-1004',
      className: 'Grade 10-A',
      email: 'robert.b@skool.edu',
      submittedAt: 'Sep 23, 2026, 09:10 AM',
      status: 'Submitted',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: 'RobertBrown_Polynomials.pdf',
      fileSize: '980 KB',
      fileType: 'application/pdf',
      notes: 'Included graph plots on page 2.',
      documentContent: {
        title: 'Polynomial Curves Analysis',
        subject: 'Mathematics',
        submittedBy: 'Robert Brown (STU-1004)',
        teacher: 'Sarah Connor',
        pages: [
          `Robert Brown - Mathematics Assignment
Exercises 4.1 - 4.5
Calculations verified using discriminant method.`
        ]
      }
    },
    {
      studentId: 'STU-1005',
      studentName: 'Emily Davis',
      rollNo: 'STU-1005',
      className: 'Grade 10-A',
      email: 'emily.d@skool.edu',
      submittedAt: null,
      status: 'Pending',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: null,
      fileSize: null,
      notes: null,
    },
    {
      studentId: 'STU-1006',
      studentName: 'Michael Wilson',
      rollNo: 'STU-1006',
      className: 'Grade 10-A',
      email: 'michael.w@skool.edu',
      submittedAt: null,
      status: 'Pending',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: null,
      fileSize: null,
      notes: null,
    },
  ],

  // Assignment 2: Physics - Newtonian Dynamics
  '6ab24d498b0ae2f000a8d772': [
    {
      studentId: 'STU-1001',
      studentName: 'Sudhan S',
      rollNo: 'STU-1001',
      className: 'Grade 10-A',
      email: '24104070@nec.edu.in',
      submittedAt: 'Sep 22, 2026, 03:20 PM',
      status: 'Graded',
      score: 98,
      maxScore: 100,
      gradeLetter: 'A+',
      feedback: 'Superb laboratory report. The frictional coefficient graph and uncertainty calculations are exemplary.',
      fileName: 'Newtonian_Dynamics_Lab_SudhanS.pdf',
      fileSize: '3.1 MB',
      fileType: 'application/pdf',
      notes: 'Laboratory observations on inclined planes and coefficient of friction included.',
      documentContent: {
        title: 'Newtonian Dynamics & Frictional Coefficients Laboratory Report',
        subject: 'Physics',
        submittedBy: 'Sudhan S (STU-1001)',
        teacher: 'Albert Vance',
        pages: [
          `PHYSICS EXPERIMENTAL INVESTIGATION
Title: Measurement of Static and Kinetic Frictional Coefficients on Wood and Aluminum Surfaces
Student: Sudhan S | Roll No: STU-1001 | Class: Grade 10-A

1. OBJECTIVE:
To determine the coefficient of static friction (μs) and kinetic friction (μk) between various materials using an adjustable inclined plane apparatus.

2. THEORETICAL BACKGROUND:
Newton's Second Law: ΣF = m·a
At impending motion on an incline of angle θ:
  Fs = mg·sin(θ)
  Fn = mg·cos(θ)
  μs = Fs / Fn = tan(θ)

3. EXPERIMENTAL DATA:
Trial 1 (Wood on Wood):
  Mass (m) = 250 g
  Angle of slip (θs) = 21.5° ± 0.5°
  μs = tan(21.5°) = 0.394

Trial 2 (Aluminum on Wood):
  Mass (m) = 250 g
  Angle of slip (θs) = 17.2° ± 0.5°
  μs = tan(17.2°) = 0.310`,

          `4. ERROR ANALYSIS & CONCLUSION:
The theoretical coefficient of static friction for wood-on-wood is reported as 0.35-0.45.
Our experimental result of 0.394 lies within 2.3% of the reference standard.
Sources of systematic error included air currents and surface unevenness, mitigated by repeated trials.`
        ]
      }
    },
    {
      studentId: 'STU-1002',
      studentName: 'John Doe',
      rollNo: 'STU-1002',
      className: 'Grade 10-A',
      email: 'john.doe@skool.edu',
      submittedAt: 'Sep 21, 2026, 01:10 PM',
      status: 'Graded',
      score: 85,
      maxScore: 100,
      gradeLetter: 'B+',
      feedback: 'Good experimental setup and data collection.',
      fileName: 'Physics_Lab_Report_JD.pdf',
      fileSize: '2.2 MB',
      fileType: 'application/pdf',
      notes: 'Data tables and error calculations included.',
      documentContent: {
        title: 'Physics Lab Report - Dynamics',
        subject: 'Physics',
        submittedBy: 'John Doe (STU-1002)',
        teacher: 'Albert Vance',
        pages: [`John Doe - Physics Experiment Report on Newtonian Dynamics.`]
      }
    },
    {
      studentId: 'STU-1003',
      studentName: 'Jane Smith',
      rollNo: 'STU-1003',
      className: 'Grade 10-A',
      email: 'jane.smith@skool.edu',
      submittedAt: 'Sep 22, 2026, 10:30 AM',
      status: 'Submitted',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: 'Jane_Smith_Physics_Lab.pdf',
      fileSize: '1.9 MB',
      fileType: 'application/pdf',
      notes: 'Complete lab writeup with graphs.',
      documentContent: {
        title: 'Physics Lab Writeup',
        subject: 'Physics',
        submittedBy: 'Jane Smith (STU-1003)',
        teacher: 'Albert Vance',
        pages: [`Jane Smith - Laboratory Report on Frictional Coefficients.`]
      }
    },
    {
      studentId: 'STU-1004',
      studentName: 'Robert Brown',
      rollNo: 'STU-1004',
      className: 'Grade 10-A',
      email: 'robert.b@skool.edu',
      submittedAt: 'Sep 23, 2026, 11:00 AM',
      status: 'Submitted',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: 'Dynamics_Exp_RobertBrown.pdf',
      fileSize: '2.5 MB',
      fileType: 'application/pdf',
      notes: 'Report draft with graphs.',
      documentContent: {
        title: 'Newtonian Dynamics Report',
        subject: 'Physics',
        submittedBy: 'Robert Brown (STU-1004)',
        teacher: 'Albert Vance',
        pages: [`Robert Brown - Physics Experiment Report.`]
      }
    },
    {
      studentId: 'STU-1005',
      studentName: 'Emily Davis',
      rollNo: 'STU-1005',
      className: 'Grade 10-A',
      email: 'emily.d@skool.edu',
      submittedAt: 'Sep 23, 2026, 08:45 AM',
      status: 'Submitted',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: 'EmilyDavis_Newtonian_Lab.docx',
      fileSize: '1.1 MB',
      fileType: 'application/docx',
      notes: 'Submitted.',
      documentContent: {
        title: 'Lab Report',
        subject: 'Physics',
        submittedBy: 'Emily Davis (STU-1005)',
        teacher: 'Albert Vance',
        pages: [`Emily Davis - Lab findings on inclined planes.`]
      }
    },
    {
      studentId: 'STU-1006',
      studentName: 'Michael Wilson',
      rollNo: 'STU-1006',
      className: 'Grade 10-A',
      email: 'michael.w@skool.edu',
      submittedAt: null,
      status: 'Pending',
      score: null,
      maxScore: 100,
      gradeLetter: '',
      feedback: '',
      fileName: null,
      fileSize: null,
      notes: null,
    },
  ],

  // Assignment 3: Computer Science - Linked Lists
  '6ab24d498b0ae2f000a8d773': [
    {
      studentId: 'STU-1001',
      studentName: 'Sudhan S',
      rollNo: 'STU-1001',
      className: 'Grade 10-A',
      email: '24104070@nec.edu.in',
      submittedAt: 'Sep 21, 2026, 05:00 PM',
      status: 'Graded',
      score: 100,
      maxScore: 100,
      gradeLetter: 'A+',
      feedback: 'Flawless Python implementation of Doubly Linked List with reversal and cycle detection!',
      fileName: 'linked_list_sudhan.py',
      fileSize: '12 KB',
      fileType: 'text/x-python',
      notes: 'Included test suite and time complexity documentation.',
      documentContent: {
        title: 'Data Structures Lab: Singly & Doubly Linked Lists',
        subject: 'Computer Science',
        submittedBy: 'Sudhan S (STU-1001)',
        teacher: 'Alan Turing',
        pages: [
          `# ========================================================
# DATA STRUCTURES LAB: LINKED LIST IMPLEMENTATION
# Student: Sudhan S (STU-1001) | Grade 10-A
# Language: Python 3.11
# ========================================================

class Node:
    """Represents a singly-linked node."""
    def __init__(self, data=None):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self._size = 0

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
        else:
            curr = self.head
            while curr.next:
                curr = curr.next
            curr.next = new_node
        self._size += 1

    def reverse(self):
        """In-place reversal: Time O(n), Space O(1)."""
        prev = None
        curr = self.head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        self.head = prev

    def display(self):
        elements = []
        curr = self.head
        while curr:
            elements.append(str(curr.data))
            curr = curr.next
        return " -> ".join(elements) + " -> None"

# Unit Testing
if __name__ == '__main__':
    ll = SinglyLinkedList()
    for val in [10, 20, 30, 40]:
        ll.append(val)
    print("Original:", ll.display())
    ll.reverse()
    print("Reversed:", ll.display())
    # Output: 40 -> 30 -> 20 -> 10 -> None`
        ]
      }
    }
  ]
};

/* ─── DOCUMENT PREVIEWER MODAL ───────────────────────────────────── */
const DocumentPreviewModal = ({ submission, assignment, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);

  const doc = submission.documentContent || {
    title: submission.fileName || 'Submitted Assignment Document',
    subject: assignment?.subject || 'Academic Task',
    submittedBy: `${submission.studentName} (${submission.rollNo})`,
    teacher: assignment?.assignedBy || 'Faculty Instructor',
    pages: [
      `STUDENT ASSIGNMENT SUBMISSION\n` +
      `Student: ${submission.studentName} (${submission.rollNo})\n` +
      `Class: ${submission.className} | Date: ${submission.submittedAt || 'Recent'}\n` +
      `File: ${submission.fileName}\n\n` +
      `Student Notes: ${submission.notes || 'No extra notes provided.'}\n\n` +
      `Submission Verified: This document was submitted and authenticated via Skool Academic Portal.`
    ]
  };

  const pages = doc.pages || [doc.title];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([pages.join('\n\n--- PAGE BREAK ---\n\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = submission.fileName || 'assignment-submission.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="doc-preview-backdrop" onClick={onClose}>
      <div className="doc-preview-content" onClick={(e) => e.stopPropagation()}>
        {/* Document Viewer Top Toolbar */}
        <div className="doc-viewer-toolbar">
          <div className="doc-toolbar-left">
            <FileText size={18} className="text-primary" />
            <div>
              <h4 className="doc-toolbar-title">{submission.fileName}</h4>
              <span className="doc-toolbar-sub">{submission.studentName} · {submission.rollNo}</span>
            </div>
          </div>

          <div className="doc-toolbar-center">
            <button
              type="button"
              className="doc-tool-btn"
              title="Zoom Out"
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
            >
              <ZoomOut size={15} />
            </button>
            <span className="doc-zoom-label">{zoomLevel}%</span>
            <button
              type="button"
              className="doc-tool-btn"
              title="Zoom In"
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 160))}
            >
              <ZoomIn size={15} />
            </button>
            <span className="doc-divider">|</span>
            <span className="doc-page-indicator">Page {currentPage + 1} of {pages.length}</span>
          </div>

          <div className="doc-toolbar-right">
            <button type="button" className="doc-tool-btn" title="Print Document" onClick={handlePrint}>
              <Printer size={16} />
            </button>
            <button type="button" className="doc-tool-btn" title="Download File" onClick={handleDownload}>
              <Download size={16} />
            </button>
            <button type="button" className="doc-tool-close" title="Close Viewer" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document Pages Body */}
        <div className="doc-viewer-body">
          {submission.realFileUrl ? (
            <div className="doc-real-file-view">
              {submission.realFileType?.startsWith('image/') ? (
                <img
                  src={submission.realFileUrl}
                  alt={submission.fileName}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                />
              ) : (
                <iframe
                  src={submission.realFileUrl}
                  title="Document Preview"
                  className="doc-real-iframe"
                />
              )}
            </div>
          ) : (
            <div
              className="doc-sheet"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Paper Sheet Header */}
              <div className="doc-sheet-header">
                <div className="doc-sheet-crest">
                  <Sparkles size={20} />
                  <span>SKOOL ACADEMIC EVALUATION</span>
                </div>
                <div className="doc-sheet-meta-grid">
                  <div><strong>Coursework:</strong> {doc.title}</div>
                  <div><strong>Subject:</strong> {doc.subject}</div>
                  <div><strong>Student:</strong> {submission.studentName} ({submission.rollNo})</div>
                  <div><strong>Date:</strong> {submission.submittedAt || 'Recent'}</div>
                </div>
              </div>

              <hr className="doc-sheet-divider" />

              {/* Sheet Page Content */}
              <div className="doc-sheet-body">
                <pre className="doc-sheet-code">{pages[currentPage]}</pre>
              </div>

              {/* Multi-page navigation footer if multiple pages */}
              {pages.length > 1 && (
                <div className="doc-sheet-nav">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                  >
                    ← Previous Page
                  </button>
                  <span>Page {currentPage + 1} of {pages.length}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    disabled={currentPage === pages.length - 1}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))}
                  >
                    Next Page →
                  </button>
                </div>
              )}

              <div className="doc-sheet-footer">
                <span>Verified Digital Submission · Skool LMS</span>
                <span>{submission.fileName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── STUDENT SUBMISSION & GRADING MODAL ─────────────────────────── */
const SubmissionDetailModal = ({ submission, assignment, onClose, onSaveGrade }) => {
  const [score, setScore] = useState(submission.score ?? '');
  const [gradeLetter, setGradeLetter] = useState(submission.gradeLetter || 'A');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [status, setStatus] = useState(submission.status === 'Graded' ? 'Graded' : 'Graded');
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveGrade({
      ...submission,
      score: score !== '' ? Number(score) : null,
      gradeLetter,
      feedback,
      status: 'Graded',
    });
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 900);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(submission, null, 2)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = submission.fileName || `${submission.studentName}_submission.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div className="assign-modal-backdrop" onClick={onClose} />
      <div className="assign-modal-panel submission-detail-panel" role="dialog" aria-label="Student Submission Details">
        {/* Header */}
        <div className="assign-modal-header">
          <div className="assign-modal-title-row">
            <div className="student-modal-avatar">
              {submission.avatar ? (
                <img src={submission.avatar} alt={submission.studentName} />
              ) : (
                <span>{submission.studentName?.charAt(0) || 'S'}</span>
              )}
            </div>
            <div>
              <h2 className="assign-modal-title">{submission.studentName}</h2>
              <p className="assign-modal-subtitle">
                {submission.rollNo} · {submission.className} · {submission.email}
              </p>
            </div>
          </div>
          <button className="assign-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="submission-detail-body">
          {/* Submission Status Info */}
          <div className="sub-info-banner">
            <div className="sub-info-col">
              <span className="sub-info-lbl"><Clock size={13} /> Submitted Time:</span>
              <strong className="sub-info-val">{submission.submittedAt || 'Pending Submission'}</strong>
            </div>
            <div className="sub-info-col">
              <span className="sub-info-lbl"><Award size={13} /> Status:</span>
              <span className={`badge ${submission.status === 'Graded' ? 'success' : submission.status === 'Submitted' ? 'info' : 'neutral'}`}>
                {submission.status || 'Pending'}
              </span>
            </div>
            {submission.score != null && (
              <div className="sub-info-col">
                <span className="sub-info-lbl">Current Grade:</span>
                <strong className="sub-info-score text-primary">{submission.score} / 100 ({submission.gradeLetter || 'A'})</strong>
              </div>
            )}
          </div>

          {/* Student Notes */}
          {submission.notes && (
            <div className="sub-notes-card">
              <span className="sub-card-title"><AlignLeft size={13} /> Student Remarks / Notes:</span>
              <p className="sub-notes-text">"{submission.notes}"</p>
            </div>
          )}

          {/* Submitted File Details Card */}
          <div className="sub-file-card">
            <span className="sub-card-title"><Paperclip size={14} /> Submitted Assignment File:</span>
            {submission.fileName ? (
              <div className="sub-file-details-row">
                <div className="sub-file-icon-box">
                  <FileText size={26} />
                </div>
                <div className="sub-file-meta">
                  <strong className="sub-file-name">{submission.fileName}</strong>
                  <span className="sub-file-sub">{submission.fileSize || '2.4 MB'} · Verified Coursework Document</span>
                </div>
                <div className="sub-file-action-buttons">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary sub-open-file-btn"
                    onClick={() => setShowDocPreview(true)}
                  >
                    <Eye size={14} /> Open File
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline sub-download-file-btn"
                    onClick={handleDownload}
                    title="Download file"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="sub-no-file-state">
                <AlertCircle size={20} className="text-warning" />
                <span>No file uploaded yet. Student has not turned in this assignment.</span>
              </div>
            )}
          </div>

          {/* Teacher Assessment & Grading Form */}
          <form className="sub-grading-form" onSubmit={handleSave}>
            <span className="sub-card-title"><Award size={14} /> Evaluation & Grading:</span>

            <div className="grading-inputs-row">
              <div className="grading-field">
                <label className="assign-label">Score (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="assign-input"
                  placeholder="e.g. 95"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>

              <div className="grading-field">
                <label className="assign-label">Grade</label>
                <select
                  className="assign-input assign-select"
                  value={gradeLetter}
                  onChange={(e) => setGradeLetter(e.target.value)}
                >
                  <option value="A+">A+ (90-100%)</option>
                  <option value="A">A (80-89%)</option>
                  <option value="B+">B+ (75-79%)</option>
                  <option value="B">B (70-74%)</option>
                  <option value="C">C (60-69%)</option>
                  <option value="D">D (50-59%)</option>
                  <option value="F">F (&lt;50%)</option>
                </select>
              </div>

              <div className="grading-field">
                <label className="assign-label">Review Status</label>
                <select
                  className="assign-input assign-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Graded">Graded ✓</option>
                  <option value="Submitted">Reviewed (No Grade)</option>
                  <option value="Needs Resubmission">Needs Resubmission</option>
                </select>
              </div>
            </div>

            <div className="grading-field">
              <label className="assign-label">Teacher Feedback & Remarks</label>
              <textarea
                className="assign-input assign-textarea"
                rows={2}
                placeholder="Write feedback for this student's work…"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div className="assign-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${savedFeedback ? 'btn-success' : ''}`}
              >
                {savedFeedback ? (
                  <><CheckCircle2 size={16} /> Grade Saved!</>
                ) : (
                  <><Check size={16} /> Save Grade & Feedback</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Document Viewer if Teacher clicks Open File */}
      {showDocPreview && (
        <DocumentPreviewModal
          submission={submission}
          assignment={assignment}
          onClose={() => setShowDocPreview(false)}
        />
      )}
    </>
  );
};

/* ─── MAIN ASSIGNMENT PAGE ─────────────────────────────────────── */
const AssignmentPage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isTeacher = role === 'teacher' || role === 'staff' || role === 'admin';
  const isStudent = role === 'student';
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Student upload state
  const [studentSubmission, setStudentSubmission] = useState(null);

  // Teacher Submissions state
  const [assignmentSubmissions, setAssignmentSubmissions] = useState({});
  const [selectedStudentForReview, setSelectedStudentForReview] = useState(null);
  const [submissionFilter, setSubmissionFilter] = useState('all'); // 'all' | 'submitted' | 'pending' | 'graded'
  const [searchStudent, setSearchStudent] = useState('');

  // Storage key for submissions
  const SUBMISSION_STORAGE_KEY = 'skool_assignment_submissions_records';

  // Load and sync assignments and submissions
  useEffect(() => {
    fetchAssignments();
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    try {
      const stored = localStorage.getItem(SUBMISSION_STORAGE_KEY);
      if (stored) {
        setAssignmentSubmissions(JSON.parse(stored));
      } else {
        setAssignmentSubmissions(INITIAL_MOCK_SUBMISSIONS);
        localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_SUBMISSIONS));
      }
    } catch (e) {
      setAssignmentSubmissions(INITIAL_MOCK_SUBMISSIONS);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await getAssignments();
      const list = res.assignments || (Array.isArray(res) ? res : []);
      const mapped = list.map((a) => ({
        id: a._id,
        title: a.title,
        class: a.className || a.class?.name || (typeof a.class === 'string' ? a.class : 'Grade 10-A'),
        subject: a.subject?.name || a.subject || 'General',
        startDate: new Date(a.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 02, 2026',
        status: a.status || 'Active',
        assignedBy: a.assignedBy || 'Faculty',
        submissionsCount: a.submissions || '4/6',
        instructions: a.instructions || a.description || 'Complete all assignment exercises according to guidelines and upload solutions.',
      }));
      setAssignments(mapped);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedAssignment = assignments.find((a) => a.id === assignmentId);

  // Get current assignment submissions
  const currentSubmissions = selectedAssignment
    ? (assignmentSubmissions[selectedAssignment.id] || INITIAL_MOCK_SUBMISSIONS[selectedAssignment.id] || DEFAULT_STUDENTS.map(s => ({
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo,
        className: s.className,
        email: s.email,
        submittedAt: 'Sep 23, 2026, 10:00 AM',
        status: 'Submitted',
        score: null,
        fileName: `${s.name.replace(/\s+/g, '_')}_Assignment.pdf`,
        fileSize: '1.8 MB',
        notes: 'Completed task submission.'
      })))
    : [];

  // Filter submissions
  const filteredSubmissions = currentSubmissions.filter((sub) => {
    const matchesSearch =
      sub.studentName?.toLowerCase().includes(searchStudent.toLowerCase()) ||
      sub.rollNo?.toLowerCase().includes(searchStudent.toLowerCase());

    if (!matchesSearch) return false;
    if (submissionFilter === 'all') return true;
    if (submissionFilter === 'submitted') return sub.status === 'Submitted' || sub.status === 'Graded';
    if (submissionFilter === 'pending') return sub.status === 'Pending' || !sub.submittedAt;
    if (submissionFilter === 'graded') return sub.status === 'Graded';
    return true;
  });

  // Handle student uploading file
  const handleStudentFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setStudentSubmission({
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileUrl: e.target.result,
        fileType: file.type,
        isSubmitted: false
      });
    };
    reader.readAsDataURL(file);
  };

  // Student submit action
  const handleStudentSubmit = () => {
    if (!selectedAssignment || !studentSubmission) return;

    const currentStudentName = localStorage.getItem('preskool-user-name') || 'Sudhan S';
    const currentStudentEmail = localStorage.getItem('preskool-email') || '24104070@nec.edu.in';

    const newRecord = {
      studentId: 'STU-1001',
      studentName: currentStudentName,
      rollNo: 'STU-1001',
      className: selectedAssignment.class,
      email: currentStudentEmail,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted',
      score: null,
      maxScore: 100,
      fileName: studentSubmission.fileName,
      fileSize: studentSubmission.fileSize,
      realFileUrl: studentSubmission.fileUrl,
      realFileType: studentSubmission.fileType,
      notes: 'Submitted via Skool Student Portal.',
      documentContent: {
        title: selectedAssignment.title,
        subject: selectedAssignment.subject,
        submittedBy: `${currentStudentName} (STU-1001)`,
        pages: [`Coursework document submitted by ${currentStudentName}.\nFile: ${studentSubmission.fileName}`]
      }
    };

    // Update assignment submissions
    const existingList = assignmentSubmissions[selectedAssignment.id] || [];
    const updatedList = [newRecord, ...existingList.filter(s => s.studentId !== 'STU-1001')];

    const updatedMap = {
      ...assignmentSubmissions,
      [selectedAssignment.id]: updatedList
    };

    setAssignmentSubmissions(updatedMap);
    localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(updatedMap));

    setStudentSubmission(prev => ({ ...prev, isSubmitted: true }));
    setToast('✅ Assignment submitted successfully to instructor!');
    setTimeout(() => setToast(null), 3500);
  };

  // Teacher save grade action
  const handleSaveGrade = (updatedStudentSub) => {
    if (!selectedAssignment) return;

    const existingList = assignmentSubmissions[selectedAssignment.id] || currentSubmissions;
    const updatedList = existingList.map((s) =>
      s.studentId === updatedStudentSub.studentId ? updatedStudentSub : s
    );

    const updatedMap = {
      ...assignmentSubmissions,
      [selectedAssignment.id]: updatedList
    };

    setAssignmentSubmissions(updatedMap);
    localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(updatedMap));

    setToast(`✅ Grade & feedback saved for ${updatedStudentSub.studentName}!`);
    setTimeout(() => setToast(null), 3000);
  };

  // Submission statistics
  const totalStudents = currentSubmissions.length;
  const submittedCount = currentSubmissions.filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
  const gradedCount = currentSubmissions.filter(s => s.status === 'Graded').length;
  const pendingCount = currentSubmissions.filter(s => s.status === 'Pending' || !s.submittedAt).length;

  return (
    <DashboardLayout>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          {selectedAssignment && (
            <button
              className="btn btn-ghost assignment-back-btn"
              type="button"
              onClick={() => navigate('/assignments')}
            >
              <ArrowLeft size={16} /> All Assignments
            </button>
          )}
          <h1 className="page-title">{selectedAssignment?.title || 'Coursework & Assignments'}</h1>
          <p className="page-subtitle">
            {selectedAssignment
              ? `${selectedAssignment.subject} · ${selectedAssignment.class} · Due ${selectedAssignment.dueDate}`
              : isTeacher
              ? 'Manage class assignments, view student submissions, and grade uploaded files'
              : 'View coursework, deadlines, and upload your completed assignments'}
          </p>
        </div>
      </div>

      {/* ── Toast Feedback ── */}
      {toast && (
        <div className="assign-toast">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* ==============================================================
          VIEW 1: ASSIGNMENTS GRID (ALL ASSIGNMENTS LIST)
          ============================================================== */}
      {!selectedAssignment && (
        <div className="detail-grid assign-cards-grid">
          {assignments.map((asgn, idx) => (
            <div
              key={asgn.id}
              className="detail-card assignment-card assign-list-card assignment-card-clickable"
              style={{ animationDelay: `${idx * 0.07}s`, cursor: 'pointer' }}
              onClick={() => navigate(`/assignments/${asgn.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/assignments/${asgn.id}`)}
            >
              <div className="assign-card-shimmer" />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span className="badge info">{asgn.subject}</span>
                <span className={`badge ${asgn.status === 'Active' ? 'success' : 'neutral'}`}>{asgn.status}</span>
              </div>

              <h3 style={{ border: 'none', padding: 0, margin: 'var(--space-2) 0 var(--space-3)' }}>
                {asgn.title}
              </h3>

              <div className="detail-row">
                <span className="detail-label">Class</span>
                <span className="detail-value">{asgn.class}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Due Date</span>
                <span className="detail-value" style={{ color: 'var(--error)', fontWeight: 600 }}>
                  {asgn.dueDate}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Submissions</span>
                <span className="detail-value" style={{ fontWeight: 600, color: '#6366f1' }}>
                  {asgn.submissionsCount || '4/6 Submissions'}
                </span>
              </div>

              {/* Action indicator footer */}
              <div className="assign-card-footer-action">
                <span>{isTeacher ? 'View Student Submissions' : 'View & Submit Assignment'}</span>
                <ChevronRight size={15} />
              </div>
            </div>
          ))}

          {/* Empty state */}
          {assignments.length === 0 && !loading && (
            <div className="assign-empty-state">
              <FileText size={40} />
              <p>No coursework assignments found.</p>
            </div>
          )}
        </div>
      )}

      {/* ==============================================================
          VIEW 2: TEACHER SUBMISSIONS PANEL (WHO SUBMITTED ASSIGNMENTS)
          ============================================================== */}
      {selectedAssignment && isTeacher && (
        <div className="teacher-submissions-container">
          {/* Top Quick Stats Row */}
          <div className="submissions-stats-row">
            <div className="sub-stat-card">
              <span className="sub-stat-label">Enrolled Students</span>
              <strong className="sub-stat-number">{totalStudents}</strong>
            </div>
            <div className="sub-stat-card">
              <span className="sub-stat-label">Submitted</span>
              <strong className="sub-stat-number text-success">{submittedCount}</strong>
            </div>
            <div className="sub-stat-card">
              <span className="sub-stat-label">Graded</span>
              <strong className="sub-stat-number text-primary">{gradedCount}</strong>
            </div>
            <div className="sub-stat-card">
              <span className="sub-stat-label">Pending</span>
              <strong className="sub-stat-number text-warning">{pendingCount}</strong>
            </div>
          </div>

          {/* Assignment Description / Instructions Bar */}
          <div className="sub-instructions-banner">
            <div className="sub-instructions-header">
              <BookOpen size={16} className="text-primary" />
              <strong>Assignment Instructions:</strong>
            </div>
            <p className="sub-instructions-text">{selectedAssignment.instructions}</p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="submissions-filter-bar">
            <div className="sub-search-wrap">
              <Search size={15} className="sub-search-icon" />
              <input
                type="text"
                className="sub-search-input"
                placeholder="Search student by name or roll no…"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
              {searchStudent && (
                <button type="button" className="sub-search-clear" onClick={() => setSearchStudent('')}>
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="sub-filter-pills">
              <button
                type="button"
                className={`sub-filter-btn ${submissionFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSubmissionFilter('all')}
              >
                All ({totalStudents})
              </button>
              <button
                type="button"
                className={`sub-filter-btn ${submissionFilter === 'submitted' ? 'active' : ''}`}
                onClick={() => setSubmissionFilter('submitted')}
              >
                Submitted ({submittedCount})
              </button>
              <button
                type="button"
                className={`sub-filter-btn ${submissionFilter === 'graded' ? 'active' : ''}`}
                onClick={() => setSubmissionFilter('graded')}
              >
                Graded ({gradedCount})
              </button>
              <button
                type="button"
                className={`sub-filter-btn ${submissionFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setSubmissionFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
            </div>
          </div>

          {/* Students Submissions List Table */}
          <div className="card sub-table-card">
            <div className="table-responsive">
              <table className="table sub-submissions-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Submitted Time</th>
                    <th>Submitted File</th>
                    <th>Grade / Score</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => {
                    const hasSubmitted = !!sub.submittedAt;
                    return (
                      <tr
                        key={sub.studentId}
                        className={`sub-table-row ${hasSubmitted ? 'clickable-row' : ''}`}
                        onClick={() => hasSubmitted && setSelectedStudentForReview(sub)}
                      >
                        {/* Student Name & Avatar */}
                        <td>
                          <div className="sub-student-cell">
                            <div className="sub-cell-avatar">
                              {sub.avatar ? (
                                <img src={sub.avatar} alt={sub.studentName} />
                              ) : (
                                <span>{sub.studentName.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <strong className="sub-cell-name">{sub.studentName}</strong>
                              <span className="sub-cell-email">{sub.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Roll No */}
                        <td>
                          <span className="badge neutral font-mono">{sub.rollNo}</span>
                        </td>

                        {/* Submission Time */}
                        <td>
                          {hasSubmitted ? (
                            <span className="sub-time-text">
                              <Clock size={13} /> {sub.submittedAt}
                            </span>
                          ) : (
                            <span className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.82rem' }}>
                              Not turned in
                            </span>
                          )}
                        </td>

                        {/* Submitted File Info */}
                        <td>
                          {sub.fileName ? (
                            <div className="sub-file-chip">
                              <FileText size={14} className="text-primary" />
                              <span className="sub-chip-name">{sub.fileName}</span>
                            </div>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        {/* Score */}
                        <td>
                          {sub.score != null ? (
                            <span className="sub-score-badge">
                              {sub.score}/100 <span className="sub-grade-pill">{sub.gradeLetter || 'A'}</span>
                            </span>
                          ) : hasSubmitted ? (
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Pending Grading</span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td>
                          <span
                            className={`badge ${
                              sub.status === 'Graded'
                                ? 'success'
                                : sub.status === 'Submitted'
                                ? 'info'
                                : 'warning'
                            }`}
                          >
                            {sub.status || 'Pending'}
                          </span>
                        </td>

                        {/* Action Button */}
                        <td style={{ textAlign: 'right' }}>
                          {hasSubmitted ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary sub-row-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentForReview(sub);
                              }}
                            >
                              <Eye size={13} /> Review & Open
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline text-muted"
                              disabled
                            >
                              Pending
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                        <AlertCircle size={28} className="text-muted" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No matching submissions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          VIEW 3: STUDENT UPLOAD & SUBMIT VIEW
          ============================================================== */}
      {selectedAssignment && isStudent && (
        <section className="assignment-submit-panel" aria-label="Submit assignment">
          <div className="assignment-submit-header">
            <div>
              <span className="badge info">{selectedAssignment.subject}</span>
              <h2>{selectedAssignment.title}</h2>
              <p>{selectedAssignment.class}</p>
            </div>
            <div className="assignment-dates">
              <span><CalendarDays size={16} /> Starts {selectedAssignment.startDate}</span>
              <span className="assignment-due-date"><CalendarDays size={16} /> Due {selectedAssignment.dueDate}</span>
            </div>
          </div>

          <div style={{ margin: '16px 0', padding: '14px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px' }}>
            <strong style={{ display: 'block', marginBottom: '6px' }}>Instructions:</strong>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{selectedAssignment.instructions}</p>
          </div>

          {studentSubmission && (
            <div className="assignment-uploaded-file">
              <FileText size={20} />
              <div>
                <strong>{studentSubmission.fileName}</strong>
                <span>{studentSubmission.isSubmitted ? 'Submitted successfully ✓' : 'File attached and ready to submit'}</span>
              </div>
            </div>
          )}

          <button
            className={`assignment-dropzone ${studentSubmission ? 'has-file' : ''}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleStudentFile(e.dataTransfer.files[0]);
            }}
          >
            <UploadCloud size={30} />
            <strong>{studentSubmission ? 'Replace uploaded file' : 'Drag and drop your assignment file here'}</strong>
            <span>PDF, DOCX, PNG, JPG, or Code files supported</span>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => handleStudentFile(e.target.files[0])}
            />
          </button>

          <div className="assignment-submit-actions">
            <button
              className="btn btn-primary"
              type="button"
              disabled={!studentSubmission || studentSubmission.isSubmitted}
              onClick={handleStudentSubmit}
            >
              <CheckCircle2 size={16} /> {studentSubmission?.isSubmitted ? 'Submitted ✓' : 'Submit Assignment'}
            </button>
          </div>
        </section>
      )}

      {/* ==============================================================
          STUDENT SUBMISSION DETAIL & GRADING MODAL
          ============================================================== */}
      {selectedStudentForReview && (
        <SubmissionDetailModal
          submission={selectedStudentForReview}
          assignment={selectedAssignment}
          onClose={() => setSelectedStudentForReview(null)}
          onSaveGrade={handleSaveGrade}
        />
      )}
    </DashboardLayout>
  );
};

export default AssignmentPage;
