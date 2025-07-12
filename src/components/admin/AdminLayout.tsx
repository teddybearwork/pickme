import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { 
  Shield, 
  Users, 
  Settings, 
  CreditCard, 
  FileText, 
  Radio,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sparkles
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: Shield },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'API Management', href: '/admin/apis', icon: Settings },
    { name: 'Credit Control', href: '/admin/credits', icon: CreditCard },
    { name: 'Logs & Reports', href: '/admin/logs', icon: FileText },
    { name: 'Broadcast System', href: '/admin/broadcasts', icon: Radio },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 transition-colors duration-300">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-secondary-900/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 glass-effect shadow-large animate-slide-down">
            <div className="flex items-center justify-between h-20 px-6 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold font-display text-secondary-900 dark:text-secondary-100">Admin Panel</h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl text-secondary-400 hover:text-secondary-500 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-6 px-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`nav-link mb-2 ${
                      isActive
                        ? 'nav-link-active'
                        : 'nav-link-inactive'
                    }`}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col card border-r border-secondary-200 dark:border-secondary-700">
          <div className="flex flex-1 flex-col pt-6 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-4 shadow-glow">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-secondary-900 dark:text-secondary-100">Admin Panel</h1>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="h-3 w-3 text-accent-500" />
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 font-medium">Intelligence Hub</span>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${
                      isActive
                        ? 'nav-link-active'
                        : 'nav-link-inactive'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        <div className="sticky top-0 z-10 glass-effect border-b border-secondary-200 dark:border-secondary-700 shadow-soft">
          <div className="flex h-20 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-secondary-700 dark:text-secondary-300 lg:hidden hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="h-6 w-px bg-secondary-200 dark:bg-secondary-700 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <Search className="pointer-events-none absolute left-4 h-5 w-5 text-secondary-400" />
                <input
                  className="block h-12 w-full border-0 py-0 pl-11 pr-0 bg-transparent text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:ring-0 sm:text-sm rounded-xl"
                  placeholder="Search..."
                  type="search"
                />
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button className="p-2 text-secondary-400 hover:text-secondary-500 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all duration-200">
                  <Bell className="h-6 w-6" />
                </button>

                <ThemeToggle />

                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-secondary-200 dark:bg-secondary-700" />

                <div className="flex items-center gap-x-4">
                  <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                    Welcome, {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-secondary-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 py-6">
          <div className="px-4 sm:px-6 lg:px-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;