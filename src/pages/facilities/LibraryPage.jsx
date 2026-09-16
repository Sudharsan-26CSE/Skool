import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Library, Plus, Search, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getLibraryBooks, deleteLibraryBook } from '../../services/api';

const LibraryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isStudent = role === 'student';
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getLibraryBooks();
      setBooks(data.libraryBooks || []);
    } catch (err) {
      showToast('Failed to load books. Using offline mode.', 'warning');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteLibraryBook(id);
      showToast('Book deleted successfully', 'success');
      fetchBooks();
    } catch (err) {
      showToast(err.message || 'Failed to delete book', 'error');
    }
  };

  const fallbackBooks = [
    { _id: '1', isbn: '978-0131103627', title: 'The C Programming Language', author: 'Brian W. Kernighan', totalCopies: 12, availableCopies: 8, category: 'Computer Science' },
    { _id: '2', isbn: '978-0451524935', title: '1984', author: 'George Orwell', totalCopies: 25, availableCopies: 19, category: 'Literature' },
    { _id: '3', isbn: '978-0133570533', title: 'University Physics with Modern Physics', author: 'Hugh D. Young', totalCopies: 15, availableCopies: 3, category: 'Science' },
  ];

  const displayBooks = books.length > 0 ? books : fallbackBooks;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isStudent ? 'Library Books' : 'Library Management'}</h1>
          <p className="page-subtitle">{isStudent ? 'Browse catalog of available books and digital media' : 'Catalog of books, digital media, and member borrowing records'}</p>
        </div>
        {!isStudent && isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/library/add')}>
            <Plus size={16} /> Add Book to Catalog
          </button>
        )}
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading catalog...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total Copies</th>
                <th>Available</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayBooks.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center' }}>No books found in catalog</td></tr>
              ) : displayBooks.map((b) => (
                <tr key={b._id}>
                  <td><strong>{b.isbn || 'N/A'}</strong></td>
                  <td><strong>{b.title}</strong></td>
                  <td>{b.author}</td>
                  <td style={{ textTransform: 'capitalize' }}><span className="badge neutral">{b.category}</span></td>
                  <td>{b.totalCopies}</td>
                  <td><span className="badge success">{b.availableCopies} Left</span></td>
                  {isAdmin && (
                    <td>
                      <button className="icon-btn danger" onClick={() => handleDelete(b._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LibraryPage;
