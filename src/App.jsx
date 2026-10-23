import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NewScreening from './pages/NewScreening';
import Dashboard from './pages/Dashboard';
import SourceListsPage from './pages/SourceListsPage';
import { apiUrl } from './config/api';

export default function App() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState('new-screening'); // 'new-screening' | 'dashboard' | 'source-lists'
  const [activeCaseResult, setActiveCaseResult] = useState(null);
  const [cases, setCases] = useState([]);
  const [sourceLists, setSourceLists] = useState({
    lastCheckDate: todayStr,
    sources: {
      OFAC: { name: 'OFAC Sanctions Search (US Treasury )', status: 'ACTIVE', downloadDate: todayStr, timestamp: new Date().toISOString() },
      UN: { name: 'UN Security Council Consolidated List', status: 'ACTIVE', downloadDate: todayStr, timestamp: new Date().toISOString() },
      UAE: { name: 'UAE IEC Local Terrorist & Sanctions List', status: 'ACTIVE', downloadDate: todayStr, timestamp: new Date().toISOString() }
    }
  });
  const [refreshingLists, setRefreshingLists] = useState(false);

  useEffect(() => {
    fetchCases();
    fetchSourceListStatus();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch(apiUrl('/api/screenings'));
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    } catch (err) {
      console.warn('Could not fetch cases:', err);
    }
  };

  const fetchSourceListStatus = async () => {
    try {
      const res = await fetch(apiUrl('/api/source-lists/status'));
      if (res.ok) {
        const data = await res.json();
        if (data.sources && Object.keys(data.sources).length > 0) {
          setSourceLists(data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch source list status:', err);
    }
  };

  const handleRefreshLists = async () => {
    setRefreshingLists(true);
    try {
      const res = await fetch(apiUrl('/api/source-lists/refresh'), { method: 'POST' });
      const data = await res.json();
      if (data.success && data.sources) {
        setSourceLists({
          lastCheckDate: todayStr,
          sources: data.sources
        });
      }
    } catch (err) {
      console.error('Failed to refresh lists:', err);
    } finally {
      setRefreshingLists(false);
    }
  };

  const handleCaseCreated = (newCase) => {
    setCases(prev => [newCase, ...prev]);
    setActiveCaseResult(newCase);
  };

  const handleViewCase = (selectedCase) => {
    setActiveCaseResult(selectedCase);
    setActiveTab('new-screening');
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px', width: '100%', flex: 1 }}>
        {activeTab === 'new-screening' && (
          <NewScreening
            sourceLists={sourceLists}
            refreshingLists={refreshingLists}
            onRefreshLists={handleRefreshLists}
            onCaseCreated={handleCaseCreated}
            initialCaseResult={activeCaseResult}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            cases={cases}
            onViewCase={handleViewCase}
            onNewScreeningClick={() => setActiveTab('new-screening')}
          />
        )}

        {activeTab === 'source-lists' && (
          <SourceListsPage
            sourceLists={sourceLists}
            refreshing={refreshingLists}
            onRefresh={handleRefreshLists}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        Screening Portal
      </footer>

    </div>
  );
}
