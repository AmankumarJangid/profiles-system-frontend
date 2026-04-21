import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { profilesApi } from '../utils/api';
import ProfileForm from '../components/ProfileForm';
import styles from './FormPage.module.css';

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => profilesApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profile created successfully! 🎉');
      navigate(`/profiles/${res.data.data._id}`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create profile');
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/profiles" className={styles.back}>
          <ArrowLeft size={16} /> Back to Profiles
        </Link>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Create Profile</h1>
        <p className={styles.subtitle}>Fill in the details to add a new profile card</p>
      </div>

      <div className={styles.formWrap}>
        <ProfileForm onSubmit={mutate} isLoading={isPending} submitLabel="Create Profile" />
      </div>
    </div>
  );
}
