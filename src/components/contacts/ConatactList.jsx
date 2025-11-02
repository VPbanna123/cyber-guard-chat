
// export default ContactList;
import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ContactItem from './ContactItem';
import SearchUsers from './SearchUsers';
import Loader from '../common/Loader';
import { Users, Sparkles } from 'lucide-react';

const ContactList = ({ onSelectContact, selectedContact }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await userAPI.getAllUsers(user.id);
      if (response.data.success) {
        setContacts(response.data.users);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (selectedUser) => {
    const existingContact = contacts.find(c => c._id === selectedUser._id);
    if (!existingContact) {
      setContacts(prev => [selectedUser, ...prev]);
    }
    onSelectContact(selectedUser, false);
  };

  return (
    <div className="w-full sm:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col shadow-lg h-screen">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 sm:p-4 lg:p-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            Chats
          </h2>
          <div className="flex items-center gap-1.5 bg-white bg-opacity-20 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-black text-xs font-semibold">
              {contacts.length}
            </span>
          </div>
        </div>
        
        {/* Search Component */}
        <SearchUsers onSelectUser={handleSelectUser} />
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12">
            <Loader size="lg" />
            <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading contacts...</p>
          </div>
        ) : contacts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {contacts.map((contact) => (
              <ContactItem
                key={contact._id}
                contact={contact}
                onClick={() => onSelectContact(contact, false)}
                isActive={selectedContact?._id === contact._id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>
            <h3 className="text-gray-800 font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              No contacts yet
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              Search for users to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
