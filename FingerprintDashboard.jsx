import React, { useState, useEffect } from 'react';
import { Fingerprint, Users, Activity, AlertCircle, UserPlus, Trash2, RefreshCw, Smartphone, Bell, CheckCircle, XCircle } from 'lucide-react';

export default function FingerprintDashboard() {
  const [devices, setDevices] = useState([
    {
      id: '8C128B2B1838',
      name: 'Main Entrance',
      status: 'online',
      lastSeen: new Date(),
      users: 5
    }
  ]);
  
  const [selectedDevice, setSelectedDevice] = useState('8C128B2B1838');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', phone: '+250780146487', cardId: 'CARD001', enrolled: true },
    { id: 2, name: 'Jane Smith', phone: '+250781234567', cardId: 'CARD002', enrolled: true },
    { id: 3, name: 'Bob Wilson', phone: '+250782345678', cardId: 'CARD003', enrolled: true }
  ]);
  
  const [accessLogs, setAccessLogs] = useState([
    { id: 1, userName: 'John Doe', cardId: 'CARD001', granted: true, timestamp: new Date(Date.now() - 300000) },
    { id: 2, userName: 'Jane Smith', cardId: 'CARD002', granted: true, timestamp: new Date(Date.now() - 600000) },
    { id: 3, userName: 'Unknown', cardId: 'N/A', granted: false, timestamp: new Date(Date.now() - 900000) },
    { id: 4, userName: 'Bob Wilson', cardId: 'CARD003', granted: true, timestamp: new Date(Date.now() - 1200000) }
  ]);
  
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Device 8C128B2B1838 connected', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, type: 'warning', message: 'Failed access attempt detected', timestamp: new Date(Date.now() - 900000) }
  ]);
  
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    id: '',
    name: '',
    phone: '',
    cardId: ''
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 3,
    activeDevices: 1,
    todayAccess: 12,
    failedAttempts: 2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => ({
        ...d,
        lastSeen: new Date()
      })));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleEnrollUser = () => {
    if (!enrollForm.name || !enrollForm.phone || !enrollForm.cardId || !enrollForm.id) {
      alert('Please fill all fields');
      return;
    }
    
    // In real implementation, send HTTP request to device
    const newUser = {
      id: parseInt(enrollForm.id),
      name: enrollForm.name,
      phone: enrollForm.phone,
      cardId: enrollForm.cardId,
      enrolled: false
    };
    
    setUsers(prev => [...prev, newUser]);
    setShowEnrollModal(false);
    setEnrollForm({ id: '', name: '', phone: '', cardId: '' });
    
    // Show success notification
    addNotification('info', `Enrollment started for ${enrollForm.name}. Please scan fingerprint on device.`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addNotification('success', 'User deleted successfully');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear ALL users? This cannot be undone!')) {
      setUsers([]);
      addNotification('warning', 'All users cleared from system');
    }
  };

  const addNotification = (type, message) => {
    const newNotif = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Fingerprint className="text-purple-400 w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-white">Smart Security System</h1>
                <p className="text-purple-300 text-sm">Fingerprint Access Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="text-purple-400 w-6 h-6 cursor-pointer hover:text-purple-300" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium">Admin User</p>
                <p className="text-purple-300 text-xs">Device: {selectedDevice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {['dashboard', 'users', 'logs', 'devices'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800/50 text-purple-300 hover:bg-slate-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Total Users</p>
                    <p className="text-white text-3xl font-bold mt-1">{stats.totalUsers}</p>
                  </div>
                  <Users className="text-purple-300 w-12 h-12 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Active Devices</p>
                    <p className="text-white text-3xl font-bold mt-1">{stats.activeDevices}</p>
                  </div>
                  <Smartphone className="text-green-300 w-12 h-12 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Today's Access</p>
                    <p className="text-white text-3xl font-bold mt-1">{stats.todayAccess}</p>
                  </div>
                  <Activity className="text-blue-300 w-12 h-12 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200 text-sm">Failed Attempts</p>
                    <p className="text-white text-3xl font-bold mt-1">{stats.failedAttempts}</p>
                  </div>
                  <AlertCircle className="text-red-300 w-12 h-12 opacity-80" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Recent Access Logs</h2>
              <div className="space-y-3">
                {accessLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {log.granted ? (
                        <CheckCircle className="text-green-400 w-6 h-6" />
                      ) : (
                        <XCircle className="text-red-400 w-6 h-6" />
                      )}
                      <div>
                        <p className="text-white font-medium">{log.userName}</p>
                        <p className="text-purple-300 text-sm">Card: {log.cardId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${log.granted ? 'text-green-400' : 'text-red-400'}`}>
                        {log.granted ? 'Granted' : 'Denied'}
                      </p>
                      <p className="text-purple-400 text-xs">{formatTime(log.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4">System Notifications</h2>
              <div className="space-y-2">
                {notifications.slice(0, 5).map(notif => (
                  <div key={notif.id} className="p-3 bg-slate-700/50 rounded-lg flex items-start space-x-3">
                    <Bell className={`w-5 h-5 mt-0.5 ${
                      notif.type === 'success' ? 'text-green-400' :
                      notif.type === 'warning' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{notif.message}</p>
                      <p className="text-purple-400 text-xs mt-1">{formatTime(notif.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Enrolled Users</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2 transition-colors shadow-lg shadow-purple-500/50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll New User</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <div key={user.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{user.name}</h3>
                        <p className="text-purple-300 text-sm">ID: {user.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="text-purple-400 w-4 h-4" />
                      <span className="text-purple-200 text-sm">{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fingerprint className="text-purple-400 w-4 h-4" />
                      <span className="text-purple-200 text-sm">Card: {user.cardId}</span>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      user.enrolled 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.enrolled ? 'Enrolled' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Access Logs</h2>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Time</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Card ID</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map(log => (
                    <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-purple-200">{log.timestamp.toLocaleString()}</td>
                      <td className="py-3 px-4 text-white">{log.userName}</td>
                      <td className="py-3 px-4 text-purple-300">{log.cardId}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          log.granted 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {log.granted ? 'Granted' : 'Denied'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Connected Devices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.map(device => (
                <div key={device.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{device.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      device.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-purple-300">Device ID: <span className="text-white">{device.id}</span></p>
                    <p className="text-purple-300">Status: <span className={device.status === 'online' ? 'text-green-400' : 'text-red-400'}>{device.status}</span></p>
                    <p className="text-purple-300">Enrolled Users: <span className="text-white">{device.users}</span></p>
                    <p className="text-purple-300">Last Seen: <span className="text-white">{formatTime(device.lastSeen)}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enroll User Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-purple-500/20">
            <h3 className="text-2xl font-bold text-white mb-6">Enroll New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-300 text-sm mb-2">User ID (1-20)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={enrollForm.id}
                  onChange={(e) => setEnrollForm({...enrollForm, id: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/20 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter ID (1-20)"
                />
              </div>
              <div>
                <label className="block text-purple-300 text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  value={enrollForm.name}
                  onChange={(e) => setEnrollForm({...enrollForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/20 focus:border-purple-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-purple-300 text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={enrollForm.phone}
                  onChange={(e) => setEnrollForm({...enrollForm, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/20 focus:border-purple-500 focus:outline-none"
                  placeholder="+250780146487"
                />
              </div>
              <div>
                <label className="block text-purple-300 text-sm mb-2">Card ID</label>
                <input
                  type="text"
                  value={enrollForm.cardId}
                  onChange={(e) => setEnrollForm({...enrollForm, cardId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/20 focus:border-purple-500 focus:outline-none"
                  placeholder="CARD001"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollUser}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg shadow-purple-500/50"
              >
                Start Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
