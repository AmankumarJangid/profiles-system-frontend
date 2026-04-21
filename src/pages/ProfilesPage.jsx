import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { UserPlus, Users, SlidersHorizontal } from 'lucide-react';
import { profilesApi } from '../utils/api';
import ProfileCard from '../components/ProfileCard';
import SkeletonCard from '../components/SkeletonCard';
import SearchBar from '../components/SearchBar';
import styles from './ProfilesPage.module.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A–Z' },
];

export default function ProfilesPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profiles', { search, sort, page }],
    queryFn: () => profilesApi.getAll({ search, sort, page, limit: 12 }).then((r) => r.data),
    keepPreviousData: true,
  });

  const handleSearch = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, []);

  const profiles = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>All Profiles</h1>
          <p className={styles.subtitle}>
            {isLoading ? 'Loading…' : `${pagination?.total ?? 0} profile${pagination?.total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/profiles/new" className="btn btn-primary">
          <UserPlus size={16} />
          Add Profile
        </Link>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <SearchBar onSearch={handleSearch} />
        <div className={styles.sortWrap}>
          <SlidersHorizontal size={15} className={styles.sortIcon} />
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className={styles.sortSelect}
            aria-label="Sort profiles"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isError ? (
        <div className={styles.errorState}>
          <p>⚠️ {error?.message || 'Failed to load profiles'}</p>
        </div>
      ) : isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : profiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Users size={36} color="var(--text-muted)" /></div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            {search ? 'No profiles match your search' : 'No profiles yet'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 400 }}>
            {search ? 'Try a different search term.' : 'Be the first to add a profile!'}
          </p>
          {!search && (
            <Link to="/profiles/new" className="btn btn-primary" style={{ marginTop: 8 }}>
              <UserPlus size={16} /> Add First Profile
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {profiles.map((profile, i) => (
            <ProfileCard key={profile._id} profile={profile} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button
            className="btn btn-ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
