import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Edit3, Trash2, MapPin, Briefcase, Building2,
  Phone, Globe, Linkedin, Github, Twitter, Mail, Calendar,
  ExternalLink, Copy, Check,
} from 'lucide-react';
import { profilesApi } from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import styles from './ProfileDetailPage.module.css';

function getInitials(name) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className={styles.copyBtn} onClick={copy} title="Copy email">
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function LinkRow({ icon: Icon, href, label, display }) {
  const isExternal = href?.startsWith('http');
  return (
    <a
      href={isExternal ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkRow}
    >
      <span className={styles.linkIcon}><Icon size={15} /></span>
      <span className={styles.linkLabel}>{label}</span>
      <span className={styles.linkValue}>{display || href}</span>
      <ExternalLink size={12} className={styles.linkExternal} />
    </a>
  );
}

export default function ProfileDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => profilesApi.getById(id).then((r) => r.data.data),
  });

  const { mutate: deleteProfile, isPending: isDeleting } = useMutation({
    mutationFn: () => profilesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profile deleted');
      navigate('/profiles');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete'),
  });

  if (isLoading) return (
    <div className={styles.page}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (isError || !profile) return (
    <div className={styles.page}>
      <div className="empty-state">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text-primary)' }}>Profile not found</h2>
        <Link to="/profiles" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Profiles</Link>
      </div>
    </div>
  );

  const joinedDate = new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <Link to="/profiles" className={styles.back}>
          <ArrowLeft size={16} /> All Profiles
        </Link>
        <div className={styles.actions}>
          <Link to={`/profiles/${id}/edit`} className="btn btn-ghost">
            <Edit3 size={15} /> Edit
          </Link>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.avatarWrap}>
            {profile.avatar?.url ? (
              <img src={profile.avatar.url} alt={profile.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          <div className={styles.heroInfo}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.jobTitle}>
              <Briefcase size={14} />
              {profile.jobTitle}
              {profile.company && <><span className={styles.dot}>·</span><Building2 size={13} />{profile.company}</>}
            </p>

            <div className={styles.heroMeta}>
              {profile.location && (
                <span className={styles.metaItem}><MapPin size={13} />{profile.location}</span>
              )}
              <span className={styles.metaItem}><Calendar size={13} />Joined {joinedDate}</span>
            </div>

            <div className={styles.emailRow}>
              <Mail size={14} className={styles.emailIcon} />
              <a href={`mailto:${profile.email}`} className={styles.email}>{profile.email}</a>
              <CopyEmail email={profile.email} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.columns}>
        {/* Main */}
        <div className={styles.main}>
          {profile.bio && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.bio}>{profile.bio}</p>
            </section>
          )}

          {profile.skills?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className={styles.skills}>
                {profile.skills.map((skill, i) => (
                  <span key={skill} className={styles.skillBadge} style={{ animationDelay: `${i * 40}ms` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {(profile.phone || profile.website || profile.linkedin || profile.github || profile.twitter) && (
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Links & Contact</h2>
              <div className={styles.links}>
                {profile.phone && <LinkRow icon={Phone} href={`tel:${profile.phone}`} label="Phone" display={profile.phone} />}
                {profile.website && <LinkRow icon={Globe} href={profile.website} label="Website" display={profile.website.replace(/^https?:\/\//, '')} />}
                {profile.linkedin && <LinkRow icon={Linkedin} href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} label="LinkedIn" display="LinkedIn Profile" />}
                {profile.github && <LinkRow icon={Github} href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} label="GitHub" display="GitHub Profile" />}
                {profile.twitter && <LinkRow icon={Twitter} href={profile.twitter.startsWith('http') ? profile.twitter : `https://twitter.com/${profile.twitter.replace('@', '')}`} label="Twitter / X" display={profile.twitter} />}
              </div>
            </section>
          )}

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to={`/profiles/${id}/edit`} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Edit3 size={15} /> Edit Profile
              </Link>
              <button className="btn btn-danger" style={{ justifyContent: 'flex-start' }} onClick={() => setShowDelete(true)}>
                <Trash2 size={15} /> Delete Profile
              </button>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Profile"
        message={`Are you sure you want to delete ${profile.name}'s profile? This action cannot be undone.`}
        confirmLabel="Delete Profile"
        loading={isDeleting}
        onConfirm={deleteProfile}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
