// Admin Storage - File-based data management
const fs = require('fs');
const path = require('path');

const storageDir = path.join(__dirname, '../storage');
const adminLogsPath = path.join(storageDir, 'admin-logs.json');
const reportsPath = path.join(storageDir, 'reports.json');
const settingsPath = path.join(storageDir, 'settings.json');

// Initialize storage directories
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Admin Logs Management
const adminLogs = {
  add: (logEntry) => {
    try {
      let logs = [];
      if (fs.existsSync(adminLogsPath)) {
        logs = JSON.parse(fs.readFileSync(adminLogsPath, 'utf8'));
      }
      logs.push({
        ...logEntry,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      fs.writeFileSync(adminLogsPath, JSON.stringify(logs, null, 2));
      return { success: true, id: logs[logs.length - 1].id };
    } catch (error) {
      console.error('Error adding admin log:', error);
      return { success: false, error: error.message };
    }
  },

  getAll: () => {
    try {
      if (fs.existsSync(adminLogsPath)) {
        return JSON.parse(fs.readFileSync(adminLogsPath, 'utf8'));
      }
      return [];
    } catch (error) {
      console.error('Error reading admin logs:', error);
      return [];
    }
  },

  clear: () => {
    try {
      if (fs.existsSync(adminLogsPath)) {
        fs.unlinkSync(adminLogsPath);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Reports Management
const reports = {
  add: (report) => {
    try {
      let allReports = [];
      if (fs.existsSync(reportsPath)) {
        allReports = JSON.parse(fs.readFileSync(reportsPath, 'utf8'));
      }
      const newReport = {
        ...report,
        timestamp: new Date().toISOString(),
        id: Date.now(),
        status: 'pending'
      };
      allReports.push(newReport);
      fs.writeFileSync(reportsPath, JSON.stringify(allReports, null, 2));
      return { success: true, report: newReport };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getAll: () => {
    try {
      if (fs.existsSync(reportsPath)) {
        return JSON.parse(fs.readFileSync(reportsPath, 'utf8'));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  resolve: (reportId, resolution) => {
    try {
      if (fs.existsSync(reportsPath)) {
        let allReports = JSON.parse(fs.readFileSync(reportsPath, 'utf8'));
        const reportIndex = allReports.findIndex(r => r.id == reportId);
        if (reportIndex !== -1) {
          allReports[reportIndex].status = 'resolved';
          allReports[reportIndex].resolution = resolution;
          fs.writeFileSync(reportsPath, JSON.stringify(allReports, null, 2));
          return { success: true };
        }
      }
      return { success: false, error: 'Report not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Settings Management
const settings = {
  get: () => {
    try {
      if (fs.existsSync(settingsPath)) {
        return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      }
      return {};
    } catch (error) {
      return {};
    }
  },

  set: (key, value) => {
    try {
      let allSettings = settings.get();
      allSettings[key] = value;
      fs.writeFileSync(settingsPath, JSON.stringify(allSettings, null, 2));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  update: (settingsObj) => {
    try {
      fs.writeFileSync(settingsPath, JSON.stringify(settingsObj, null, 2));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

module.exports = {
  adminLogs,
  reports,
  settings,
  paths: {
    storage: storageDir,
    logs: adminLogsPath,
    reports: reportsPath,
    settings: settingsPath
  }
};
