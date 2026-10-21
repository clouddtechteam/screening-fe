import React from 'react';
import { Icons } from './Icons';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('new-screening')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: '#1d4ed8',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)'
          }}>
            <Icons.Shield />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              VERITAS <span style={{ color: '#1d4ed8', fontWeight: 600 }}>COMPLIANCE</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
              Client & Shareholder Due Diligence Screening
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('new-screening')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'new-screening' ? '1px solid #bfdbfe' : '1px solid transparent',
              backgroundColor: activeTab === 'new-screening' ? '#eff6ff' : 'transparent',
              color: activeTab === 'new-screening' ? '#1d4ed8' : '#334155'
            }}
          >
            <Icons.PlusCircle />
            <span>New Screening</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'dashboard' ? '1px solid #bfdbfe' : '1px solid transparent',
              backgroundColor: activeTab === 'dashboard' ? '#eff6ff' : 'transparent',
              color: activeTab === 'dashboard' ? '#1d4ed8' : '#334155'
            }}
          >
            <Icons.LayoutDashboard />
            <span>Audit Cases</span>
          </button>

          <button
            onClick={() => setActiveTab('source-lists')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'source-lists' ? '1px solid #bfdbfe' : '1px solid transparent',
              backgroundColor: activeTab === 'source-lists' ? '#eff6ff' : 'transparent',
              color: activeTab === 'source-lists' ? '#1d4ed8' : '#334155'
            }}
          >
            <Icons.Database />
            <span>Official Lists</span>
          </button>
        </nav>

        {/* System Active Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-clear">
            <Icons.CheckCircle />
            <span>Engines Active</span>
          </span>
        </div>
      </div>
    </header>
  );
}
