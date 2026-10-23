import React, { useEffect } from 'react';
import { Icons } from './Icons';
import { apiUrl } from '../config/api';

export default function PdfViewerModal({ file, caseId, onClose }) {
  if (!file || !caseId) return null;

  const viewUrl = apiUrl(`/api/screenings/${caseId}/view/${encodeURIComponent(file.filename)}`);
  const downloadUrl = apiUrl(`/api/screenings/${caseId}/download/${encodeURIComponent(file.filename)}`);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1150px',
          height: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '14px 20px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <div style={{ color: '#93c5fd', display: 'flex', alignItems: 'center' }}>
              <Icons.FilePdf />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                  {file.sourceName || 'Evidence PDF'}
                </span>
                {file.matchStatus === 'POTENTIAL_MATCH' ? (
                  <span className="badge-match" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                    FLAGGED
                  </span>
                ) : (
                  <span className="badge-clear" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                    CLEARED
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#94a3b8',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {file.filename}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Open in new tab */}
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                borderColor: '#334155'
              }}
              title="Open full page in new window"
            >
              <Icons.ExternalLink />
              <span style={{ marginLeft: '4px' }}>New Tab</span>
            </a>

            {/* Direct Download */}
            <a
              href={downloadUrl}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
              title="Download file to computer"
            >
              <Icons.Download />
              <span style={{ marginLeft: '4px' }}>Download PDF</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
                marginLeft: '6px',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              title="Close viewer (Esc)"
            >
              <Icons.X />
            </button>
          </div>
        </div>

        {/* Modal Iframe Content */}
        <div style={{ flex: 1, backgroundColor: '#334155', position: 'relative' }}>
          <iframe
            src={viewUrl}
            title={file.filename}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}
