import './Loader.css';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <p className="loader-text">{text}</p>
    </div>
  );
}

export function PageLoader({ text }) {
  return (
    <div className="page-loader">
      <Loader text={text} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <div className="skeleton skeleton-text" style={{ width: '90%' }} />
    </div>
  );
}
