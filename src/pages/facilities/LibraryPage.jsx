import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Library, Plus, Search } from 'lucide-react';

const LibraryPage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isStudent = role === 'student';

  const books = [
    { isbn: '978-0131103627', title: 'The C Programming Language', author: 'Brian W. Kernighan', Copies: '12', Available: '8', Category: 'Computer Science' },
    { isbn: '978-0451524935', title: '1984', author: 'George Orwell', Copies: '25', Available: '19', Category: 'Literature' },
    { isbn: '978-0133570533', title: 'University Physics with Modern Physics', author: 'Hugh D. Young', Copies: '15', Available: '3', Category: 'Science' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isStudent ? 'Library Books' : 'Library Management'}</h1>
          <p className="page-subtitle">{isStudent ? 'Browse catalog of available books and digital media' : 'Catalog of books, digital media, and member borrowing records'}</p>
        </div>
        {!isStudent && (
          <button className="btn btn-primary">
            <Plus size={16} /> Add Book to Catalog
          </button>
        )}
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Total Copies</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.isbn}>
                <td><strong>{b.isbn}</strong></td>
                <td><strong>{b.title}</strong></td>
                <td>{b.author}</td>
                <td><span className="badge neutral">{b.Category}</span></td>
                <td>{b.Copies}</td>
                <td><span className="badge success">{b.Available} Left</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default LibraryPage;
