import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await authAPI.updateProfile({ name, targetRole });
      updateUser(res.data);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page container" id="profile-page">
      <div className="page-header">
        <h1 className="heading-2">Profile</h1>
        <p className="text-secondary">Manage your account details.</p>
      </div>

      <div className="profile-card card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              className="form-input"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <span className="form-hint text-tertiary">Email cannot be changed</span>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-role">Preferred Target Role</label>
            <input
              id="profile-role"
              className="form-input"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="profile-info">
          <span className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
