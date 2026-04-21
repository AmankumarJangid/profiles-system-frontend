import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { UserPlus, Users, Zap } from 'lucide-react';
import styles from './Layout.module.css';

export default function Layout() {
  const navigate = useNavigate();
  return (
    <div className={styles.root}>
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <button className={styles.logo} onClick={() => navigate('/profiles')}>
            {/* <div className={styles.logoIcon}>
              <Zap size={18} strokeWidth={2.5} />
            </div> */}
            <span>Profiles</span>
          </button>

          <div className={styles.navLinks}>
            <NavLink
              to="/profiles"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Users size={16} />
              <span>All Profiles</span>
            </NavLink>
            <NavLink
              to="/profiles/new"
              className={({ isActive }) => `${styles.navLink} ${styles.navCta} ${isActive ? styles.active : ''}`}
            >
              <UserPlus size={16} />
              <span>Add Profile</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>Profile Card System &mdash; Built with React &amp; Node.js</p>
        </div>
      </footer>
    </div>
  );
}
