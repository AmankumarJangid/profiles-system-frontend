import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { profilesApi } from '../utils/api';
import ProfileForm from '../components/ProfileForm';
import styles from './FormPage.module.css';

export default function EditProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => profilesApi.getById(id).then((r) => r.data.data),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => profilesApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      toast.success('Profile updated successfully!');
      navigate(`/profiles/${id}`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile');
    },
  });

  if (isLoading) return (
    <div className={styles.page}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (isError) return (
    <div className={styles.page}>
      <div className="empty-state">
        <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 22 }}>Profile not found</h2>
        <Link to="/profiles" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Profiles</Link>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to={`/profiles/${id}`} className={styles.back}>
          <ArrowLeft size={16} /> Back to Profile
        </Link>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Edit Profile</h1>
        <p className={styles.subtitle}>Update details for {data?.name}</p>
      </div>

      <div className={styles.formWrap}>
        <ProfileForm initialData={data} onSubmit={mutate} isLoading={isPending} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
