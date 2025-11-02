

// export default MessageList;
import { useEffect, useRef } from 'react';
import { formatTime, formatDate } from '../../utils/helper';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import { Check, CheckCheck, Download, Reply } from 'lucide-react';

const MessageList = ({ messages, typingUser = null }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // 🔥 Auto-scroll when messages change
  useEffect(() => {
    console.log('🔄 Messages updated, scrolling to bottom. Total:', messages.length);
    scrollToBottom();
  }, [messages, typingUser]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 min-h-full pb-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="space-y-3 sm:space-y-4">
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4 sm:my-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-30"></div>
                <div className="relative px-4 sm:px-5 py-1.5 sm:py-2 bg-white rounded-full text-xs sm:text-sm font-bold text-gray-700 shadow-lg border border-purple-100">
                  {date}
                </div>
              </div>
            </div>

            {/* Messages for this date */}
            {msgs.map((message) => {
              const senderId = message.sender?._id || message.sender;
              const currentUserId = user?._id || user?.id;
              
              const isSender = String(senderId) === String(currentUserId);

              return (
                <div
                  key={message._id}
                  className={`flex items-end gap-1.5 sm:gap-2 mb-3 sm:mb-4 animate-fadeIn ${
                    isSender ? 'flex-row-reverse' : ''
                  }`}
                >
                  {!isSender && (
                    <div className="flex-shrink-0">
                      <Avatar user={message.sender} size="sm" />
                    </div>
                  )}

                  <div
                    className={`group relative max-w-[75%] sm:max-w-[70%] lg:max-w-lg px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
                      isSender
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
                  >
                    {message.replyTo && (
                      <div className={`mb-2 p-2.5 rounded-lg ${
                        isSender ? 'bg-purple-600/40' : 'bg-purple-50'
                      } text-xs border-l-3 ${
                        isSender ? 'border-purple-300' : 'border-purple-500'
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Reply className="w-3 h-3" />
                          <p className={`font-bold ${isSender ? 'text-purple-100' : 'text-purple-700'}`}>
                            {message.replyTo.sender?.username}
                          </p>
                        </div>
                        <p className={`truncate ${isSender ? 'text-white/80' : 'text-gray-600'}`}>
                          {message.replyTo.content}
                        </p>
                      </div>
                    )}

                    <p className="break-words text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>

                    {message.fileUrl && (
                      <div className="mt-2 sm:mt-3">
                        {message.messageType === 'image' ? (
                          <img
                            src={message.fileUrl}
                            alt="attachment"
                            className="rounded-xl max-w-full shadow-lg hover:shadow-2xl transition-shadow cursor-pointer max-h-64 object-cover border-2 border-white/20"
                          />
                        ) : (
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2.5 rounded-lg transition-all text-sm ${
                              isSender 
                                ? 'bg-purple-600/40 hover:bg-purple-600/60' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <Download className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium truncate">
                              {message.fileName || 'Download file'}
                            </span>
                          </a>
                        )}
                      </div>
                    )}

                    <div className={`flex items-center justify-end gap-1 mt-1.5 sm:mt-2 ${
                      isSender ? 'text-purple-200' : 'text-gray-500'
                    } text-xs`}>
                      <span className="font-medium">{formatTime(message.createdAt)}</span>
                      {isSender && (
                        <span className="ml-1">
                          {message.isRead ? (
                            <CheckCheck className="w-4 h-4 text-blue-300" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}

      {typingUser && (
        <div className="flex items-end gap-1.5 sm:gap-2 animate-fadeIn mt-4">
          <Avatar user={typingUser} size="sm" />
          <div className="bg-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl rounded-bl-none shadow-lg border border-gray-100">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
};

export default MessageList;
