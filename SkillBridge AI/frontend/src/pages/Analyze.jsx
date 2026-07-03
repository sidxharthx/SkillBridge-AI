import { useState, useEffect } from 'react';
import { resumeAPI, analysisAPI } from '../services/api';
import ScoreRing from '../components/ScoreRing';
import SkillTags from '../components/SkillTags';
import { PageLoader } from '../components/Loader';
import './Analyze.css';

export default function Analyze() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jdText, setJdText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await resumeAPI.getAll();
        setResumes(res.data);
        if (res.data.length > 0) setSelectedResume(res.data[0]._id);
      } catch (err) { /* ignore */ }
      setFetching(false);
    };
    load();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResume) { setError('Please select a resume'); return; }
    if (!jdText.trim() || jdText.trim().length < 30) {
      setError('Please paste a job description (at least 30 characters)');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await analysisAPI.analyze({
        resumeId: selectedResume,
        jdText,
        jobTitle,
      });
      setResult(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PageLoader text="Loading resumes..." />;

  return (
    <div className="analyze-page container" id="analyze-page">
      <div className="page-header">
        <h1 className="heading-2">JD Analyzer</h1>
        <p className="text-secondary">Match your resume against any job description. Get a transparent skill match report.</p>
      </div>

      {resumes.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📄</div>
          <h3 className="empty-state-title">No resume found</h3>
          <p className="empty-state-text">Upload a resume first before running analysis.</p>
        </div>
      ) : (
        <div className="analyze-layout">
          {/* Input panel */}
          <div className="analyze-input">
            <div className="card">
              <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label">Select Resume</label>
                <select
                  className="form-input"
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  id="resume-select"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>{r.fileName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label">Job Title (optional)</label>
                <input
                  className="form-input"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  id="job-title-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-textarea"
                  rows={12}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  id="jd-textarea"
                />
              </div>

              {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

              <button
                className="btn btn-primary btn-lg"
                onClick={handleAnalyze}
                disabled={loading}
                id="analyze-submit"
                style={{ width: '100%' }}
              >
                {loading ? 'Analyzing...' : 'Analyze Match'}
              </button>
            </div>
          </div>

          {/* Results panel */}
          <div className="analyze-results">
            {loading && <PageLoader text="Running analysis..." />}

            {result && !loading && (
              <>
                {/* Score */}
                <div className="card analyze-score-card">
                  <div className="analyze-score-top">
                    <ScoreRing score={result.matchScore} size={140} strokeWidth={10} />
                    <div className="analyze-score-meta">
                      <h3 className="heading-3">Match Score</h3>
                      {result.jobTitle && (
                        <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                          for {result.jobTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Breakdown */}
                  {result.scoreBreakdown && (
                    <div className="score-breakdown">
                      <h4 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>Why this score</h4>
                      <div className="breakdown-rows">
                        <div className="breakdown-row">
                          <span>Core skills match</span>
                          <span className="text-mono">+{result.scoreBreakdown.coreSkillsScore}</span>
                        </div>
                        <div className="breakdown-row">
                          <span>Secondary / partial</span>
                          <span className="text-mono">+{result.scoreBreakdown.secondarySkillsScore}</span>
                        </div>
                        <div className="breakdown-row">
                          <span>Missing skills penalty</span>
                          <span className="text-mono" style={{ color: 'var(--color-danger)' }}>-{result.scoreBreakdown.missingPenalty}</span>
                        </div>
                        <div className="breakdown-row">
                          <span>Project relevance bonus</span>
                          <span className="text-mono" style={{ color: 'var(--color-success)' }}>+{result.scoreBreakdown.projectBonus}</span>
                        </div>
                        <div className="breakdown-row breakdown-total">
                          <span>Total</span>
                          <span className="text-mono">{result.scoreBreakdown.totalScore}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Matched */}
                <div className="card">
                  <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>
                    Matched Skills ({result.matchedSkills?.length || 0})
                  </h3>
                  <SkillTags skills={result.matchedSkills} variant="success" />
                </div>

                {/* Missing */}
                <div className="card">
                  <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>
                    Missing Skills ({result.missingSkills?.length || 0})
                  </h3>
                  <SkillTags skills={result.missingSkills} variant="danger" />
                </div>

                {/* Partial */}
                {result.partialMatches?.length > 0 && (
                  <div className="card">
                    <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>
                      Partial Matches
                    </h3>
                    {result.partialMatches.map((pm, i) => (
                      <div key={i} className="partial-match-row">
                        <span className="tag">{pm.resumeSkill}</span>
                        <span className="text-tertiary">≈</span>
                        <span className="tag tag-warning">{pm.jdSkill}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI summary */}
                {result.aiSummary && (
                  <div className="card">
                    <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>AI Analysis</h3>
                    <div className="ai-summary-text">
                      {result.aiSummary.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!result && !loading && (
              <div className="card empty-state">
                <div className="empty-state-icon">⊘</div>
                <h3 className="empty-state-title">No analysis yet</h3>
                <p className="empty-state-text">
                  Paste a job description and click &ldquo;Analyze Match&rdquo; to see your results.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
