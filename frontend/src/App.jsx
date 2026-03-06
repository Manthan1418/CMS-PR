import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAllPages, getAllPagesData } from './services/api';
import DynamicPage from './components/DynamicPage';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  const [pages, setPages] = useState([]);
  const [pagesData, setPagesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesList = await getAllPages();
        const pagesFullData = await getAllPagesData();

        setPages(Array.isArray(pagesList) ? pagesList : []);
        setPagesData(pagesFullData || {});
        setError(null);
      } catch (err) {
        setError('Failed to load pages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  if (loading) {
    return <div>Loading site...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const pageNames = Array.isArray(pages) ? pages.map(p => p.name) : Object.keys(pagesData);

  return (
    <Router>
      <Routes>
        <Route path="/:pageName" element={<DynamicPage />} />
        {/* Redirect root to home if exists */}
        {pageNames.includes('home') && <Route path="/" element={<Navigate to="/home" replace />} />}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
