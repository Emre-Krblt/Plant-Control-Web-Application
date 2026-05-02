import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: 'DB' },
  { to: '/plants', label: 'My Plants', icon: 'PL', end: true },
  { to: '/plants/new', label: 'Add Plant', icon: 'AD' },
  { to: '/alerts', label: 'Alerts', icon: 'AL' },
  { to: '/profile', label: 'Profile', icon: 'PR' },
];

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen text-slate-950">
      <header className="sticky top-0 z-30 border-b border-white/80 bg-white/80 px-4 py-4 shadow-lg shadow-emerald-950/5 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-emerald-100 bg-white text-xl font-bold text-emerald-950 shadow-sm">
                PC
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Plant Control</span>
                <span className="block text-2xl font-bold tracking-tight text-slate-950">Garden Desk</span>
              </span>
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 lg:hidden"
            >
              Logout
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-950 shadow-sm shadow-emerald-950/5 ring-1 ring-emerald-200'
                      : 'text-slate-700 hover:bg-white hover:text-emerald-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="rounded-2xl border border-emerald-100 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600">
              {user?.email}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative px-4 py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
