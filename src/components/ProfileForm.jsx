import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus, User, Mail, Briefcase, Building2, MapPin, FileText, Phone, Globe, Linkedin, Github, Twitter, Camera } from 'lucide-react';
import styles from './ProfileForm.module.css';

const FIELD_ICONS = {
  name: User, email: Mail, jobTitle: Briefcase, company: Building2,
  location: MapPin, bio: FileText, phone: Phone, website: Globe,
  linkedin: Linkedin, github: Github, twitter: Twitter,
};

function Field({ label, name, type = 'text', value, onChange, error, hint, placeholder, required, icon: Icon, rows }) {
  const IconComp = Icon || FIELD_ICONS[name];
  const isTextarea = type === 'textarea';
  const inputProps = {
    id: name, name, value, onChange, placeholder,
    className: `form-input ${error ? 'error' : ''}`,
    'aria-describedby': error ? `${name}-error` : hint ? `${name}-hint` : undefined,
  };
  if (required) inputProps.required = true;

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputWrap}>
        {IconComp && !isTextarea && (
          <IconComp size={15} className={styles.inputIcon} />
        )}
        {isTextarea ? (
          <textarea {...inputProps} rows={rows || 4} style={{ resize: 'vertical' }} />
        ) : (
          <input {...inputProps} type={type} style={IconComp ? { paddingLeft: 40 } : {}} />
        )}
      </div>
      {error && <p id={`${name}-error`} className="form-error">{error}</p>}
      {hint && !error && <p id={`${name}-hint`} className="form-hint">{hint}</p>}
    </div>
  );
}

function SkillInput({ skills, onChange }) {
  const [inputVal, setInputVal] = useState('');

  const addSkill = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      onChange([...skills, trimmed]);
      setInputVal('');
    }
  };

  const removeSkill = (skill) => onChange(skills.filter((s) => s !== skill));

  return (
    <div className="form-group">
      <label className="form-label">Skills <span className={styles.optional}>(up to 10)</span></label>
      <div className={styles.skillsWrap}>
        {skills.map((skill) => (
          <span key={skill} className={styles.skillChip}>
            {skill}
            <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
              <X size={12} />
            </button>
          </span>
        ))}
        {skills.length < 10 && (
          <div className={styles.skillInput}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Add skill…"
              className={styles.skillTextField}
              maxLength={30}
            />
            <button type="button" className={styles.addSkillBtn} onClick={addSkill} disabled={!inputVal.trim()}>
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
      <p className="form-hint">Press Enter or click + to add a skill</p>
    </div>
  );
}

function AvatarDropzone({ preview, onChange, onRemove, error }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onChange(accepted[0]);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="form-group">
      <label className="form-label">Profile Photo</label>
      <div className={styles.dropzoneWrap}>
        <div
          {...getRootProps()}
          className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${error ? styles.dropzoneError : ''}`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className={styles.previewWrap}>
              <img src={preview} alt="Preview" className={styles.preview} />
              <div className={styles.previewOverlay}>
                <Camera size={20} />
                <span>Change</span>
              </div>
            </div>
          ) : (
            <div className={styles.dropzoneContent}>
              <div className={styles.uploadIcon}>
                <Upload size={24} />
              </div>
              <p className={styles.dropzoneLabel}>
                {isDragActive ? 'Drop it here!' : 'Drag & drop or click to upload'}
              </p>
              <p className={styles.dropzoneHint}>JPG, PNG, WebP · Max 5MB</p>
            </div>
          )}
        </div>
        {preview && (
          <button type="button" className={styles.removePhoto} onClick={onRemove} aria-label="Remove photo">
            <X size={14} /> Remove
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default function ProfileForm({ initialData, onSubmit, isLoading, submitLabel = 'Save Profile' }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    jobTitle: initialData?.jobTitle || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    bio: initialData?.bio || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
    twitter: initialData?.twitter || '',
    skills: initialData?.skills || [],
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar?.url || '');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: '' }));
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    if (form.website && !/^https?:\/\/.+/.test(form.website)) errs.website = 'Website must start with http:// or https://';
    if (form.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(form.phone))
      errs.phone = 'Enter a valid phone number';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'skills') data.append(key, JSON.stringify(val));
      else if (val !== undefined && val !== null) data.append(key, val);
    });
    if (avatarFile) data.append('avatar', avatarFile);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.grid}>
        {/* Left: avatar */}
        <div className={styles.sidebar}>
          <AvatarDropzone
            preview={avatarPreview}
            onChange={handleAvatarChange}
            onRemove={handleAvatarRemove}
            error={errors.avatar}
          />
        </div>

        {/* Right: fields */}
        <div className={styles.fields}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Basic Info</h3>
            <div className={styles.twoCol}>
              <Field label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Jane Doe" required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="jane@example.com" required />
              <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} error={errors.jobTitle} placeholder="Senior Designer" required />
              <Field label="Company" name="company" value={form.company} onChange={handleChange} error={errors.company} placeholder="Acme Corp" />
              <Field label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} placeholder="San Francisco, CA" />
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+1 555 000 0000" />
            </div>
            <Field label="Bio" name="bio" type="textarea" value={form.bio} onChange={handleChange} error={errors.bio} placeholder="Tell the world a bit about yourself…" hint={`${form.bio.length}/500`} />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Links</h3>
            <div className={styles.twoCol}>
              <Field label="Website" name="website" value={form.website} onChange={handleChange} error={errors.website} placeholder="https://yoursite.com" />
              <Field label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="linkedin.com/in/username" />
              <Field label="GitHub" name="github" value={form.github} onChange={handleChange} error={errors.github} placeholder="github.com/username" />
              <Field label="Twitter / X" name="twitter" value={form.twitter} onChange={handleChange} error={errors.twitter} placeholder="@username" />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Skills</h3>
            <SkillInput skills={form.skills} onChange={(s) => setForm((p) => ({ ...p, skills: s }))} />
          </section>
        </div>
      </div>

      <div className={styles.formFooter}>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <span className={styles.spinner} /> : null}
          {isLoading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
