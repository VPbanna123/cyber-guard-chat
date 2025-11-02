
// export default ContactItem;
import Avatar from '../common/Avatar';
import { formatTime, truncateText } from '../../utils/helper';
import { useSocket } from '../../context/SocketContext';
import { CheckCheck } from 'lucide-react';

const ContactItem = ({ contact, lastMessage, onClick, isActive = false, isGroup = false }) => {
  const { onlineUsers } = useSocket();
  const isOnline = !isGroup && onlineUsers.has(contact._id || contact.id);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer transition-all duration-200 relative ${
        isActive 
          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600' 
          : 'hover:bg-gray-50 active:bg-gray-100'
      }`}
    >
      {/* Avatar with gradient ring for active */}
      <div className="relative flex-shrink-0">
        {isActive && (
          <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-75 blur"></div>
        )}
        <div className="relative">
          <Avatar user={contact} size="sm" showOnline={isOnline} className="sm:w-12 sm:h-12" />
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`font-semibold truncate text-sm sm:text-base ${
            isActive ? 'text-purple-900' : 'text-gray-800'
          }`}>
            {contact.name || contact.username}
          </h4>
          {lastMessage && (
            <span className={`text-xs flex-shrink-0 ml-2 ${
              isActive ? 'text-purple-600 font-medium' : 'text-gray-500'
            }`}>
              {formatTime(lastMessage.createdAt)}
            </span>
          )}
        </div>

        {/* Last Message or Status */}
        {lastMessage ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {lastMessage.isSent && (
                <CheckCheck className={`w-3 h-3 flex-shrink-0 ${
                  lastMessage.isRead ? 'text-blue-500' : 'text-gray-400'
                }`} />
              )}
              <p className={`text-xs sm:text-sm truncate ${
                isActive ? 'text-purple-700' : 'text-gray-600'
              }`}>
                {truncateText(lastMessage.content, 30)}
              </p>
            </div>
            {lastMessage.unreadCount > 0 && (
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full px-1.5 sm:px-2 py-0.5 flex-shrink-0 shadow-md">
                {lastMessage.unreadCount > 99 ? '99+' : lastMessage.unreadCount}
              </span>
            )}
          </div>
        ) : (
          <p className={`text-xs sm:text-sm ${
            isActive ? 'text-purple-600' : 'text-gray-500'
          }`}>
            {isOnline ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </span>
            ) : (
              'Tap to start chatting'
            )}
          </p>
        )}
      </div>

      {/* Active Indicator Dot */}
      {isActive && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default ContactItem;
