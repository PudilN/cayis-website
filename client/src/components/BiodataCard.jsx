import './BiodataCard.css';

export default function BiodataCard({ member, index }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="biodata-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="card-avatar">
        {member.photo ? (
          <img src={member.photo} alt={member.name} />
        ) : (
          <div className="card-avatar-placeholder">{initials}</div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-name">{member.name}</h3>
        <span className="card-role">{member.role}</span>
        
        <div className="card-info-grid">
          <div className="info-item">
            <span className="info-label">ID / NPM</span>
            <span className="info-value">{member.npm}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Major</span>
            <span className="info-value">{member.jurusan}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Batch</span>
            <span className="info-value">{member.angkatan}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
