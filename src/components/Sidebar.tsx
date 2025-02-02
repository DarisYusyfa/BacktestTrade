import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LineChart, Settings, LogOut, Plus, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  user: {
    email: string;
    user_metadata?: {
      avatar_url?: string;
      full_name?: string;
    };
  };
}

export function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false); // State untuk mengontrol buka/tutup sidebar

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'New Backtest', path: '/new-backtest' },
    { icon: LineChart, label: 'Performance', path: '/performance' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Button Hamburger untuk Mobile */}
      <button className="md:hidden fixed top-2 left-4 z-50 bg-gray-800 p-2 rounded-full text-white shadow-lg hover:bg-gray-700 transition-colors focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay untuk Mobile (muncul saat sidebar terbuka) */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-700 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:w-64 z-50`}
      >
        {/* Judul Sidebar */}
        <div className="p-4 flex justify-between items-center pt-12">
          <h1 className="text-xl font-bold text-white">RizsFx</h1>
          {/* Tombol Close untuk Mobile */}
          <button className="md:hidden text-gray-400 hover:text-white focus:outline-none" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${location.pathname === item.path ? 'bg-gray-800 text-white' : ''}`}
                onClick={() => setIsOpen(false)} // Tutup sidebar saat menu diklik (mobile)
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-lg font-semibold">{user.email?.[0].toUpperCase() || 'U'}</div>
              )}
            </div>
            <div>
              <p className="text-white font-medium">{user.user_metadata?.full_name || user.email || 'Unknown User'}</p>
              <p className="text-sm text-gray-400">{user.email || 'No Email'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full focus:outline-none">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
