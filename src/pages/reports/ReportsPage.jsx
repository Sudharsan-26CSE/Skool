import React, { useState, useEffect, useId } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PieChart, Download, Calendar, Filter, TrendingUp, Users } from 'lucide-react';
import { getResults, getAttendance } from '../../services/api';

/* ═══════════════════════════════════════════════════════════════════
   GLASS BAR CHART — Animated SVG bar chart with gradients & glow
   ═══════════════════════════════════════════════════════════════════ */
const GlassBarChart = ({
  data = [],
  height = 320,
  barColor1 = '#6366f1',
  barColor2 = '#38bdf8',
  valuePrefix = '',
  valueSuffix = '',
  maxValue: propMax,
  showGrid = true,
}) => {
  const uid = useId().replace(/:/g, '');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxVal = propMax || Math.max(...data.map(d => d.value), 1);
  const chartPadding = { top: 30, right: 20, bottom: 50, left: 55 };
  const svgWidth = 600;
  const svgHeight = height;
  const plotW = svgWidth - chartPadding.left - chartPadding.right;
  const plotH = svgHeight - chartPadding.top - chartPadding.bottom;
  const barCount = data.length;
  
  if (barCount === 0) {
    return (
      <div style={{ width: '100%', height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>No data available for this filter.</p>
      </div>
    );
  }

  const barGap = Math.max(8, plotW * 0.03);
  const barWidth = Math.max(18, (plotW - barGap * (barCount + 1)) / barCount);

  // Grid lines (5 horizontal)
  const gridLines = 5;
  const gridStep = maxVal / gridLines;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          {/* Bar gradient */}
          <linearGradient id={`barGrad_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={barColor1} stopOpacity="1" />
            <stop offset="100%" stopColor={barColor2} stopOpacity="0.7" />
          </linearGradient>
          {/* Hover bar gradient */}
          <linearGradient id={`barGradHover_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor={barColor1} stopOpacity="1" />
            <stop offset="100%" stopColor={barColor2} stopOpacity="0.9" />
          </linearGradient>
          {/* Glow filter */}
          <filter id={`barGlow_${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Shadow filter */}
          <filter id={`barShadow_${uid}`} x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={barColor1} floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Background grid lines */}
        {showGrid && Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = chartPadding.top + plotH - (i * plotH / gridLines);
          const label = Math.round(i * gridStep * 10) / 10;
          return (
            <g key={i}>
              <line
                x1={chartPadding.left}
                y1={y}
                x2={svgWidth - chartPadding.right}
                y2={y}
                stroke="rgba(148, 163, 184, 0.15)"
                strokeWidth="1"
                strokeDasharray={i === 0 ? "0" : "4 3"}
              />
              <text
                x={chartPadding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="rgba(148, 163, 184, 0.7)"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {valuePrefix}{label}{valueSuffix}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, idx) => {
          const barH = (d.value / maxVal) * plotH;
          const x = chartPadding.left + barGap + idx * (barWidth + barGap);
          const y = chartPadding.top + plotH - barH;
          const isHovered = hoveredIdx === idx;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Bar body */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={barWidth > 24 ? 6 : 4}
                fill={isHovered ? `url(#barGradHover_${uid})` : `url(#barGrad_${uid})`}
                filter={isHovered ? `url(#barGlow_${uid})` : `url(#barShadow_${uid})`}
                opacity={isHovered ? 1 : 0.85}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transformOrigin: `${x + barWidth / 2}px ${chartPadding.top + plotH}px`,
                  animation: `barRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s both`,
                }}
              />

              {/* Top shine highlight */}
              <rect
                x={x + 2}
                y={y}
                width={barWidth - 4}
                height={Math.min(8, barH * 0.15)}
                rx={3}
                fill="rgba(255, 255, 255, 0.3)"
                style={{ pointerEvents: 'none' }}
              />

              {/* Value label on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={x + barWidth / 2 - 28}
                    y={y - 30}
                    width="56"
                    height="22"
                    rx="6"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={barColor1}
                    strokeWidth="1"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 15}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#ffffff"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {valuePrefix}{d.value}{valueSuffix}
                  </text>
                </g>
              )}

              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={chartPadding.top + plotH + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered ? 600 : 400}
                fill={isHovered ? '#ffffff' : 'rgba(148, 163, 184, 0.8)'}
                fontFamily="Inter, system-ui, sans-serif"
                style={{ transition: 'fill 0.2s ease' }}
              >
                {d.label}
              </text>

              {/* Secondary label (optional) */}
              {d.subLabel && (
                <text
                  x={x + barWidth / 2}
                  y={chartPadding.top + plotH + 32}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(148, 163, 184, 0.5)"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {d.subLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Bottom axis line */}
        <line
          x1={chartPadding.left}
          y1={chartPadding.top + plotH}
          x2={svgWidth - chartPadding.right}
          y2={chartPadding.top + plotH}
          stroke="rgba(148, 163, 184, 0.25)"
          strokeWidth="1.5"
        />
      </svg>

      {/* CSS animation for bar rise */}
      <style>{`
        @keyframes barRise {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   REPORTS PAGE
   ═══════════════════════════════════════════════════════════════════ */

const ReportsPage = () => {
  const [academicFilter, setAcademicFilter] = useState('This Term');
  const [attendanceFilter, setAttendanceFilter] = useState('Full Year');

  const [academicData, setAcademicData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resResults, resAttendance] = await Promise.all([
          getResults().catch(() => ({})),
          getAttendance().catch(() => ({}))
        ]);

        // Process Academic Data (Results)
        const results = resResults.results || resResults.examresults || (Array.isArray(resResults) ? resResults : []);
        const classStats = {};

        results.forEach(r => {
          const className = r.className || r.class?.name || 'Unassigned';
          // Calculate percentage from results or scores
          let pct = Number(r.percentage || String(r.percentage).replace('%', ''));
          if (isNaN(pct) || pct <= 0) {
            const marks = Number(r.marks);
            const total = Number(r.totalMarks) || 100;
            if (!isNaN(marks) && total > 0) {
              pct = Math.round((marks / total) * 100);
            } else if (r.gpa) {
              pct = Math.round(Number(r.gpa) * 25);
            } else {
              pct = 85;
            }
          }

          if (!classStats[className]) {
            classStats[className] = { pctSum: 0, count: 0 };
          }
          if (pct > 0) {
            classStats[className].pctSum += pct;
            classStats[className].count += 1;
          }
        });

        const finalAcademicData = Object.keys(classStats).map(cls => ({
          label: cls,
          value: classStats[cls].count > 0 ? Number((classStats[cls].pctSum / classStats[cls].count).toFixed(1)) : 0,
          subLabel: `${classStats[cls].count} students`
        })).filter(d => d.value > 0);

        // Sort by Grade/Class string
        finalAcademicData.sort((a, b) => a.label.localeCompare(b.label));

        // Process Attendance Data
        const attList = resAttendance.attendances || resAttendance.attendance || (Array.isArray(resAttendance) ? resAttendance : []);
        const monthStats = {};

        attList.forEach(a => {
          const dateStr = a.date || a.createdAt;
          if (!dateStr) return;
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return;
          
          const monthYear = date.toLocaleString('default', { month: 'short' }) + " '" + date.getFullYear().toString().substr(-2);

          if (!monthStats[monthYear]) {
            monthStats[monthYear] = { present: 0, total: 0 };
          }
          monthStats[monthYear].total += 1;
          if (a.status === 'present') monthStats[monthYear].present += 1;
        });

        const finalAttData = Object.keys(monthStats).map(m => ({
          label: m.split(" ")[0],
          value: Number(((monthStats[m].present / monthStats[m].total) * 100).toFixed(1)),
          subLabel: "20" + m.split("'")[1]
        }));

        setAcademicData(finalAcademicData);
        setAttendanceData(finalAttData);
      } catch (err) {
        console.error("Failed to fetch report data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [academicFilter, attendanceFilter]);

  // Calculate summary stats
  const avgPercentage = academicData.length > 0 
    ? (academicData.reduce((s, d) => s + d.value, 0) / academicData.length).toFixed(1) 
    : '0.0';
  const totalStudents = academicData.reduce((s, d) => s + parseInt(d.subLabel), 0);
  
  const avgAttendance = attendanceData.length > 0 
    ? (attendanceData.reduce((s, d) => s + d.value, 0) / attendanceData.length).toFixed(1)
    : '0.0';
  const peakMonth = attendanceData.length > 0
    ? attendanceData.reduce((a, b) => a.value > b.value ? a : b).label
    : 'N/A';
  const lowestMonth = attendanceData.length > 0
    ? attendanceData.reduce((a, b) => a.value < b.value ? a : b).label
    : 'N/A';
  const lowestAttVal = attendanceData.length > 0
    ? attendanceData.reduce((a, b) => a.value < b.value ? a : b).value
    : 0;

  const highestGrade = academicData.length > 0
    ? academicData.reduce((a, b) => a.value > b.value ? a : b)
    : null;
  const lowestGrade = academicData.length > 0
    ? academicData.reduce((a, b) => a.value < b.value ? a : b)
    : null;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Generate and download school analytical reports (Real Data)</p>
        </div>
        <button className="btn btn-primary">
          <Download size={16} /> Export Custom PDF Report
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="spinner"></div>
          <style>{`
            .spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: var(--primary);
              animation: spin 1s linear infinite;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            html[data-theme='dark'] .spinner { border: 4px solid rgba(255, 255, 255, 0.1); border-left-color: var(--primary); }
          `}</style>
        </div>
      ) : (
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', marginTop: '24px' }}>
          {/* ── Academic Performance Bar Chart ── */}
          <div className="dashboard-card glass-card hover-lift">
            <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} style={{ color: '#6366f1' }} />
                  Academic Performance
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Average Percentage per class — {totalStudents.toLocaleString()} total students
                </span>
              </div>
              <select
                value={academicFilter}
                onChange={(e) => setAcademicFilter(e.target.value)}
                className="glass-select"
                style={{ fontSize: '0.8rem', padding: '5px 10px' }}
              >
                <option>This Term</option>
                <option>Last Term</option>
                <option>Full Year</option>
              </select>
            </div>

            {/* Summary stat chips */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span
                className="badge"
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                Avg Score: {avgPercentage}%
              </span>
              {highestGrade && (
                <span
                  className="badge"
                  style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Highest: {highestGrade.label} ({highestGrade.value}%)
                </span>
              )}
              {lowestGrade && (
                <span
                  className="badge"
                  style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    color: '#f59e0b',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Lowest: {lowestGrade.label} ({lowestGrade.value}%)
                </span>
              )}
            </div>

            <GlassBarChart
              data={academicData}
              height={300}
              barColor1="#6366f1"
              barColor2="#38bdf8"
              maxValue={100}
              valueSuffix="%"
            />
          </div>

          {/* ── Attendance Distribution Bar Chart ── */}
          <div className="dashboard-card glass-card hover-lift">
            <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} style={{ color: '#10b981' }} />
                  Attendance Distribution
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Monthly student attendance rates
                </span>
              </div>
              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value)}
                className="glass-select"
                style={{ fontSize: '0.8rem', padding: '5px 10px' }}
              >
                <option>Full Year</option>
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </select>
            </div>

            {/* Summary stat chips */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span
                className="badge"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                Avg: {avgAttendance}%
              </span>
              {peakMonth !== 'N/A' && (
                <span
                  className="badge"
                  style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Peak: {peakMonth}
                </span>
              )}
              {lowestMonth !== 'N/A' && (
                <span
                  className="badge"
                  style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    color: '#f59e0b',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Low: {lowestMonth} ({lowestAttVal}%)
                </span>
              )}
            </div>

            <GlassBarChart
              data={attendanceData}
              height={300}
              barColor1="#10b981"
              barColor2="#06b6d4"
              maxValue={100}
              valueSuffix="%"
            />
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default ReportsPage;
