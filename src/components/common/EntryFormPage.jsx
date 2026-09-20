import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';

const EntryFormPage = ({ title, subtitle, returnPath, submitLabel, fields }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => Object.fromEntries(fields.map((field) => [field.name, ''])));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`${title} saved successfully!`);
    navigate(returnPath);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(returnPath)}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              {fields.map((field) => (
                <div className={`form-group ${field.fullWidth ? 'full-width' : ''}`} key={field.name}>
                  <label htmlFor={field.name}>{field.label}{field.required ? ' *' : ''}</label>
                  {field.type === 'textarea' ? (
                    <textarea id={field.name} name={field.name} className="form-input" rows="4" placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} required={field.required} />
                  ) : (
                    <input id={field.name} type={field.type || 'text'} name={field.name} className="form-input" placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} required={field.required} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(returnPath)}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EntryFormPage;