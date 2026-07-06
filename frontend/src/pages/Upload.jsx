import { useState, useRef, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import SkillTags from '../components/SkillTags';
import './Upload.css';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resume, setResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const res = await resumeAPI.getAll();
      setResumes(res.data);
      if (res.data.length > 0) setResume(res.data[0]);
    } catch (err) { /* ignore */ }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
      setError('');
    } else {
      setError('Only PDF files are allowed');
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Only PDF files are allowed');
    }
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file'); return; }
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await resumeAPI.upload(formData);
      setResume(res.data.resume);
      setSuccess('Resume uploaded and parsed successfully');
      setFile(null);
      loadResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const allSkills = resume ? Object.values(resume.extractedSkills || {}).flat() : [];

  return (
    <div className="upload-page container" id="upload-page">
      <div className="page-header">
        <h1 className="heading-2">Resume Upload</h1>
        <p className="text-secondary">Upload a PDF resume. We will extract your skills, experience, and projects.</p>
      </div>

      {/* Upload area */}
      <div className="upload-area-wrapper">
        <div
          className={`upload-area card ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          id="upload-dropzone"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
          />
          <div className="upload-icon">↑</div>
          {file ? (
            <p className="upload-file-name">{file.name}</p>
          ) : (
            <>
              <p className="upload-text">Drop your PDF here or click to browse</p>
              <p className="upload-hint text-tertiary">PDF only, max 5MB</p>
            </>
          )}
        </div>

        {file && (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleUpload}
            disabled={uploading}
            id="upload-submit"
            style={{ width: '100%', marginTop: 'var(--space-4)' }}
          >
            {uploading ? 'Uploading & Parsing...' : 'Upload Resume'}
          </button>
        )}

        {error && <div className="alert alert-danger" style={{ marginTop: 'var(--space-4)' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginTop: 'var(--space-4)' }}>{success}</div>}
      </div>

      {/* Parsed result */}
      {resume && (
        <div className="parsed-result">
          <h2 className="heading-3" style={{ marginBottom: 'var(--space-6)' }}>Parsed Resume</h2>

          {resume.summary && (
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <h3 className="heading-4" style={{ marginBottom: 'var(--space-3)' }}>Summary</h3>
              <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                {resume.summary}
              </p>
            </div>
          )}

          <div className="parsed-grid">
            <div className="card">
              <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>
                Skills ({allSkills.length})
              </h3>
              {Object.entries(resume.extractedSkills || {}).map(([cat, skills]) =>
                skills.length > 0 && (
                  <div key={cat} className="skill-category" style={{ marginBottom: 'var(--space-3)' }}>
                    <span className="skill-category-label">{cat}</span>
                    <SkillTags skills={skills} variant="accent" />
                  </div>
                )
              )}
            </div>

            <div className="card">
              <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Education</h3>
              {resume.education?.length > 0 ? (
                resume.education.map((edu, i) => (
                  <div key={i} className="parsed-item">
                    <p className="parsed-item-title">{edu.degree}</p>
                    {edu.institution && <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{edu.institution}</p>}
                    {edu.year && <p className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{edu.year}</p>}
                  </div>
                ))
              ) : (
                <p className="text-tertiary" style={{ fontSize: 'var(--text-sm)' }}>No education data parsed</p>
              )}

              <h3 className="heading-4" style={{ margin: 'var(--space-6) 0 var(--space-4)' }}>Certifications</h3>
              {resume.certifications?.length > 0 ? (
                <SkillTags skills={resume.certifications} />
              ) : (
                <p className="text-tertiary" style={{ fontSize: 'var(--text-sm)' }}>None found</p>
              )}
            </div>
          </div>

          {/* Previous uploads */}
          {resumes.length > 1 && (
            <div className="card" style={{ marginTop: 'var(--space-6)' }}>
              <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Previous Uploads</h3>
              {resumes.map((r) => (
                <div
                  key={r._id}
                  className={`resume-list-item ${r._id === resume._id ? 'active' : ''}`}
                  onClick={() => setResume(r)}
                >
                  <span className="resume-list-name">{r.fileName}</span>
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
