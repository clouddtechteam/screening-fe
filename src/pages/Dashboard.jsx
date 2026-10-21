import React from 'react';
import { Icons } from '../components/Icons';

export default function Dashboard({ cases, onViewCase, onNewScreeningClick }) {
  const totalCases = cases.length;
  const clearedCases = cases.filter(c => c.overallStatus === 'PASSED_CLEARED').length;
  const flaggedCases = cases.filter(c => c.overallStatus === 'FLAGGED_FOR_REVIEW').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header & Quick Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Compliance Audit & Screening Dashboard</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Overview of client and shareholder AML/sanctions screenings and evidence records.
          </p>
        </div>

        <button
          onClick={onNewScreeningClick}
          className="btn-primary"
        >
          <Icons.PlusCircle />
          <span>Screen New Client</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        <div className="white-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Total Screenings Run
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{totalCases}</div>
          <div style={{ fontSize: '12px', color: '#1d4ed8', marginTop: '4px' }}>Standard 4-source dossiers</div>
        </div>

        <div className="white-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Cleared / No Match
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669' }}>{clearedCases}</div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>Passes automatic check</div>
        </div>

        <div className="white-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Flagged For Review
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626' }}>{flaggedCases}</div>
          <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>Potential matches detected</div>
        </div>

        <div className="white-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Official Lists Status
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1d4ed8' }}>3 / 3</div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>OFAC, UN & UAE Active</div>
        </div>

      </div>

      {/* Screenings Cases Table */}
      <section className="white-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
            Historical Screening Records
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Showing {cases.length} completed cases
          </span>
        </div>

        {cases.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
            No background screening cases recorded yet. Click &quot;Screen New Client&quot; to begin.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '10px 14px' }}>Subject Name</th>
                  <th style={{ padding: '10px 14px' }}>Type</th>
                  <th style={{ padding: '10px 14px' }}>Reference</th>
                  <th style={{ padding: '10px 14px' }}>Check Date</th>
                  <th style={{ padding: '10px 14px' }}>Result</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#0f172a' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{c.subjectName}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{c.subjectType}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{c.clientRef || '—'}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{c.checkDate}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {c.overallStatus === 'PASSED_CLEARED' ? (
                        <span className="badge-clear">Cleared</span>
                      ) : (
                        <span className="badge-match">Review</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => onViewCase(c)}
                          className="btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '11.5px' }}
                        >
                          View 4 PDFs
                        </button>
                        <a
                          href={`/api/screenings/${c.id}/download-zip`}
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '11.5px', color: '#1d4ed8' }}
                          title="Download ZIP"
                        >
                          <Icons.ZipArchive />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
