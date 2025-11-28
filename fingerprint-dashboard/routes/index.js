const express = require('express');
const router = express.Router();

// Mock data
let devices = [
  {
    id: '8C128B2B1838',
    name: 'Main Entrance',
    status: 'online',
    lastSeen: new Date(),
    users: 5
  }
];

let users = [
  { id: 1, name: 'John Doe', phone: '+250780146487', cardId: 'CARD001', enrolled: true },
  { id: 2, name: 'Jane Smith', phone: '+250781234567', cardId: 'CARD002', enrolled: true },
  { id: 3, name: 'Bob Wilson', phone: '+250782345678', cardId: 'CARD003', enrolled: true }
];

let accessLogs = [
  { id: 1, userName: 'John Doe', cardId: 'CARD001', granted: true, timestamp: new Date(Date.now() - 300000) },
  { id: 2, userName: 'Jane Smith', cardId: 'CARD002', granted: true, timestamp: new Date(Date.now() - 600000) },
  { id: 3, userName: 'Unknown', cardId: 'N/A', granted: false, timestamp: new Date(Date.now() - 900000) },
  { id: 4, userName: 'Bob Wilson', cardId: 'CARD003', granted: true, timestamp: new Date(Date.now() - 1200000) }
];

let notifications = [
  { id: 1, type: 'success', message: 'Device 8C128B2B1838 connected', timestamp: new Date(Date.now() - 3600000) },
  { id: 2, type: 'warning', message: 'Failed access attempt detected', timestamp: new Date(Date.now() - 900000) }
];

// Helper functions
const formatTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

const addNotification = (type, message) => {
  const newNotif = {
    id: Date.now(),
    type,
    message,
    timestamp: new Date()
  };
  notifications = [newNotif, ...notifications].slice(0, 10);
};

// Routes
router.get('/', (req, res) => {
  const activeTab = req.query.tab || 'dashboard';
  const showModal = req.query.modal === 'enroll';
  
  const stats = {
    totalUsers: users.length,
    activeDevices: devices.filter(d => d.status === 'online').length,
    todayAccess: accessLogs.filter(log => 
      new Date(log.timestamp).toDateString() === new Date().toDateString()
    ).length,
    failedAttempts: accessLogs.filter(log => !log.granted).length
  };

  res.render('index', {
    devices,
    users,
    accessLogs,
    notifications,
    stats,
    activeTab,
    showModal,
    formatTime,
    selectedDevice: devices[0]?.id || ''
  });
});

router.post('/users/enroll', (req, res) => {
  const { id, name, phone, cardId } = req.body;
  
  if (!id || !name || !phone || !cardId) {
    addNotification('error', 'Please fill all fields');
    return res.redirect('/?tab=users&modal=enroll');
  }
  
  // Check if ID already exists
  if (users.find(u => u.id === parseInt(id))) {
    addNotification('error', `User ID ${id} already exists`);
    return res.redirect('/?tab=users&modal=enroll');
  }
  
  const newUser = {
    id: parseInt(id),
    name,
    phone,
    cardId,
    enrolled: false
  };
  
  users.push(newUser);
  addNotification('info', `Enrollment started for ${name}. Please scan fingerprint on device.`);
  res.redirect('/?tab=users');
});

router.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    users = users.filter(u => u.id !== userId);
    addNotification('success', `User ${user.name} deleted successfully`);
  }
  
  res.redirect('/?tab=users');
});

router.post('/users/clear', (req, res) => {
  if (users.length > 0) {
    const userCount = users.length;
    users = [];
    addNotification('warning', `All ${userCount} users cleared from system`);
  }
  res.redirect('/?tab=users');
});

router.post('/logs/refresh', (req, res) => {
  // Simulate new log entry
  const randomUsers = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Johnson', 'Mike Brown'];
  const newLog = {
    id: accessLogs.length + 1,
    userName: randomUsers[Math.floor(Math.random() * randomUsers.length)],
    cardId: 'CARD' + (Math.floor(Math.random() * 1000)).toString().padStart(3, '0'),
    granted: Math.random() > 0.3,
    timestamp: new Date()
  };
  accessLogs.unshift(newLog);
  
  if (!newLog.granted) {
    addNotification('warning', `Failed access attempt by ${newLog.userName}`);
  } else {
    addNotification('success', `Access granted to ${newLog.userName}`);
  }
  
  res.redirect('/?tab=logs');
});

// Update device status
router.post('/devices/refresh', (req, res) => {
  devices = devices.map(device => ({
    ...device,
    lastSeen: new Date(),
    status: Math.random() > 0.2 ? 'online' : 'offline', // 80% chance online
    users: Math.max(1, Math.floor(Math.random() * 10)) // Random user count
  }));
  
  addNotification('info', 'Device status updated');
  res.redirect('/?tab=devices');
});

module.exports = router;
