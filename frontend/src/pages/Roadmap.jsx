import { useState, useEffect } from 'react';
import { resumeAPI, analysisAPI, roadmapAPI } from '../services/api';
import SkillTags from '../components/SkillTags';
import { PageLoader } from '../components/Loader';
import './Roadmap.css';

export default function Roadmap() {
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [resRes, anaRes, roadRes] = await Promise.all([
          resumeAPI.getAll(),
          analysisAPI.getAll(),
          roadmapAPI.getAll(),
        ]);
        setResumes(resRes.data);
        setAnalyses(anaRes.data);
        setRoadmaps(roadRes.data);
        if (resRes.data.length > 0) setSelectedResume(resRes.data[0]._id);
        if (roadRes.data.length > 0) setActiveRoadmap(roadRes.data[0]);
      } catch (err) { /* ignore */ }
      setFetching(false);
    };
    load();
  }, []);

  const handleGenerate = async () => {
    if (!selectedResume || !targetRole.trim()) {
      setError('Please select a resume and enter a target role');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await roadmapAPI.generate({
        resumeId: selectedResume,
        analysisId: selectedAnalysis || undefined,
        targetRole,
      });
      setActiveRoadmap(res.data.roadmap);
      setRoadmaps((prev) => [res.data.roadmap, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Roadmap generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PageLoader text="Loading..." />;

  return (
    <div className="roadmap-page container" id="roadmap-page">
      <div className="page-header">
        <h1 className="heading-2">Career Roadmap</h1>
        <p className="text-secondary">Generate a personalized learning path to reach your target role.</p>
      </div>

      {/* Generator form */}
      <div className="roadmap-generator card">
        <div className="roadmap-form-grid">
          <div className="form-group">
            <label className="form-label">Resume</label>
            <select
              className="form-input"
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
            >
              <option value="">Select a resume</option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>{r.fileName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Analysis (optional)</label>
            <select
              className="form-input"
              value={selectedAnalysis}
              onChange={(e) => setSelectedAnalysis(e.target.value)}
            >
              <option value="">None</option>
              {analyses.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.jobTitle || 'Analysis'} — Score: {a.matchScore}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Target Role</label>
            <input
              className="form-input"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading}
              style={{ height: '42px' }}
            >
              {loading ? 'Generating...' : 'Generate Roadmap'}
            </button>
          </div>
        </div>
        {error && <div className="alert alert-danger" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}
      </div>

      {loading && <PageLoader text="Generating your career roadmap with AI..." />}

      {/* Active Roadmap */}
      {activeRoadmap && !loading && (
        <div className="roadmap-display">
          <div className="roadmap-meta card">
            <div className="roadmap-meta-grid">
              <div>
                <span className="stat-label">Target Role</span>
                <p className="heading-4">{activeRoadmap.targetRole}</p>
              </div>
              <div>
                <span className="stat-label">Timeline</span>
                <p className="heading-4">{activeRoadmap.estimatedTimeline || 'Variable'}</p>
              </div>
              <div>
                <span className="stat-label">Phases</span>
                <p className="heading-4">{activeRoadmap.phases?.length || 0}</p>
              </div>
            </div>
            {activeRoadmap.summary && (
              <p className="text-secondary" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                {activeRoadmap.summary}
              </p>
            )}
          </div>

          {/* Phases timeline */}
          <div className="phases-timeline">
            {activeRoadmap.phases?.map((phase, i) => (
              <div key={i} className="phase-card card">
                <div className="phase-header">
                  <span className="phase-badge">Phase {phase.phaseNumber || i + 1}</span>
                  <span className="phase-duration">{phase.duration}</span>
                </div>
                <h3 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>{phase.title}</h3>
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                  {phase.description}
                </p>

                {phase.skills?.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <span className="phase-section-label">Skills to Learn</span>
                    <SkillTags skills={phase.skills} variant="accent" />
                  </div>
                )}

                {phase.projects?.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <span className="phase-section-label">Projects</span>
                    {phase.projects.map((p, j) => (
                      <div key={j} className="phase-project">
                        <strong>{p.name}</strong>
                        <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{p.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {phase.certifications?.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <span className="phase-section-label">Certifications</span>
                    <SkillTags skills={phase.certifications} />
                  </div>
                )}

                {phase.milestones?.length > 0 && (
                  <div>
                    <span className="phase-section-label">Milestones</span>
                    <ul className="milestones-list">
                      {phase.milestones.map((m, k) => (
                        <li key={k}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interview prep */}
          {activeRoadmap.interviewPrep && (
            <div className="card" style={{ marginTop: 'var(--space-6)' }}>
              <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Interview Preparation</h3>
              {activeRoadmap.interviewPrep.topics?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <span className="phase-section-label">Key Topics</span>
                  <SkillTags skills={activeRoadmap.interviewPrep.topics} variant="accent" />
                </div>
              )}
              {activeRoadmap.interviewPrep.tips?.length > 0 && (
                <div>
                  <span className="phase-section-label">Tips</span>
                  <ul className="milestones-list">
                    {activeRoadmap.interviewPrep.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Previous roadmaps */}
          {roadmaps.length > 1 && (
            <div className="card" style={{ marginTop: 'var(--space-6)' }}>
              <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Previous Roadmaps</h3>
              {roadmaps.map((r) => (
                <div
                  key={r._id}
                  className={`resume-list-item ${r._id === activeRoadmap._id ? 'active' : ''}`}
                  onClick={() => setActiveRoadmap(r)}
                >
                  <span className="resume-list-name">{r.targetRole}</span>
                  <span className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
