import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: '书库', icon: '📚' },
  { to: '/bookmarks', label: '书签', icon: '🔖' },
  { to: '/settings', label: '设置', icon: '⚙️' }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon" aria-hidden>
            {t.icon}
          </span>
          <span className="nav-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
