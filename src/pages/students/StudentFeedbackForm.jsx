import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Star, MessageSquare, Send, User, BookOpen } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createFeedback, getMe } from '../../services/api';

const StarRating = ({ value, onChange, label }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label} <span className="text-red-500">*</span></label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-2 rounded-full transition-all duration-300 ${value >= star ? 'text-amber-400 scale-110' : 'text-gray-400 hover:text-amber-200'}`}
          >
            <Star size={28} fill={value >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
};

const StudentFeedbackForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    department: '',
    semester: '1st Semester',
    ratings: {
      overall: 0,
      teaching: 0,
      support: 0,
      usability: 0,
      facilities: 0,
      placement: 0,
    },
    likes: '',
    improvements: '',
    suggestions: '',
    wouldRecommend: 'Yes'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const email = localStorage.getItem('preskool-email') || '';
        const res = await getMe(email);
        if (res && res.user) {
          setFormData(prev => ({
            ...prev,
            studentName: res.user.name || '',
            studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value }
    }));
  };

  const validateForm = () => {
    const { ratings } = formData;
    if (Object.values(ratings).some(val => val === 0)) {
      return false;
    }
    if (!formData.studentName || !formData.studentId || !formData.department) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please provide all ratings and required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await createFeedback(formData);
      setSubmitted(true);
      showToast('Feedback submitted successfully. Thank you!', 'success');
    } catch (err) {
      showToast('Failed to submit feedback. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <Star size={48} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Feedback!</h1>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md">
            Your insights help us improve the Skool ERP experience and provide better facilities for everyone.
          </p>
          <button onClick={() => navigate('/dashboard/student')} className="btn btn-primary px-8 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Feedback</h1>
          <p className="page-subtitle">Help us improve your academic experience</p>
        </div>
      </div>

      {fetching ? (
        <div className="flex justify-center p-10"><div className="spinner"></div></div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-4xl mx-auto">
          {/* Section 1: Basic Info */}
          <div className="dashboard-card glass-card mb-6">
            <div className="dashboard-card-header mb-4 border-b border-[rgba(150,160,180,0.1)] pb-4">
              <h2><User size={18} className="mr-2 inline-block text-indigo-500" /> Student Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} className="form-control glass-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Student ID <span className="text-red-500">*</span></label>
                <input type="text" value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="form-control glass-input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course / Department <span className="text-red-500">*</span></label>
                <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="form-control glass-input" placeholder="e.g. Computer Science" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester <span className="text-red-500">*</span></label>
                <select value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} className="form-control glass-input">
                  <option>1st Semester</option><option>2nd Semester</option><option>3rd Semester</option>
                  <option>4th Semester</option><option>5th Semester</option><option>6th Semester</option>
                  <option>7th Semester</option><option>8th Semester</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Ratings */}
          <div className="dashboard-card glass-card mb-6">
            <div className="dashboard-card-header mb-6 border-b border-[rgba(150,160,180,0.1)] pb-4">
              <h2><Star size={18} className="mr-2 inline-block text-amber-500" /> Satisfaction Ratings</h2>
              <span className="text-xs text-[var(--text-tertiary)] ml-auto">1 = Poor, 5 = Excellent</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pl-4">
              <StarRating label="Overall Satisfaction" value={formData.ratings.overall} onChange={(v) => handleRatingChange('overall', v)} />
              <StarRating label="Teaching Quality" value={formData.ratings.teaching} onChange={(v) => handleRatingChange('teaching', v)} />
              <StarRating label="Faculty Support" value={formData.ratings.support} onChange={(v) => handleRatingChange('support', v)} />
              <StarRating label="Website/ERP Usability" value={formData.ratings.usability} onChange={(v) => handleRatingChange('usability', v)} />
              <StarRating label="Campus Facilities" value={formData.ratings.facilities} onChange={(v) => handleRatingChange('facilities', v)} />
              <StarRating label="Placement Support" value={formData.ratings.placement} onChange={(v) => handleRatingChange('placement', v)} />
            </div>
          </div>

          {/* Section 3: Detailed Written Feedback */}
          <div className="dashboard-card glass-card mb-6">
            <div className="dashboard-card-header mb-4 border-b border-[rgba(150,160,180,0.1)] pb-4">
              <h2><MessageSquare size={18} className="mr-2 inline-block text-emerald-500" /> Detailed Feedback</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">What do you like about the institution?</label>
                <textarea value={formData.likes} onChange={(e) => setFormData({...formData, likes: e.target.value})} className="form-control glass-input h-24" placeholder="Your positive experiences..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What can be improved?</label>
                <textarea value={formData.improvements} onChange={(e) => setFormData({...formData, improvements: e.target.value})} className="form-control glass-input h-24" placeholder="Areas needing attention..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Any additional suggestions?</label>
                <textarea value={formData.suggestions} onChange={(e) => setFormData({...formData, suggestions: e.target.value})} className="form-control glass-input h-20" placeholder="Other thoughts..."></textarea>
              </div>
              
              <div className="pt-4 border-t border-[rgba(150,160,180,0.1)]">
                <label className="block text-sm font-medium mb-3">Would you recommend this institution to others?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-[rgba(150,160,180,0.2)] rounded-xl hover:bg-[rgba(150,160,180,0.05)] transition-colors">
                    <input type="radio" name="recommend" value="Yes" checked={formData.wouldRecommend === 'Yes'} onChange={(e) => setFormData({...formData, wouldRecommend: e.target.value})} className="accent-indigo-500" />
                    <span className="font-medium text-sm">Yes, absolutely</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-[rgba(150,160,180,0.2)] rounded-xl hover:bg-[rgba(150,160,180,0.05)] transition-colors">
                    <input type="radio" name="recommend" value="No" checked={formData.wouldRecommend === 'No'} onChange={(e) => setFormData({...formData, wouldRecommend: e.target.value})} className="accent-indigo-500" />
                    <span className="font-medium text-sm">No, I would not</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mb-10">
            <button type="submit" disabled={loading} className="btn btn-primary shadow-lg hover:shadow-indigo-500/40 px-8 py-3 text-[0.95rem]">
              {loading ? <span className="spinner mr-2" style={{width:'18px', height:'18px', borderWidth:'2px'}}></span> : <Send size={18} className="mr-2" />}
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default StudentFeedbackForm;
