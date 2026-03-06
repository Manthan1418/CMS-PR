import React from 'react';
import PageManager from '../components/admin/PageManager';
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🎛️ Content Management System</h1>
        <div className="admin-actions">
          <a href="/" target="_blank" className="view-site-btn">
            View Site
          </a>
        </div>
      </div>

      <PageManager />
    </div>
  );
};

export default AdminPanel;
