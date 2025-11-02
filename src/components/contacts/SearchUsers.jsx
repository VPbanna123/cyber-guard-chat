
// export default SearchUsers;
import { useState, useEffect } from 'react';
import { Search, X, UserPlus, Loader2 } from 'lucide-react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Loader from '../common/Loader';

const SearchUsers = ({ onSelectUser }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.searchUsers(searchQuery, user.id);
      if (response.data.success) {
        setSearchResults(response.data.users);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (selectedUser) => {
    onSelectUser(selectedUser);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 z-10 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 sm:pl-11 pr-10 py-2.5 sm:py-3 bg-white rounded-xl border-2 border-purple-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all font-medium shadow-sm text-sm sm:text-base"
        />
        {searchQuery && !loading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all z-10"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowResults(false)}
          ></div>
          
          {/* Results Container */}
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-72 sm:max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-6">
                <Loader size="md" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-gray-100">
                <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <p className="text-xs font-semibold text-purple-900">
                    {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    onClick={() => handleSelectUser(result)}
                    className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 cursor-pointer transition-all group active:bg-purple-100"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <Avatar user={result} size="sm" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate group-hover:text-purple-900 transition-colors text-sm sm:text-base">
                          {result.username}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">{result.email}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-1.5 sm:p-2 rounded-lg group-hover:scale-110 transition-transform shadow-md">
                        <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium text-sm sm:text-base">No users found</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchUsers;
