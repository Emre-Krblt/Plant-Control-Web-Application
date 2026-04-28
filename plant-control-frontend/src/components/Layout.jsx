import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/plants', label: 'My Plants' },
  { to: '/plants/new', label: 'Add Plant' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/profile', label: 'Profile' },
];

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-emerald-50/60 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-emerald-100 bg-white px-5 py-6 shadow-sm lg:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Plant Control</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Garden Desk</h1>
          <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Logout
        </button>
      </aside>

      <header className="border-b border-emerald-100 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center justify-between">
          <NavLink to="/dashboard" className="text-lg font-bold text-emerald-900">
            Plant Control
          </NavLink>
          <button type="button" onClick={handleLogout} className="text-sm font-semibold text-slate-600">
            Logout
          </button>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${
                  isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="px-4 py-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
