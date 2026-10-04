import React, { useState, useEffect, useId } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Star, MessageSquare, TrendingUp, Filter, Users, ThumbsUp, ChevronDown } from 'lucide-react';
import { getFeedbacks } from '../../services/api';

/* ═══════════════════════════════════════════════════════════════════
   FEEDBACK RADAR CHART (SVG)
   ═══════════════════════════════════════════════════════════════════ */
const FeedbackRadarChart = ({ categories = [], values = [], height = 280, color = '#6366f1' }) => {
  const uid = useId().replace(/:/g, '');
  const size = Math.min(height, 350);
  const center = size / 2;
  const radius = (size / 2) * 0.65;
  const numAxes = categories.length;
  
  if (numAxes === 0) return <div style={{height}} className="flex items-center justify-center text-gray-500">No data</div>;

  const getPoint = (val, idx, max = 5) => {
    const angle = (Math.PI * 2 * idx) / numAxes - Math.PI / 2;
    const r = (val / max) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const polygonPoints = values.map((v, i) => {
    const pt = getPoint(v, i);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id={`radarGrad_${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        
        {/* Background webs */}
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={categories.map((_, i) => {
              const pt = getPoint(level, i, 5);
              return `${pt.x},${pt.y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(150,160,180,0.15)"
            strokeWidth="1"
            strokeDasharray={level === 5 ? "0" : "4 4"}
          />
        ))}

        {/* Axes */}
        {categories.map((_, i) => {
          const endPt = getPoint(5, i, 5);
          return (
            <line key={i} x1={center} y1={center} x2={endPt.x} y2={endPt.y} stroke="rgba(150,160,180,0.2)" strokeWidth="1" />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill={`url(#radarGrad_${uid})`}
          stroke={color}
          strokeWidth="2"
          style={{ transition: 'all 0.5s ease' }}
        />

        {/* Data points */}
        {values.map((v, i) => {
          const pt = getPoint(v, i);
          return <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2" />;
        })}

        {/* Labels */}
        {categories.map((cat, i) => {
          const pt = getPoint(5.8, i, 5); // push labels out further
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-secondary)"
              fontSize="11"
              fontWeight="500"
            >
              {cat}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Departments');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getFeedbacks();
        const items = res.feedbacks || (Array.isArray(res) ? res : []);
        setFeedbacks(items);
      } catch (err) {
        console.error("Failed to load feedback", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFeedbacks = filter === 'All Departments' 
    ? feedbacks 
    : feedbacks.filter(f => f.department === filter);

  // Analytics Calculations
  const totalSubmissions = filteredFeedbacks.length;
  
  let avgOverall = 0, avgTeaching = 0, avgSupport = 0, avgUsability = 0, avgFacilities = 0, avgPlacement = 0;
  let positiveCount = 0;

  if (totalSubmissions > 0) {
    const sum = filteredFeedbacks.reduce((acc, f) => {
      const r = f.ratings || {};
      acc.overall += (r.overall || 0);
      acc.teaching += (r.teaching || 0);
      acc.support += (r.support || 0);
      acc.usability += (r.usability || 0);
      acc.facilities += (r.facilities || 0);
      acc.placement += (r.placement || 0);
      if (f.wouldRecommend === 'Yes') acc.recommends++;
      return acc;
    }, { overall: 0, teaching: 0, support: 0, usability: 0, facilities: 0, placement: 0, recommends: 0 });

    avgOverall = (sum.overall / totalSubmissions).toFixed(1);
    avgTeaching = (sum.teaching / totalSubmissions).toFixed(1);
    avgSupport = (sum.support / totalSubmissions).toFixed(1);
    avgUsability = (sum.usability / totalSubmissions).toFixed(1);
    avgFacilities = (sum.facilities / totalSubmissions).toFixed(1);
    avgPlacement = (sum.placement / totalSubmissions).toFixed(1);
    positiveCount = sum.recommends;
  }

  const recommendationRate = totalSubmissions > 0 ? Math.round((positiveCount / totalSubmissions) * 100) : 0;

  const radarCategories = ['Teaching', 'Support', 'Usability', 'Facilities', 'Placement', 'Overall'];
  const radarValues = [avgTeaching, avgSupport, avgUsability, avgFacilities, avgPlacement, avgOverall].map(Number);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Feedback Analytics</h1>
          <p className="page-subtitle">Analyze satisfaction and improvement suggestions</p>
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="glass-select border-none shadow-sm rounded-lg py-2 px-4 font-medium"
        >
          <option>All Departments</option>
          <option>Computer Science</option>
          <option>Engineering</option>
          <option>Business</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><div className="spinner"></div></div>
      ) : totalSubmissions === 0 ? (
        <div className="dashboard-card glass-card text-center p-12">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No Feedback Yet</h2>
          <p className="text-[var(--text-tertiary)]">Students haven't submitted any feedback for this filter.</p>
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="stats-grid mb-6">
            <div className="stat-card glass-card">
              <div className="stat-card-top p-5">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  <MessageSquare size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Total Submissions</span>
                  <div className="stat-value">{totalSubmissions}</div>
                </div>
              </div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-card-top p-5">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                  <Star size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Avg. Overall Rating</span>
                  <div className="stat-value">{avgOverall} <span className="text-sm font-normal text-[var(--text-tertiary)]">/ 5.0</span></div>
                </div>
              </div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-card-top p-5">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                  <ThumbsUp size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Recommendation Rate</span>
                  <div className="stat-value">{recommendationRate}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Radar Chart */}
            <div className="dashboard-card glass-card lg:col-span-1">
              <div className="dashboard-card-header mb-2">
                <h2>Category Averages</h2>
              </div>
              <FeedbackRadarChart categories={radarCategories} values={radarValues} color="#06b6d4" />
            </div>

            {/* Recent Suggestions */}
            <div className="dashboard-card glass-card lg:col-span-2">
              <div className="dashboard-card-header mb-4 border-b border-[rgba(150,160,180,0.1)] pb-3">
                <h2>Recent Suggestions & Improvements</h2>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {feedbacks.filter(f => f.improvements || f.suggestions).slice(0, 5).map((f, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[rgba(150,160,180,0.03)] border border-[rgba(150,160,180,0.08)]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-md">
                        {f.department}
                      </span>
                      <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                        <Star size={12} fill="currentColor" /> {f.ratings?.overall}/5
                      </div>
                    </div>
                    {f.improvements && (
                      <p className="text-sm mb-2 text-[var(--text-primary)]"><span className="font-semibold text-[var(--text-secondary)]">To Improve:</span> {f.improvements}</p>
                    )}
                    {f.suggestions && (
                      <p className="text-sm text-[var(--text-primary)]"><span className="font-semibold text-[var(--text-secondary)]">Suggestion:</span> {f.suggestions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Feedback Table */}
          <div className="dashboard-card glass-card">
            <div className="dashboard-card-header mb-4">
              <h2>Recent Feedback Log</h2>
            </div>
            <div className="table-responsive">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-semibold pb-3 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)]">Student</th>
                    <th className="text-left font-semibold pb-3 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)]">Department</th>
                    <th className="text-left font-semibold pb-3 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)]">Overall</th>
                    <th className="text-left font-semibold pb-3 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)]">Teaching</th>
                    <th className="text-left font-semibold pb-3 text-[var(--text-secondary)] border-b border-[rgba(150,160,180,0.1)]">Recommends</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedbacks.slice(0, 10).map((f, i) => (
                    <tr key={i} className="border-b border-[rgba(150,160,180,0.05)] hover:bg-[rgba(150,160,180,0.02)]">
                      <td className="py-3 font-medium">{f.studentName}</td>
                      <td className="py-3 text-[var(--text-secondary)]">{f.department}</td>
                      <td className="py-3">
                        <div className="flex items-center text-amber-500 font-bold gap-1">
                          <Star size={14} fill="currentColor" /> {f.ratings?.overall}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center text-amber-500 font-bold gap-1">
                          <Star size={14} fill="currentColor" /> {f.ratings?.teaching}
                        </div>
                      </td>
                      <td className="py-3">
                        {f.wouldRecommend === 'Yes' 
                          ? <span className="badge success text-xs">Yes</span> 
                          : <span className="badge danger text-xs">No</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default FeedbackDashboard;
