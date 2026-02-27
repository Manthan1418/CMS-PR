import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getPageContent } from './services/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './pages/AdminPanel';
import './App.css';

// Main website component
const Website = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPageData();
    
    // Auto-refresh every 30 seconds to get updates
    // const interval = setInterval(fetchPageData, 30000);
    // return () => clearInterval(interval);
  }, []);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const data = await getPageContent('home');
      console.log('Fetched page data:', data);
      console.log('Hero data:', data?.hero);
      console.log('Hero title:', data?.hero?.title);
      setPageData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load page content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar 
        logo={pageData?.navbar?.logo}
        links={pageData?.navbar?.links}
      />

      <main>
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading content...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={fetchPageData}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <section id="home">
              <Hero
                title={pageData?.hero?.title}
                subtitle={pageData?.hero?.subtitle}
                ctaText={pageData?.hero?.ctaText}
                ctaLink={pageData?.hero?.ctaLink}
                backgroundImage={pageData?.hero?.backgroundImage}
              />
            </section>

            <section id="about">
              <About
                title={pageData?.about?.title}
                content={pageData?.about?.content}
                imageUrl={pageData?.about?.imageUrl}
              />
            </section>

            <section id="services">
              <Services
                title={pageData?.services?.title}
                services={pageData?.services?.items}
              />
            </section>

            <section id="contact">
              <Contact
                title={pageData?.contact?.title}
                description={pageData?.contact?.description}
                email={pageData?.contact?.email}
                phone={pageData?.contact?.phone}
                address={pageData?.contact?.address}
              />
            </section>
          </>
        )}
      </main>

      <Footer
        companyName={pageData?.footer?.companyName}
        copyright={pageData?.footer?.copyright}
        socialLinks={pageData?.footer?.socialLinks}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Website />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
