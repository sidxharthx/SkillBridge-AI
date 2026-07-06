export default function SkillTags({ skills, variant = 'default' }) {
  if (!skills || skills.length === 0) return null;

  const tagClass = {
    default: 'tag',
    accent: 'tag tag-accent',
    success: 'tag tag-success',
    warning: 'tag tag-warning',
    danger: 'tag tag-danger',
  }[variant] || 'tag';

  return (
    <div className="skill-tags-list">
      {skills.map((skill, i) => (
        <span key={i} className={tagClass}>{skill}</span>
      ))}
    </div>
  );
}
