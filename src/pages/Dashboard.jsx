import React, { useState, useMemo } from 'react';
import { Icons } from '../components/Icons';
import { apiUrl } from '../config/api';

export default function Dashboard({ cases, onViewCase, onNewScreeningClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCompanies, setExpandedCompanies] = useState({});

  const totalCases = cases.length;
  const clearedCases = cases.filter(c => c.overallStatus === 'PASSED_CLEARED').length;
  const flaggedCases = cases.filter(c => c.overallStatus === 'FLAGGED_FOR_REVIEW').length;

  // Group historical cases by Client Account Name (company)
  const groupedCompanies = useMemo(() => {
    const map = {};
    for (const c of cases) {
      const company = (c.clientAccountName || c.clientRef || '').trim() || 'Unassigned / Direct Screenings';
      if (!map[company]) {
        map[company] = {
          name: company,
          cases: [],
          clearedCount: 0,
          flaggedCount: 0,
          latestDate: ''
        };
      }
      map[company].cases.push(c);
      if (c.overallStatus === 'PASSED_CLEARED') {
        map[company].clearedCount += 1;
      } else {
        map[company].flaggedCount += 1;
      }
      if (!map[company].latestDate || new Date(c.createdAt) > new Date(map[company].latestDate)) {
        map[company].latestDate = c.checkDate || (c.createdAt ? c.createdAt.split('T')[0] : '');
      }
    }

    return Object.values(map).sort((a, b) => {
      // Unassigned always at the end
      if (a.name === 'Unassigned / Direct Screenings') return 1;
      if (b.name === 'Unassigned / Direct Screenings') return -1;
      return a.name.localeCompare(b.name);
    });
  }, [cases]);

  // Filter companies and cases based on search term
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groupedCompanies;
    const term = searchTerm.toLowerCase();

    return groupedCompanies
      .map(group => {
        const companyMatches = group.name.toLowerCase().includes(term);
        const matchingCases = group.cases.filter(c =>
          c.subjectName.toLowerCase().includes(term) ||
          (c.clientAccountName && c.clientAccountName.toLowerCase().includes(term)) ||
          (c.clientRef && c.clientRef.toLowerCase().includes(term))
        );

        if (companyMatches) {
          return group;
        } else if (matchingCases.length > 0) {
          return {
            ...group,
            cases: matchingCases
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [groupedCompanies, searchTerm]);

  const toggleCompany = (companyName) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyName]: !prev[companyName]
    }));
  };

  const expandAll = () => {
    const all = {};
    for (const g of filteredGroups) all[g.name] = true;
    setExpandedCompanies(all);
  };

  const collapseAll = () => {
    setExpandedCompanies({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header & Quick Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            Compliance Audit & Screening Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Historical AML & sanctions screening records grouped by Client Account Name (Parent Company).
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
          <div style={{ fontSize: '12px', color: '#1d4ed8', marginTop: '4px' }}>Across {groupedCompanies.length} Client Accounts</div>
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
            Client Accounts (Companies)
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1d4ed8' }}>{groupedCompanies.length}</div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Associated parent entities</div>
        </div>

      </div>

      {/* Grouped Historical Records Section */}
      <section className="white-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
              Historical Records by Client Account Name
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Showing {filteredGroups.length} companies ({totalCases} individual screening records)
            </span>
          </div>

          {/* Search & Collapse Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search company or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px', fontSize: '12.5px', height: '36px' }}
              />
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Icons.Search />
              </div>
            </div>

            <button
              onClick={expandAll}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', height: '36px' }}
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', height: '36px' }}
            >
              Collapse All
            </button>
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
            No background screening cases match your search.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredGroups.map((group) => {
              const isExpanded = expandedCompanies[group.name] ?? false;

              return (
                <div
                  key={group.name}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    transition: 'box-shadow 0.2s ease',
                    boxShadow: isExpanded ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {/* Company Header Row */}
                  <div
                    onClick={() => toggleCompany(group.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      backgroundColor: isExpanded ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0
                        }}
                      >
                        {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                      </button>

                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icons.Building />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                            {group.name}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {group.cases.length} {group.cases.length === 1 ? 'Screening' : 'Screenings'}
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                          Latest Audit: {group.latestDate || 'Recent'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {group.clearedCount > 0 && (
                        <span className="badge-clear" style={{ fontSize: '11px', padding: '3px 8px' }}>
                          {group.clearedCount} Cleared
                        </span>
                      )}
                      {group.flaggedCount > 0 && (
                        <span className="badge-match" style={{ fontSize: '11px', padding: '3px 8px' }}>
                          {group.flaggedCount} Review
                        </span>
                      )}
                      <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, marginLeft: '6px' }}>
                        {isExpanded ? 'Hide' : 'Expand'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Associated Screenings Table */}
                  {isExpanded && (
                    <div style={{ overflowX: 'auto', padding: '8px 18px 18px 18px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '10px 12px' }}>Subject Name</th>
                            <th style={{ padding: '10px 12px' }}>Type</th>
                            <th style={{ padding: '10px 12px' }}>Client Account</th>
                            <th style={{ padding: '10px 12px' }}>Applicable Date</th>
                            <th style={{ padding: '10px 12px' }}>Check Date</th>
                            <th style={{ padding: '10px 12px' }}>Result</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.cases.map((c) => {
                            // Determine applicable date string
                            let dateTag = '—';
                            if (c.selectedDateType === 'issDate' || (c.issDate && c.issDate.toLowerCase() !== 'notset')) {
                              dateTag = `Iss: ${c.selectedDate || c.issDate}`;
                            } else if (c.selectedDateType === 'expDate' || (c.expDate && c.expDate.toLowerCase() !== 'notset')) {
                              dateTag = `Exp: ${c.selectedDate || c.expDate}`;
                            } else if (c.selectedDateType === 'signedDate' || (c.signedDate && c.signedDate.toLowerCase() !== 'notset')) {
                              dateTag = `Signed: ${c.selectedDate || c.signedDate}`;
                            }

                            return (
                              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#0f172a' }}>
                                <td style={{ padding: '12px 12px', fontWeight: 700, color: '#0f172a' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#64748b' }}><Icons.User /></span>
                                    <span>{c.subjectName}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '12px 12px', color: '#334155' }}>{c.subjectType}</td>
                                <td style={{ padding: '12px 12px', color: '#475569', fontWeight: 600 }}>
                                  {c.clientAccountName || c.clientRef || group.name}
                                </td>
                                <td style={{ padding: '12px 12px', color: '#334155', fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>
                                  {dateTag}
                                </td>
                                <td style={{ padding: '12px 12px', color: '#334155' }}>{c.checkDate}</td>
                                <td style={{ padding: '12px 12px' }}>
                                  {c.overallStatus === 'PASSED_CLEARED' ? (
                                    <span className="badge-clear">Cleared</span>
                                  ) : (
                                    <span className="badge-match">Review</span>
                                  )}
                                </td>
                                <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                                    <button
                                      onClick={() => onViewCase(c)}
                                      className="btn-secondary"
                                      style={{ padding: '5px 12px', fontSize: '11.5px' }}
                                    >
                                      View 4 PDFs
                                    </button>
                                    <a
                                      href={apiUrl(`/api/screenings/${c.id}/download-zip`)}
                                      className="btn-secondary"
                                      style={{ padding: '5px 10px', fontSize: '11.5px', color: '#1d4ed8' }}
                                      title="Download ZIP"
                                    >
                                      <Icons.ZipArchive />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
