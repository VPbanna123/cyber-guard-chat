
// export default Sidebar;
import { MessageCircle, Users, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const Sidebar = ({ activeTab, onTabChange, onClose }) => {
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', color: 'from-blue-500 to-cyan-500' },
    { id: 'groups', icon: Users, label: 'Groups', color: 'from-purple-500 to-pink-500' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'from-orange-500 to-red-500' },
  ];

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <div className="w-20 h-screen bg-gradient-to-b from-purple-700 via-violet-700 to-indigo-800 flex flex-col items-center py-6 space-y-6 shadow-2xl relative overflow-y-auto">
      
      {/* Close button for mobile - positioned at top right, outside sidebar visually */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute -top-1 -right-1 text-white bg-red-500 hover:bg-red-600 p-1.5 rounded-full transition-all z-50 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* User Avatar Section */}
      <div className="mb-2 group flex-shrink-0">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-300"></div>
          <div className="relative">
            <Avatar user={user} size="md" showOnline={true} />
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-white text-xs font-semibold truncate w-16 mx-auto">
            {user?.username || 'User'}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-12 h-px bg-white bg-opacity-20 flex-shrink-0"></div>

      {/* Navigation Tabs */}
      <div className="flex-1 flex flex-col space-y-4 w-full px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105 group ${
                isActive
                  ? 'bg-white shadow-lg scale-105'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
              title={tab.label}
            >
              {/* Gradient background on hover */}
              {!isActive && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              )}
              
              {/* Icon */}
              <Icon className={`w-6 h-6 relative z-10 transition-colors ${
                isActive ? 'text-purple-700' : 'text-purple-200 group-hover:text-white'
              }`} />
              
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-purple-600 rounded-l shadow-lg"></span>
              )}

              {/* Tooltip on hover (desktop only) */}
              <span className="hidden xl:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                {tab.label}
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-12 h-px bg-white bg-opacity-20 flex-shrink-0"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="p-3 text-purple-200 hover:text-white hover:bg-red-500 hover:bg-opacity-30 rounded-xl transition-all duration-300 transform hover:scale-105 group relative flex-shrink-0"
        title="Logout"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <LogOut className="w-6 h-6 relative z-10" />
        
        {/* Tooltip */}
        <span className="hidden xl:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
          Logout
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
        </span>
      </button>

      {/* Decorative glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default Sidebar;
