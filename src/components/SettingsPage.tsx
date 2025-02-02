import { useState } from 'react';
import { User, Lock, Bell, Database, Globe, CreditCard, HelpCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} text-${theme === 'dark' ? 'white' : 'black'} p-6`}>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Sidebar Menu */}
        <div className="col-span-1 md:col-span-2 bg-gray-800 rounded-lg p-4 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <User className="h-5 w-5" />
            <span className="truncate">Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <Lock className="h-5 w-5" />
            <span className="truncate">Security</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <Bell className="h-5 w-5" />
            <span className="truncate">Notifications</span>
          </button>
          <button onClick={() => setActiveTab('data')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'data' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <Database className="h-5 w-5" />
            <span className="truncate">Data Management</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'preferences' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <Globe className="h-5 w-5" />
            <span className="truncate">Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <CreditCard className="h-5 w-5" />
            <span className="truncate">Billing</span>
          </button>
          <button onClick={() => setActiveTab('help')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'help' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <HelpCircle className="h-5 w-5" />
            <span className="truncate">Help & Support</span>
          </button>
          <button onClick={toggleTheme} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-700 hover:text-white`}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="truncate">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 bg-gray-800 rounded-lg p-6 space-y-8">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium">
                    Full Name
                  </label>
                  <input type="text" id="fullName" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <input type="email" id="email" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" disabled />
                </div>
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium">
                    Avatar URL
                  </label>
                  <input type="text" id="avatar" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full md:w-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                  Save Changes
                </button>
              </form>
            </div>
          )}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Security Settings</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium">
                    Current Password
                  </label>
                  <input type="password" id="currentPassword" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium">
                    New Password
                  </label>
                  <input type="password" id="newPassword" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input type="password" id="confirmPassword" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full md:w-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                  Change Password
                </button>
              </form>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
                <p>Enable two-factor authentication for added security.</p>
                <button className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md">Enable 2FA</button>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="emailNotifications" className="flex items-center space-x-2">
                    <input type="checkbox" id="emailNotifications" className="form-checkbox h-5 w-5 text-blue-500" />
                    <span>Email Notifications</span>
                  </label>
                </div>
                <div>
                  <label htmlFor="pushNotifications" className="flex items-center space-x-2">
                    <input type="checkbox" id="pushNotifications" className="form-checkbox h-5 w-5 text-blue-500" />
                    <span>Push Notifications</span>
                  </label>
                </div>
                <div>
                  <label htmlFor="digestFrequency" className="block text-sm font-medium">
                    Digest Frequency
                  </label>
                  <select id="digestFrequency" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <button type="submit" className="w-full md:w-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                  Save Changes
                </button>
              </form>
            </div>
          )}
          {activeTab === 'data' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Data Management</h2>
              <div className="space-y-4">
                <button className="w-full md:w-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Export Data</button>
                <button className="w-full md:w-auto py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md">Delete Account</button>
              </div>
            </div>
          )}
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Preferences</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium">
                    Language
                  </label>
                  <select id="language" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium">
                    Currency
                  </label>
                  <select id="currency" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option value="USD">US Dollar (USD)</option>
                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                  </select>
                </div>
                <button type="submit" className="w-full md:w-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                  Save Changes
                </button>
              </form>
            </div>
          )}
          {activeTab === 'billing' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Billing & Subscription</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Subscription Plan</h3>
                  <p>
                    Your current subscription plan is <strong>Premium</strong>.
                  </p>
                  <button className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Upgrade Plan</button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <p>Visa ending in 1234</p>
                  <button className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Update Payment Method</button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Billing History</h3>
                  <ul className="list-disc pl-5">
                    <li>Payment on 2023-01-01 - $9.99</li>
                    <li>Payment on 2023-02-01 - $9.99</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'help' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Help & Support</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium">
                    Subject
                  </label>
                  <input type="text" id="subject" className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium">
                    Message
                  </label>
                  <textarea id="message" rows={4} className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <button type="submit" className="w-full md:w-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                  Submit
                </button>
              </form>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
                <ul className="list-disc pl-5">
                  <li>
                    <a href="#" className="text-blue-500 hover:underline">
                      How do I reset my password?
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-500 hover:underline">
                      What payment methods are accepted?
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Copyright Section */}
      <div className="mt-10 text-center text-gray-500 text-sm">© {new Date().getFullYear()} RizsFx. All rights reserved.</div>
    </div>
  );
}
