import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LineChart, Settings, LogOut, Plus, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  user: {
    email: string;
    user_metadata?: {
      avatar_url?: string;
      username?: string;
    };
  };
}

export function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

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
      {/* Mobile Hamburger Button */}
      <button className="md:hidden fixed top-2 left-4 z-50 bg-gray-800 p-2 rounded-full text-white shadow-lg hover:bg-gray-700 transition-colors focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-64 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-64 z-50`}>
        {/* Background Image with Blur and Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
          style={{
            backgroundImage: "url('https://cdn.qwenlm.ai/output/1f4f4fbd-7379-4a02-8c51-c69966410465/t2i/34136f9a-e172-49dc-8eba-4d7b617cac27/64158d08-753a-499c-9409-c1cd0e2804b2.png')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Overlay */}
        {/* Sidebar Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 flex justify-between items-center pt-12">
            <h1 className="text-xl font-bold text-white">RizsFx</h1>
            {/* Mobile Close Button */}
            <button className="md:hidden text-gray-400 hover:text-white focus:outline-none" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${location.pathname === item.path ? 'bg-gray-800 text-white' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-lg font-semibold">{user.user_metadata?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{user.user_metadata?.username || user.email || 'Unknown User'}</p>
                <p className="text-sm text-gray-400">{user.email || 'No Email'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full focus:outline-none">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
