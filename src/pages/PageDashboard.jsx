import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { alertAPI } from '../services/api';
import { AlertTriangle, Shield, Users, TrendingUp, ArrowLeft } from 'lucide-react';

const ParentDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const socket = getSocket();

  useEffect(() => {
    console.log('🚀 ParentDashboard mounted');
    console.log('Socket:', socket);
    
    loadAlerts();
    loadStats();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (socket) {
      console.log('📡 Emitting join:parent-dashboard');
      socket.emit('join:parent-dashboard');

      socket.on('alert:new', (data) => {
        console.log('🚨🚨🚨 NEW ALERT RECEIVED IN FRONTEND! 🚨🚨🚨');
        console.log('Alert data:', data);
        
        setAlerts(prev => [data.alert, ...prev]);
        
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1,
          critical: data.alert.severity === 'critical' ? prev.critical + 1 : prev.critical
        }));

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⚠️ Cyberbullying Alert', {
            body: `${data.alert.bully?.username} → ${data.alert.victim?.username}`,
            icon: '/alert-icon.png'
          });
        }
      });
    } else {
      console.warn('⚠️ Socket not initialized');
    }

    return () => {
      if (socket) {
        socket.off('alert:new');
      }
    };
  }, [socket]);

  const loadAlerts = async () => {
    try {
      console.log('📥 Loading alerts...');
      setLoading(true);
      const response = await alertAPI.getAll();
      console.log('Alerts loaded:', response.data);
      
      if (response.data.success) {
        setAlerts(response.data.alerts);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('📊 Loading stats...');
      const response = await alertAPI.getStats();
      console.log('Stats loaded:', response.data);
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleReviewAlert = async (alertId, status) => {
    try {
      console.log(`⚙️ Updating alert ${alertId} to ${status}`);
      await alertAPI.updateStatus(alertId, status);
      loadAlerts();
      loadStats();
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      medium: 'bg-orange-100 text-orange-800 border-orange-300',
      high: 'bg-red-100 text-red-800 border-red-300',
      critical: 'bg-red-600 text-white border-red-700'
    };
    return colors[severity] || 'bg-gray-100';
  };

  const getBullyingIcon = (type) => {
    const icons = {
      harassment: '🗣️',
      threatening: '⚠️',
      sexual: '🚫',
      exclusion: '😔',
      cyberstalking: '👁️',
      flaming: '🔥',
      general_harassment: '⚡'
    };
    return icons[type] || '⚠️';
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'pending') return alert.status === 'pending';
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col scroll-auto">
      {/* Header - Fixed at top */}
      <div className="bg-white shadow-xl p-6 border-l-4 border-purple-600 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/chat')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-purple-600" />
                  Parent Safety Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Real-time cyberbullying detection</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Real-time Monitoring</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-semibold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-scroll scrollbar scrollbar-thumb-purple-400 scrollbar-track-gray-200">
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Alerts</p>
                      <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-full">
                      <AlertTriangle className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                      <p className="text-4xl font-bold text-orange-600 mt-2">{stats.pending}</p>
                    </div>
                    <div className="bg-orange-100 p-4 rounded-full">
                      <Users className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Critical</p>
                      <p className="text-4xl font-bold text-red-600 mt-2">{stats.critical}</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-full">
                      <Shield className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">This Week</p>
                      <p className="text-4xl font-bold text-purple-600 mt-2">
                        {alerts.filter(a => new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-full">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    filter === 'all' 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Alerts ({alerts.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    filter === 'pending' 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending ({stats?.pending || 0})
                </button>
                <button
                  onClick={() => setFilter('critical')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    filter === 'critical' 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Critical ({stats?.critical || 0})
                </button>
              </div>
            </div>

            {/* Alerts List - Scrollable with Visible Scrollbar */}
            <div className="space-y-4 pb-8">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading alerts...</p>
                </div>
              ) : filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <div key={alert._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border-l-4" style={{
                    borderLeftColor: alert.severity === 'critical' ? '#dc2626' : 
                                     alert.severity === 'high' ? '#ea580c' : 
                                     alert.severity === 'medium' ? '#f59e0b' : '#fbbf24'
                  }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Top Row: Severity, Type, Time */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 whitespace-nowrap ${getSeverityColor(alert.severity)}`}>
                            {alert.severity?.toUpperCase()}
                          </span>
                          <span className="text-2xl">{getBullyingIcon(alert.bullyingType)}</span>
                          <span className="text-lg font-semibold text-gray-800">
                            {alert.bullyingType?.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 ml-auto">
                            {new Date(alert.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {/* From → To */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                          <div className="flex items-center gap-3 justify-center flex-wrap">
                            <span className="text-lg font-bold text-red-600">
                              {alert.bully?.username || 'Unknown'}
                            </span>
                            <span className="text-2xl text-gray-400">→</span>
                            <span className="text-lg font-bold text-blue-600">
                              {alert.victim?.username || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        {/* Confidence & Status */}
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                          <span className="text-gray-600">
                            Confidence: <span className="font-bold text-lg">{(alert.confidence * 100).toFixed(1)}%</span>
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className={`font-bold text-lg ${
                            alert.status === 'pending' ? 'text-orange-600' : 
                            alert.status === 'resolved' ? 'text-green-600' : 
                            'text-gray-600'
                          }`}>
                            {alert.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {alert.status === 'pending' && (
                        <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleReviewAlert(alert._id, 'resolved')}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all whitespace-nowrap"
                          >
                            ✓ Resolve
                          </button>
                          <button
                            onClick={() => handleReviewAlert(alert._id, 'dismissed')}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-all whitespace-nowrap"
                          >
                            ✗ Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                  <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Alerts</h3>
                  <p className="text-gray-500">No cyberbullying detected yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind CSS for Scrollbar */}
      <style>{`
        .scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar::-webkit-scrollbar-thumb {
          background: #a78bfa;
          border-radius: 10px;
        }
        .scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9370db;
        }
      `}</style>
    </div>
  );
};

export default ParentDashboard;
