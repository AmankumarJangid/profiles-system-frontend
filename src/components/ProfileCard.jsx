import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Building2, ArrowRight } from 'lucide-react';
import styles from './ProfileCard.module.css';

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function ProfileCard({ profile, index = 0 }) {
  const navigate = useNavigate();

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/profiles/${profile._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/profiles/${profile._id}`)}
      aria-label={`View ${profile.name}'s profile`}
    >
      <div className={styles.cardGlow} />

      <div className={styles.avatarWrap}>
        {profile.avatar?.url ? (
          <img src={profile.avatar.url} alt={profile.name} className={`avatar ${styles.avatar}`} />
        ) : (
          <div className={`avatar-placeholder ${styles.avatar}`}>
            {getInitials(profile.name)}
          </div>
        )}
        <div className={styles.avatarRing} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{profile.name}</h3>
        <p className={styles.jobTitle}>
          <Briefcase size={13} />
          {profile.jobTitle}
        </p>

        {(profile.company || profile.location) && (
          <div className={styles.meta}>
            {profile.company && (
              <span className={styles.metaItem}>
                <Building2 size={12} />
                {profile.company}
              </span>
            )}
            {profile.location && (
              <span className={styles.metaItem}>
                <MapPin size={12} />
                {profile.location}
              </span>
            )}
          </div>
        )}

        {profile.bio && (
          <p className={styles.bio}>{profile.bio}</p>
        )}

        {profile.skills?.length > 0 && (
          <div className={styles.skills}>
            {profile.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="chip chip-accent">{skill}</span>
            ))}
            {profile.skills.length > 3 && (
              <span className="chip">+{profile.skills.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.viewBtn}>
          View Profile <ArrowRight size={14} />
        </span>
      </div>
    </article>
  );
}
