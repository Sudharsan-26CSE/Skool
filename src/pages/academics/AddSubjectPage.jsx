import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createSubject } from '../../services/api';

const AddSubjectPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjectName: '',
    code: '',
    category: 'Core Academic',
    credits: 4,
    grade: 'Grade 9', // Specific class grade
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createSubject({
        name: formData.subjectName,
        code: formData.code,
        category: formData.category,
        credits: parseInt(formData.credits, 10),
        // we can store grade as a class mapping in a real setup, but for now we'll just send it if the backend supports it, or use description field
        description: `Grade: ${formData.grade}`, 
      });
      showToast('Subject created successfully!', 'success');
      navigate('/subjects');
    } catch (err) {
      showToast(err.message || 'Failed to create subject. Using offline mode.', 'error');
      navigate('/subjects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/subjects')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Add New Subject</h1>
          <p className="page-subtitle">Add a subject to the academic curriculum</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Subject Name *</label>
                <input type="text" name="subjectName" className="form-input" placeholder="e.g. Mathematics" value={formData.subjectName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Subject Code *</label>
                <input type="text" name="code" className="form-input" placeholder="e.g. SUB-106" value={formData.code} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" className="form-input" value={formData.category} onChange={handleChange} required>
                  <option value="Core Academic">Core Academic</option>
                  <option value="Science">Science</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Academic Credits *</label>
                <input type="number" name="credits" className="form-input" placeholder="e.g. 4" value={formData.credits} onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Specific Class [Grade] *</label>
                <select name="grade" className="form-input" value={formData.grade} onChange={handleChange} required>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/subjects')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Subject'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddSubjectPage;
