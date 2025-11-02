
// export default Header;
import { Menu, Bell, Search, MoreVertical } from 'lucide-react';

const Header = ({ title, onMenuClick, showNotifications = true }) => {
  return (
    <header className="h-16 sm:h-18 lg:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 lg:px-6 shadow-sm flex-shrink-0">
      
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 flex-shrink-0"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Title */}
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent truncate">
          {title}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
        
        {/* Search Button (Desktop) */}
        <button className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all active:scale-95">
          <Search className="w-5 h-5" />
          <span className="text-sm font-medium hidden lg:inline">Search</span>
        </button>

        {/* Search Button (Mobile) */}
        <button className="md:hidden text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all active:scale-95">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        {showNotifications && (
          <button className="relative text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </button>
        )}

        {/* More Options */}
        <button className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95">
          <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
