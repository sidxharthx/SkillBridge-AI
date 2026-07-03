import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing" id="landing-page">
      {/* ── Hero ─────────────────────────────── */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-label">AI-Powered Career Intelligence</span>
            <h1 className="heading-1">
              Know exactly where you stand.<br />
              Bridge the gap to where you belong.
            </h1>
            <p className="hero-subtitle">
              Upload your resume, paste a job description, and get a precise skill match score — plus a personalized roadmap to close every gap.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">Open Dashboard</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">Start Free Analysis</Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">Log In</Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-card-dot" />
                <span className="hero-card-title">Match Report</span>
              </div>
              <div className="hero-stat-row">
                <div className="hero-stat">
                  <span className="hero-stat-value">78</span>
                  <span className="hero-stat-label">Match Score</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">12</span>
                  <span className="hero-stat-label">Skills Matched</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-value">4</span>
                  <span className="hero-stat-label">Gaps Found</span>
                </div>
              </div>
              <div className="hero-tags-demo">
                <span className="tag tag-success">React</span>
                <span className="tag tag-success">Node.js</span>
                <span className="tag tag-success">TypeScript</span>
                <span className="tag tag-danger">Kubernetes</span>
                <span className="tag tag-danger">GraphQL</span>
                <span className="tag tag-warning">AWS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────── */}
      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <h2 className="heading-2 section-title">How it works</h2>
          <p className="section-subtitle text-secondary">Three steps from resume to roadmap — no guesswork.</p>
          <div className="steps-grid">
            <div className="step-card card">
              <span className="step-number">01</span>
              <h3 className="heading-4">Upload Your Resume</h3>
              <p className="text-secondary">Drop in your PDF. We extract skills, experience, projects, and certifications automatically.</p>
            </div>
            <div className="step-card card">
              <span className="step-number">02</span>
              <h3 className="heading-4">Paste a Job Description</h3>
              <p className="text-secondary">Copy any JD. Our engine matches your skills against the role — keyword by keyword.</p>
            </div>
            <div className="step-card card">
              <span className="step-number">03</span>
              <h3 className="heading-4">Get Your Roadmap</h3>
              <p className="text-secondary">See exactly what to learn, build, and certify — organized into actionable phases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section className="section" id="features">
        <div className="container">
          <h2 className="heading-2 section-title">Built for real career growth</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">◎</div>
              <h4 className="heading-4">Transparent Scoring</h4>
              <p className="text-secondary">See the exact breakdown of core matches, partial matches, missing skills, and bonus points.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⟡</div>
              <h4 className="heading-4">AI Career Roadmap</h4>
              <p className="text-secondary">Phased learning paths with project ideas, certifications, and interview prep tips.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⊞</div>
              <h4 className="heading-4">Skill Categorization</h4>
              <p className="text-secondary">Skills organized by frontend, backend, cloud, tools, languages, and soft skills.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">↻</div>
              <h4 className="heading-4">History & Tracking</h4>
              <p className="text-secondary">Save every analysis. Track progress over time. See how your match scores improve.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⊘</div>
              <h4 className="heading-4">No Black Box</h4>
              <p className="text-secondary">Matching is rule-based. AI is used only for roadmap context — not for score inflation.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⊕</div>
              <h4 className="heading-4">Role Recommendations</h4>
              <p className="text-secondary">Based on your skill profile, get AI-suggested roles that actually fit your background.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="section section-cta">
        <div className="container cta-container">
          <h2 className="heading-2">Ready to close the gap?</h2>
          <p className="text-secondary cta-text">
            Join professionals who use data-driven career analysis instead of guessing.
          </p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-brand">◆ SkillBridge AI</span>
          <span className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
            © {new Date().getFullYear()} SkillBridge AI. Built for real careers.
          </span>
        </div>
      </footer>
    </div>
  );
}
