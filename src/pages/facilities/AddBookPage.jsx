import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createLibraryBook } from '../../services/api';

const AddBookPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: 'textbook',
    totalCopies: 1,
    shelfLocation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createLibraryBook({
        ...formData,
        totalCopies: Number(formData.totalCopies),
        availableCopies: Number(formData.totalCopies),
      });
      showToast('Book added successfully!', 'success');
      navigate('/library');
    } catch (err) {
      showToast(err.message || 'Failed to add book. Using offline mode.', 'error');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/library')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Add New Book</h1>
          <p className="page-subtitle">Add a book to the library catalog</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Book Title *</label>
                <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input type="text" name="author" className="form-input" value={formData.author} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input type="text" name="isbn" className="form-input" value={formData.isbn} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Publisher</label>
                <input type="text" name="publisher" className="form-input" value={formData.publisher} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" className="form-input" value={formData.category} onChange={handleChange} required>
                  <option value="textbook">Textbook</option>
                  <option value="reference">Reference</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="magazine">Magazine</option>
                  <option value="journal">Journal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Total Copies *</label>
                <input type="number" name="totalCopies" className="form-input" value={formData.totalCopies} onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label>Shelf Location</label>
                <input type="text" name="shelfLocation" className="form-input" value={formData.shelfLocation} onChange={handleChange} placeholder="e.g. A-12" />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/library')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBookPage;
