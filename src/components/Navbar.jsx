import React, { useState } from 'react';
import { Icons } from './Icons';
import scLogo from '../assets/sclogo.png';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: '12px',
      zIndex: 50,
      maxWidth: '1280px',
      margin: '12px auto 0 auto',
      padding: '0 16px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .navbar-desktop-nav {
          display: flex !important;
        }
        .navbar-desktop-action {
          display: block !important;
        }
        .navbar-mobile-toggle {
          display: none !important;
        }
        .brand-subtitle {
          display: block;
        }

        @media (max-width: 880px) {
          .navbar-desktop-nav {
            display: none !important;
          }
          .navbar-desktop-action {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
          }
        }

        @media (max-width: 480px) {
          .brand-subtitle {
            display: none;
          }
          .brand-logo-img {
            height: 38px !important;
            max-height: 38px !important;
          }
          .brand-title {
            font-size: 13.5px !important;
          }
        }
      `}</style>

      {/* Main Floating Pill Header */}
      <div style={{
        backgroundColor: '#000000',
        borderRadius: '9999px',
        padding: '8px 18px 8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        minHeight: '62px',
        boxSizing: 'border-box'
      }}>
        {/* Brand with Larger Original Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => handleNavClick('new-screening')}
        >
          <img
            src={scLogo}
            alt="EER Compliance"
            className="brand-logo-img"
            style={{
              height: '46px',
              width: 'auto',
              maxHeight: '46px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              className="brand-title"
              style={{
                fontSize: '15.5px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.15
              }}
            >
              EER Compliance
            </span>
            <span
              className="brand-subtitle"
              style={{
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: '0.07em',
                textTransform: 'uppercase'
              }}
            >
              Sanctions &amp; Adverse Media
            </span>
          </div>
        </div>

        {/* Center Pill Navigation Container (Desktop) */}
        <nav
          className="navbar-desktop-nav"
          style={{
            backgroundColor: '#171717',
            borderRadius: '9999px',
            padding: '4px 6px',
            alignItems: 'center',
            gap: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <button
            onClick={() => handleNavClick('new-screening')}
            style={{
              backgroundColor: activeTab === 'new-screening' ? '#262626' : 'transparent',
              color: activeTab === 'new-screening' ? '#ffffff' : '#a1a1aa',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'new-screening') {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'new-screening') {
                e.currentTarget.style.color = '#a1a1aa';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Icons.PlusCircle />
            <span>New Screening</span>
          </button>

          <button
            onClick={() => handleNavClick('dashboard')}
            style={{
              backgroundColor: activeTab === 'dashboard' ? '#262626' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : '#a1a1aa',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'dashboard') {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'dashboard') {
                e.currentTarget.style.color = '#a1a1aa';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Icons.LayoutDashboard />
            <span>Audit Cases</span>
          </button>

          <button
            onClick={() => handleNavClick('source-lists')}
            style={{
              backgroundColor: activeTab === 'source-lists' ? '#262626' : 'transparent',
              color: activeTab === 'source-lists' ? '#ffffff' : '#a1a1aa',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'source-lists') {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'source-lists') {
                e.currentTarget.style.color = '#a1a1aa';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Icons.Database />
            <span>Official Lists</span>
          </button>
        </nav>

        {/* Right White Pill Action Button (Desktop) */}
        <div className="navbar-desktop-action">
          <button
            onClick={() => handleNavClick('new-screening')}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 8px rgba(255, 255, 255, 0.15)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            <Icons.PlusCircle />
            <span>Screen Client</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          style={{
            backgroundColor: '#1c1c1e',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            cursor: 'pointer',
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
        >
          {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Mobile Drawer / Dropdown Panel */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0a0a0a',
          borderRadius: '24px',
          padding: '16px',
          marginTop: '8px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={() => handleNavClick('new-screening')}
            style={{
              backgroundColor: activeTab === 'new-screening' ? '#262626' : 'transparent',
              color: activeTab === 'new-screening' ? '#ffffff' : '#cbd5e1',
              padding: '12px 18px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <Icons.PlusCircle />
            <span>New Screening</span>
          </button>

          <button
            onClick={() => handleNavClick('dashboard')}
            style={{
              backgroundColor: activeTab === 'dashboard' ? '#262626' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : '#cbd5e1',
              padding: '12px 18px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <Icons.LayoutDashboard />
            <span>Audit Cases</span>
          </button>

          <button
            onClick={() => handleNavClick('source-lists')}
            style={{
              backgroundColor: activeTab === 'source-lists' ? '#262626' : 'transparent',
              color: activeTab === 'source-lists' ? '#ffffff' : '#cbd5e1',
              padding: '12px 18px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <Icons.Database />
            <span>Official Lists</span>
          </button>

          <div style={{ paddingTop: '6px' }}>
            <button
              onClick={() => handleNavClick('new-screening')}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                borderRadius: '9999px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)'
              }}
            >
              <Icons.PlusCircle />
              <span>Screen Client</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
