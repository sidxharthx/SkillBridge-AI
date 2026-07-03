import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import { PageLoader } from '../components/Loader';
import SkillTags from '../components/SkillTags';
import ScoreRing from '../components/ScoreRing';
import './History.css';

/* ── Score Trend Chart (pure SVG) ──────────────────── */
function ScoreTrendChart({ analyses }) {
  if (!analyses || analyses.length < 2) return null;

  // Sort by date ascending for the chart
  const sorted = [...analyses]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-10); // Last 10 analyses

  const scores = sorted.map((a) => a.matchScore);
  const dates = sorted.map((a) =>
    new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const maxScore = Math.max(...scores, 100);
  const minScore = Math.min(...scores, 0);
  const range = maxScore - minScore || 1;

  const W = 600;
  const H = 200;
  const padX = 50;
  const padY = 30;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const points = scores.map((score, i) => ({
    x: padX + (i / (scores.length - 1)) * chartW,
    y: padY + chartH - ((score - minScore) / range) * chartH,
    score,
    date: dates[i],
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

  // Score improvement
  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const improvement = lastScore - firstScore;

  return (
    <div className="card trend-chart-card">
      <div className="trend-chart-header">
        <div>
          <h3 className="heading-4">Score Progression</h3>
          <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
            Track how your match scores improve over time
          </p>
        </div>
        <div className="trend-summary">
          <span className={`trend-badge ${improvement >= 0 ? 'trend-up' : 'trend-down'}`}>
            {improvement >= 0 ? '↑' : '↓'} {Math.abs(improvement)} pts
          </span>
          <span className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
            across {sorted.length} analyses
          </span>
        </div>
      </div>

      <div className="trend-chart-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="trend-svg" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = padY + chartH - ((val - minScore) / range) * chartH;
            if (y < padY || y > padY + chartH) return null;
            return (
              <g key={val}>
                <line x1={padX} y1={y} x2={padX + chartW} y2={y} className="grid-line" />
                <text x={padX - 8} y={y + 4} className="axis-label" textAnchor="end">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} className="trend-area" />

          {/* Line */}
          <path d={pathD} className="trend-line" />

          {/* Dots & labels */}
          {points.map((p, i) => (
            <g key={i} className="trend-point-group">
              <circle cx={p.x} cy={p.y} r={5} className="trend-dot" />
              <circle cx={p.x} cy={p.y} r={8} className="trend-dot-pulse" />
              <text x={p.x} y={p.y - 12} className="score-label" textAnchor="middle">
                {p.score}
              </text>
              <text x={p.x} y={padY + chartH + 18} className="date-label" textAnchor="middle">
                {p.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ── History Page ──────────────────────────────────── */
export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analysisAPI.getAll();
        setAnalyses(res.data);
      } catch (err) { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  const loadDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await analysisAPI.getOne(id);
      setSelected(res.data);
    } catch (err) { /* ignore */ }
    setDetailLoading(false);
  };

  if (loading) return <PageLoader text="Loading history..." />;

  return (
    <div className="history-page container" id="history-page">
      <div className="page-header">
        <h1 className="heading-2">Analysis History</h1>
        <p className="text-secondary">View all your previous JD analyses and track how your scores improve over time.</p>
      </div>

      {analyses.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">↻</div>
          <h3 className="empty-state-title">No analyses yet</h3>
          <p className="empty-state-text">Run your first JD analysis to see results here.</p>
          <Link to="/analyze" className="btn btn-primary">Analyze a JD</Link>
        </div>
      ) : (
        <>
          {/* Score Trend Chart */}
          <ScoreTrendChart analyses={analyses} />

          {/* Stats Summary */}
          <div className="history-stats">
            <div className="card stat-mini">
              <span className="stat-mini-label">Total Analyses</span>
              <span className="stat-mini-value">{analyses.length}</span>
            </div>
            <div className="card stat-mini">
              <span className="stat-mini-label">Highest Score</span>
              <span className="stat-mini-value stat-mini-success">
                {Math.max(...analyses.map((a) => a.matchScore))}
              </span>
            </div>
            <div className="card stat-mini">
              <span className="stat-mini-label">Average Score</span>
              <span className="stat-mini-value">
                {Math.round(analyses.reduce((s, a) => s + a.matchScore, 0) / analyses.length)}
              </span>
            </div>
            <div className="card stat-mini">
              <span className="stat-mini-label">Latest Score</span>
              <span className="stat-mini-value stat-mini-accent">
                {analyses[0]?.matchScore || '—'}
              </span>
            </div>
          </div>

          {/* List + Detail */}
          <div className="history-layout">
            <div className="history-list">
              {analyses.map((a) => (
                <div
                  key={a._id}
                  className={`history-item card card-hover ${selected?._id === a._id ? 'history-item-active' : ''}`}
                  onClick={() => loadDetail(a._id)}
                >
                  <div className="history-item-top">
                    <span className="history-item-title">{a.jobTitle || 'Untitled Analysis'}</span>
                    <span className="history-item-score">{a.matchScore}</span>
                  </div>
                  <div className="history-item-meta">
                    <span className="text-tertiary">{a.resumeId?.fileName || 'Resume'}</span>
                    <span className="text-tertiary">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="history-detail">
              {detailLoading && <PageLoader text="Loading details..." />}

              {selected && !detailLoading && (
                <>
                  <div className="card">
                    <div className="analyze-score-top">
                      <ScoreRing score={selected.matchScore} />
                      <div>
                        <h3 className="heading-3">{selected.jobTitle || 'Analysis Detail'}</h3>
                        <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                          {new Date(selected.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h4 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>Matched Skills</h4>
                    <SkillTags skills={selected.matchedSkills} variant="success" />
                  </div>

                  <div className="card">
                    <h4 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>Missing Skills</h4>
                    <SkillTags skills={selected.missingSkills} variant="danger" />
                  </div>

                  {selected.aiSummary && (
                    <div className="card">
                      <h4 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>AI Summary</h4>
                      <div className="ai-summary-text">
                        {selected.aiSummary.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!selected && !detailLoading && (
                <div className="card empty-state">
                  <p className="text-tertiary">Select an analysis to view details.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
