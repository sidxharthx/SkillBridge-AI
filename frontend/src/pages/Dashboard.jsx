import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roadmapAPI } from '../services/api';
import ScoreRing from '../components/ScoreRing';
import SkillTags from '../components/SkillTags';
import { SkeletonCard } from '../components/Loader';
import './Dashboard.css';

/* Match level icons and colors */
const matchConfig = {
  high: { icon: '🎯', color: '#22c55e', label: 'High Match' },
  medium: { icon: '📊', color: '#eab308', label: 'Medium Match' },
  low: { icon: '🔍', color: '#ef4444', label: 'Low Match' },
};

function RoleRecommendations({ resumeId }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadRecommendations = async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const res = await roadmapAPI.getRecommendations(resumeId);
      const data = res.data.recommendations;
      setRoles(Array.isArray(data) ? data : []);
      setLoaded(true);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setLoaded(true);
    }
    setLoading(false);
  };

  if (!loaded && !loading) {
    return (
      <div className="card role-rec-card">
        <div className="card-header-row">
          <h3 className="heading-4">Role Recommendations</h3>
          <span className="tag tag-accent" style={{ fontSize: 'var(--text-xs)' }}>AI-Powered</span>
        </div>
        <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
          Get AI-suggested roles that fit your skill profile.
        </p>
        <button className="btn btn-primary btn-sm" onClick={loadRecommendations}>
          Get Recommendations
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card role-rec-card">
        <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Finding roles...</h3>
        <div className="role-rec-loading">
          <div className="role-skeleton"></div>
          <div className="role-skeleton"></div>
          <div className="role-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card role-rec-card">
      <div className="card-header-row">
        <h3 className="heading-4">Recommended Roles</h3>
        <button className="btn btn-sm btn-secondary" onClick={loadRecommendations}>Refresh</button>
      </div>
      {roles.length > 0 ? (
        <div className="role-list">
          {roles.map((role, i) => {
            const level = matchConfig[role.match?.toLowerCase()] || matchConfig.medium;
            return (
              <div key={i} className="role-item">
                <div className="role-item-header">
                  <span className="role-icon">{level.icon}</span>
                  <div className="role-item-info">
                    <span className="role-name">{role.role}</span>
                    <span className="role-match-badge" style={{ color: level.color, borderColor: level.color }}>
                      {level.label}
                    </span>
                  </div>
                </div>
                <p className="role-reason">{role.reason}</p>
                <Link
                  to="/roadmap"
                  className="role-action"
                  state={{ targetRole: role.role }}
                >
                  Generate Roadmap →
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-tertiary" style={{ fontSize: 'var(--text-sm)' }}>
          Unable to generate recommendations. Try again later.
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await roadmapAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard container" id="dashboard-page">
        <div className="dash-header">
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" style={{ width: '200px' }} />
        </div>
        <div className="dash-stats-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const hasResume = data?.latestResume;
  const hasAnalysis = data?.latestAnalysis;
  const allSkills = hasResume
    ? Object.values(data.latestResume.extractedSkills || {}).flat()
    : [];

  return (
    <div className="dashboard container" id="dashboard-page">
      {/* ── Welcome ──────────────────────────── */}
      <div className="dash-header">
        <h1 className="heading-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-secondary">Here's your career analysis overview.</p>
      </div>

      {/* ── Quick Stats ──────────────────────── */}
      <div className="dash-stats-grid">
        <div className="card stat-card">
          <span className="stat-label">Resumes Uploaded</span>
          <span className="stat-value">{data?.stats?.resumeCount || 0}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Analyses Run</span>
          <span className="stat-value">{data?.stats?.analysisCount || 0}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Latest Score</span>
          <span className="stat-value">
            {data?.stats?.latestScore !== null ? data.stats.latestScore : '—'}
          </span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Target Role</span>
          <span className="stat-value stat-value-sm">
            {data?.stats?.targetRole || 'Not set'}
          </span>
        </div>
      </div>

      {/* ── Main Content ─────────────────────── */}
      {!hasResume ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📄</div>
          <h3 className="empty-state-title">No resume uploaded yet</h3>
          <p className="empty-state-text">
            Upload your resume to get started with skill extraction and career analysis.
          </p>
          <Link to="/upload" className="btn btn-primary">Upload Resume</Link>
        </div>
      ) : (
        <div className="dash-content-grid">
          {/* Left: Skills & Resume */}
          <div className="dash-left">
            <div className="card">
              <div className="card-header-row">
                <h3 className="heading-4">Extracted Skills</h3>
                <Link to="/upload" className="btn btn-sm btn-secondary">View Resume</Link>
              </div>
              <div className="dash-skill-categories">
                {Object.entries(data.latestResume.extractedSkills || {}).map(
                  ([category, skills]) =>
                    skills.length > 0 && (
                      <div key={category} className="skill-category">
                        <span className="skill-category-label">{category}</span>
                        <SkillTags skills={skills} variant="accent" />
                      </div>
                    )
                )}
                {allSkills.length === 0 && (
                  <p className="text-tertiary">No skills extracted. Try re-uploading your resume.</p>
                )}
              </div>
            </div>

            {/* Recent Analyses */}
            {data.recentAnalyses?.length > 0 && (
              <div className="card">
                <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Recent Analyses</h3>
                <div className="recent-list">
                  {data.recentAnalyses.map((a) => (
                    <Link to={`/history`} key={a._id} className="recent-item">
                      <span className="recent-title">{a.jobTitle || 'Untitled Analysis'}</span>
                      <span className="recent-score">{a.matchScore}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Score & Roadmap & Recommendations */}
          <div className="dash-right">
            {hasAnalysis ? (
              <div className="card dash-score-card">
                <h3 className="heading-4">Latest Match</h3>
                <div className="dash-score-content">
                  <ScoreRing score={data.latestAnalysis.matchScore} />
                  <div className="dash-score-details">
                    <div className="score-detail-row">
                      <span className="text-secondary">Matched</span>
                      <span className="score-detail-count tag tag-success">
                        {data.latestAnalysis.matchedSkills?.length || 0}
                      </span>
                    </div>
                    <div className="score-detail-row">
                      <span className="text-secondary">Missing</span>
                      <span className="score-detail-count tag tag-danger">
                        {data.latestAnalysis.missingSkills?.length || 0}
                      </span>
                    </div>
                    <div className="score-detail-row">
                      <span className="text-secondary">Partial</span>
                      <span className="score-detail-count tag tag-warning">
                        {data.latestAnalysis.partialMatches?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <Link to="/analyze" className="btn btn-sm btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Run New Analysis
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card">
                <h3 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>No Analysis Yet</h3>
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                  Paste a job description to see how your skills match.
                </p>
                <Link to="/analyze" className="btn btn-primary btn-sm">Analyze a JD</Link>
              </div>
            )}

            {data.latestRoadmap ? (
              <div className="card">
                <div className="card-header-row">
                  <h3 className="heading-4">Roadmap Preview</h3>
                  <Link to="/roadmap" className="btn btn-sm btn-secondary">Full Roadmap</Link>
                </div>
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                  Target: <strong>{data.latestRoadmap.targetRole}</strong>
                </p>
                {data.latestRoadmap.phases?.slice(0, 2).map((phase, i) => (
                  <div key={i} className="roadmap-preview-phase">
                    <span className="phase-label">Phase {phase.phaseNumber}</span>
                    <span className="phase-title">{phase.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card">
                <h3 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>Career Roadmap</h3>
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                  Generate a personalized learning path for your target role.
                </p>
                <Link to="/roadmap" className="btn btn-primary btn-sm">Generate Roadmap</Link>
              </div>
            )}

            {/* ── Role Recommendations (Feature 6) ── */}
            <RoleRecommendations resumeId={data.latestResume?._id} />
          </div>
        </div>
      )}
    </div>
  );
}
