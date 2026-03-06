import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPageContent } from '../services/api';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import Footer from './Footer';
import Navbar from './Navbar';
import SectionRenderer from './SectionRenderer';

const DynamicPage = () => {
  const { pageName } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPageContent(pageName || 'home');
        console.log(`Loading page: ${pageName || 'home'}`, data);
        setPageData(data);
      } catch (err) {
        setError('Failed to load page content');
        console.error('Error loading page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageName]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!pageData) {
    return <div>No content available.</div>;
  }

  const { navbar, footer, metadata, sections = {} } = pageData;

  // Get sections order from metadata or use default order
  const sectionsOrder = metadata?.sections ||
    ['hero', 'about', 'services', 'contact'];

  return (
    <div className="app">
      <Navbar logo={navbar?.logo} links={navbar?.links} />
      <main>
        {/* Render sections in the order specified in metadata */}
        {sectionsOrder.map((sectionName) => {
          if (sections[sectionName]) {
            return (
              <SectionRenderer
                key={sectionName}
                sectionName={sectionName}
                sectionData={sections[sectionName]}
              />
            );
          }
          return null;
        })}
      </main>
      <Footer
        companyName={footer?.companyName}
        copyright={footer?.copyright}
        socialLinks={footer?.socialLinks}
      />
    </div>
  );
};

export default DynamicPage;
