import React from 'react';
import { Icons } from './Icons';

export default function SourceListsBar({ sourceLists, refreshing, onRefresh }) {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section className="white-panel" style={{ padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #bfdbfe'
          }}>
            <Icons.Database />
          </div>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Official Sanctions & Watchlists Verification</h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Current active registers. Reuses verified daily copies or refreshes before screening.
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="btn-secondary"
          title="Verify and refresh latest official lists from UN, UAE, and OFAC portals"
          style={{ fontSize: '12.5px', padding: '7px 14px' }}
        >
          <Icons.Refresh spin={refreshing} />
          <span>{refreshing ? 'Verifying Registers...' : 'Refresh Lists'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {/* OFAC */}
        <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>OFAC Sanctions Search</span>
            <span className="badge-clear">Verified</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>Last updated: <strong style={{ color: '#0f172a' }}>{sourceLists?.sources?.OFAC?.downloadDate || todayStr}</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#64748b' }}>Portal: sanctionssearch.ofac.treas.gov</span>
              <a href="https://sanctionssearch.ofac.treas.gov/default.aspx" target="_blank" rel="noreferrer" style={{ color: '#1d4ed8' }}><Icons.ExternalLink /></a>
            </div>
          </div>
        </div>

        {/* UN */}
        <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>UN Consolidated List</span>
            <span className="badge-clear">Current</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>Last updated: <strong style={{ color: '#0f172a' }}>{sourceLists?.sources?.UN?.downloadDate || todayStr}</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#64748b' }}>Portal: main.un.org/securitycouncil</span>
              <a href="https://main.un.org/securitycouncil/en/content/un-sc-consolidated-list" target="_blank" rel="noreferrer" style={{ color: '#1d4ed8' }}><Icons.ExternalLink /></a>
            </div>
          </div>
        </div>

        {/* UAE */}
        <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>UAE Local List (IEC)</span>
            <span className="badge-clear">Current</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>Last updated: <strong style={{ color: '#0f172a' }}>{sourceLists?.sources?.UAE?.downloadDate || todayStr}</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#64748b' }}>Portal: uaeiec.gov.ae/en-us/un-page</span>
              <a href="https://www.uaeiec.gov.ae/en-us/un-page" target="_blank" rel="noreferrer" style={{ color: '#1d4ed8' }}><Icons.ExternalLink /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
