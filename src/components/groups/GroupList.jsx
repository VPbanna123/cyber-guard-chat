
// export default GroupList;
import { useState, useEffect } from 'react';
import { Plus, Users, Sparkles } from 'lucide-react';
import { groupAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import GroupItem from './GroupItem';
import CreateGroup from './CreateGroup';
import Loader from '../common/Loader';

const GroupList = ({ onSelectGroup, selectedGroup }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getUserGroups(user.id);
      if (response.data.success) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
    onSelectGroup(newGroup);
  };

  return (
    <>
      <div className="w-full sm:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col shadow-lg h-screen">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 sm:p-4 lg:p-5 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              Groups
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Group Counter */}
              <div className="flex items-center gap-1.5 bg-white bg-opacity-20 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-black text-xs font-semibold">
                  {groups.length}
                </span>
              </div>
              
              {/* Create Button */}
              <button
                onClick={() => setShowCreateGroup(true)}
                className="bg-gray-700 bg-opacity-20 hover:bg-opacity-30 text-white p-2 sm:p-2.5 rounded-xl transition-all transform hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
                title="Create new group"
                aria-label="Create new group"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="text-purple-100 text-xs sm:text-sm">
            Connect with multiple people at once
          </p>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12">
              <Loader size="lg" />
              <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading groups...</p>
            </div>
          ) : groups.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {groups.map((group) => (
                <GroupItem
                  key={group._id}
                  group={group}
                  onClick={() => onSelectGroup(group)}
                  isActive={selectedGroup?._id === group._id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 relative">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1.5 sm:p-2 border-2 border-white shadow-lg animate-bounce">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
              <h3 className="text-gray-800 font-bold text-base sm:text-lg mb-2">
                No groups yet
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
                Create your first group and start collaborating
              </p>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Group
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal - Fixed positioning outside container */}
      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </>
  );
};

export default GroupList;
