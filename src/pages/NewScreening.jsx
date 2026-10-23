import React, { useState, useEffect } from 'react';
import { Icons } from '../components/Icons';
import SourceListsBar from '../components/SourceListsBar';
import PdfViewerModal from '../components/PdfViewerModal';
import { apiUrl } from '../config/api';

export default function NewScreening({
  sourceLists,
  refreshingLists,
  onRefreshLists,
  onCaseCreated,
  initialCaseResult = null
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const getDefaultQuery = (name) => {
    if (!name || !name.trim()) return '';
    return `"${name.trim()}" criminal OR fraud OR sanctions OR charges OR arrest`;
  };

  // Form starts clean without hardcoded dummy/sample values
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectType: 'Individual', // Individual or Entity
    clientAccountName: '',
    selectedDateType: null, // 'issDate' | 'expDate' | 'signedDate' | null
    issDate: '',
    expDate: '',
    signedDate: '',
    checkDate: todayStr,
    googleSearchQuery: ''
  });

  const [queryCustomized, setQueryCustomized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [caseResult, setCaseResult] = useState(initialCaseResult);
  const [errorMsg, setErrorMsg] = useState('');
  const [viewingPdf, setViewingPdf] = useState(null);

  useEffect(() => {
    if (initialCaseResult) {
      setCaseResult(initialCaseResult);
    }
  }, [initialCaseResult]);

  // Handle subject name change and sync default query if not manually customized
  const handleSubjectNameChange = (name) => {
    setFormData(prev => ({
      ...prev,
      subjectName: name,
      googleSearchQuery: queryCustomized
        ? prev.googleSearchQuery
        : (name.trim() ? getDefaultQuery(name) : '')
    }));
  };

  // Mutually exclusive date selector: only one date type active at a time
  const handleToggleDateType = (type) => {
    setFormData(prev => {
      if (prev.selectedDateType === type) {
        // Deselect if already active
        return { ...prev, selectedDateType: null };
      }
      return { ...prev, selectedDateType: type };
    });
  };

  // Live formatted filenames (spaces removed, only selected date in YYYYMMDD, no NotSet, Clear tag)
  const cleanName = formData.subjectName.trim()
    ? formData.subjectName.trim().replace(/\s+/g, '').replace(/[^a-zA-Z0-9-]/g, '')
    : 'SubjectName';

  let datePart = '';
  if (formData.selectedDateType === 'issDate' && formData.issDate) {
    const ymd = formData.issDate.replace(/\D/g, '');
    if (ymd) datePart = `_Iss_${ymd}`;
  } else if (formData.selectedDateType === 'expDate' && formData.expDate) {
    const ymd = formData.expDate.replace(/\D/g, '');
    if (ymd) datePart = `_Exp_${ymd}`;
  } else if (formData.selectedDateType === 'signedDate' && formData.signedDate) {
    const ymd = formData.signedDate.replace(/\D/g, '');
    if (ymd) datePart = `_Signed_${ymd}`;
  }

  const previewFilenames = {
    adverseMedia: `COMAdverseMedia_${cleanName}${datePart}_Clear.pdf`,
    ofac: `COMOFAC_${cleanName}${datePart}_Clear.pdf`,
    un: `COMUN_${cleanName}${datePart}_Clear.pdf`,
    uae: `COMUAE_${cleanName}${datePart}_Clear.pdf`
  };

  const handleStartScreening = async (e) => {
    e.preventDefault();
    if (!formData.subjectName.trim()) {
      setErrorMsg('Please enter an individual or entity name.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setStep(1);

    const timer = setInterval(() => {
      setStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const activeDateVal =
        formData.selectedDateType === 'issDate' ? formData.issDate :
          formData.selectedDateType === 'expDate' ? formData.expDate :
            formData.selectedDateType === 'signedDate' ? formData.signedDate : '';

      const payload = {
        subjectName: formData.subjectName.trim(),
        subjectType: formData.subjectType,
        clientAccountName: formData.clientAccountName.trim(),
        clientRef: formData.clientAccountName.trim(), // backward compat
        selectedDateType: formData.selectedDateType,
        selectedDate: activeDateVal,
        issDate: formData.selectedDateType === 'issDate' ? formData.issDate : '',
        expDate: formData.selectedDateType === 'expDate' ? formData.expDate : '',
        signedDate: formData.selectedDateType === 'signedDate' ? formData.signedDate : '',
        checkDate: formData.checkDate,
        googleSearchQuery: (formData.googleSearchQuery || getDefaultQuery(formData.subjectName)).trim()
      };

      const res = await fetch(apiUrl('/api/screenings/start'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Screening failed');

      setCaseResult(result.caseData);
      if (onCaseCreated) onCaseCreated(result.caseData);
    } catch (err) {
      setErrorMsg(err.message || 'Screening execution failed.');
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Official Lists Top Bar */}
      <SourceListsBar
        sourceLists={sourceLists}
        refreshing={refreshingLists}
        onRefresh={onRefreshLists}
      />

      {/* Error Banner */}
      {errorMsg && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#9f1239',
          fontSize: '13.5px',
          fontWeight: 600
        }}>
          <Icons.AlertTriangle />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Screening Registration Form */}
      <section className="white-panel" style={{ padding: '28px' }}>
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            1. Register Client or Shareholder for Screening
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Enter subject details and compliance dates. When you click &quot;Start Screening&quot;, the system checks list versions, runs all 4 source searches, and saves 4 evidence PDFs with strict compliance filenames.
          </p>
        </div>

        <form onSubmit={handleStartScreening}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>

            {/* Subject Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Subject Name (Individual or Entity) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={formData.subjectName}
                  onChange={(e) => handleSubjectNameChange(e.target.value)}
                  placeholder="e.g. Jerin Davis or Acme General Trading LLC"
                  required
                  style={{ paddingLeft: '38px', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                  <Icons.Search />
                </div>
              </div>
            </div>

            {/* Subject Type */}
            <div>
              <label className="form-label">Subject Type *</label>
              <select
                className="form-select"
                value={formData.subjectType}
                onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
              >
                <option value="Individual">Individual (Person / Shareholder)</option>
                <option value="Entity">Entity (Corporate / Company)</option>
              </select>
            </div>

            {/* Client Account Name */}
            <div>
              <label className="form-label">Client Account Name (Parent Company)</label>
              <input
                type="text"
                className="form-input"
                value={formData.clientAccountName}
                onChange={(e) => setFormData({ ...formData, clientAccountName: e.target.value })}
                placeholder="e.g. Acme Corporation or Apex Holdings Ltd"
              />
            </div>
          </div>

          {/* Mutually Exclusive Compliance Date Selection */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '18px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Compliance Date Selection (Mutually Exclusive)
                </span>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                  Select at most one applicable date type to include in the compliance filename. The other two will be kept blank.
                </p>
              </div>
              {formData.selectedDateType && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, selectedDateType: null })}
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Clear Date Selection
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

              {/* Issue Date */}
              <div style={{
                backgroundColor: formData.selectedDateType === 'issDate' ? '#ffffff' : '#f1f5f9',
                border: formData.selectedDateType === 'issDate' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Issue Date (Iss)</label>
                  <label style={{ fontSize: '11.5px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.selectedDateType === 'issDate'}
                      onChange={() => handleToggleDateType('issDate')}
                    />
                    <span>Has Issue Date</span>
                  </label>
                </div>
                <input
                  type="date"
                  className="form-input"
                  value={formData.issDate}
                  onChange={(e) => setFormData({ ...formData, issDate: e.target.value })}
                  disabled={formData.selectedDateType !== 'issDate'}
                  style={{
                    opacity: formData.selectedDateType === 'issDate' ? 1 : 0.45,
                    backgroundColor: formData.selectedDateType === 'issDate' ? '#ffffff' : '#f8fafc'
                  }}
                />
              </div>

              {/* Expiry Date */}
              <div style={{
                backgroundColor: formData.selectedDateType === 'expDate' ? '#ffffff' : '#f1f5f9',
                border: formData.selectedDateType === 'expDate' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Expiry Date (Exp)</label>
                  <label style={{ fontSize: '11.5px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.selectedDateType === 'expDate'}
                      onChange={() => handleToggleDateType('expDate')}
                    />
                    <span>Has Expiry</span>
                  </label>
                </div>
                <input
                  type="date"
                  className="form-input"
                  value={formData.expDate}
                  onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                  disabled={formData.selectedDateType !== 'expDate'}
                  style={{
                    opacity: formData.selectedDateType === 'expDate' ? 1 : 0.45,
                    backgroundColor: formData.selectedDateType === 'expDate' ? '#ffffff' : '#f8fafc'
                  }}
                />
              </div>

              {/* Signed Date */}
              <div style={{
                backgroundColor: formData.selectedDateType === 'signedDate' ? '#ffffff' : '#f1f5f9',
                border: formData.selectedDateType === 'signedDate' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Signed Date</label>
                  <label style={{ fontSize: '11.5px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.selectedDateType === 'signedDate'}
                      onChange={() => handleToggleDateType('signedDate')}
                    />
                    <span>Has Signed</span>
                  </label>
                </div>
                <input
                  type="date"
                  className="form-input"
                  value={formData.signedDate}
                  onChange={(e) => setFormData({ ...formData, signedDate: e.target.value })}
                  disabled={formData.selectedDateType !== 'signedDate'}
                  style={{
                    opacity: formData.selectedDateType === 'signedDate' ? 1 : 0.45,
                    backgroundColor: formData.selectedDateType === 'signedDate' ? '#ffffff' : '#f8fafc'
                  }}
                />
              </div>

              {/* Check Date (Audit timestamp) */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Source Check Date *</label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Audit timestamp</span>
                </div>
                <input
                  type="date"
                  className="form-input"
                  value={formData.checkDate}
                  onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                  required
                />
              </div>

            </div>
          </div>

          {/* Editable Google Adverse Media Search Query */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <label className="form-label" style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Google Adverse Media Search Query (Editable)
                </label>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0 }}>
                  Modify the keywords and search criteria before screening or use the default compliance adverse media query.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, googleSearchQuery: getDefaultQuery(prev.subjectName) }));
                  setQueryCustomized(false);
                }}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
              >
                Reset to Default Query
              </button>
            </div>
            <textarea
              className="form-input"
              rows={2}
              value={formData.googleSearchQuery}
              onChange={(e) => {
                setQueryCustomized(true);
                setFormData({ ...formData, googleSearchQuery: e.target.value });
              }}
              placeholder='Auto-generates as you enter a Subject Name, e.g. "Subject Name" criminal OR fraud OR sanctions OR charges OR arrest'
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: '1.5',
                color: '#0f172a',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Standardized Filenames Preview */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1d4ed8' }}>
                Standardized Evidence Filenames Preview
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Appends _Clear.pdf or _NotClear.pdf based on outcome
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#0f172a' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>1. AdverseMedia: </span>{previewFilenames.adverseMedia}
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#059669', fontWeight: 600 }}>2. OFAC: </span>{previewFilenames.ofac}
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#d97706', fontWeight: 600 }}>3. UN: </span>{previewFilenames.un}
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>4. UAE: </span>{previewFilenames.uae}
              </div>
            </div>
          </div>

          {/* Stepper & Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="animate-spin" style={{ color: '#1d4ed8' }}><Icons.Refresh /></div>
                  <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600 }}>
                    {step === 1 && 'Checking official list versions & verifying freshness...'}
                    {step === 2 && 'Executing Google adverse media & risk queries...'}
                    {step === 3 && 'Automating OFAC Sanctions Search form submission...'}
                    {step === 4 && 'Scanning UN & UAE lists and generating 4 PDFs...'}
                  </div>
                </div>
              ) : formData.subjectName.trim() ? (
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Ready to screen subject: <strong style={{ color: '#0f172a' }}>{formData.subjectName}</strong>
                  {formData.clientAccountName && (
                    <span> under company: <strong style={{ color: '#0f172a' }}>{formData.clientAccountName}</strong></span>
                  )}
                </span>
              ) : (
                <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                  Enter subject name and details above to initiate screening
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !formData.subjectName.trim()}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '14.5px',
                opacity: (!formData.subjectName.trim() && !loading) ? 0.6 : 1,
                cursor: (!formData.subjectName.trim() && !loading) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Icons.Refresh spin={true} />
                  <span>Screening in progress...</span>
                </>
              ) : (
                <>
                  <Icons.Shield />
                  <span>Start Screening (Generate 4 PDFs)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Generated Evidence Results */}
      {caseResult && (
        <section className="white-panel" style={{ padding: '26px', border: '2px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Evidence Dossier: {caseResult.subjectName}
                </h3>
                {caseResult.overallStatus === 'PASSED_CLEARED' ? (
                  <span className="badge-clear"><Icons.CheckCircle /> CLEARED</span>
                ) : (
                  <span className="badge-match"><Icons.AlertTriangle /> FLAGGED / REVIEW</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Case ID: <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{caseResult.id}</span> |
                Client Account: <strong style={{ color: '#0f172a' }}>{caseResult.clientAccountName || caseResult.clientRef || 'N/A'}</strong> |
                Generated on: {new Date(caseResult.createdAt).toLocaleString()} |
                Type: {caseResult.subjectType}
              </p>
            </div>

            <a
              href={apiUrl(`/api/screenings/${caseResult.id}/download-zip`)}
              className="btn-secondary"
              style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8' }}
            >
              <Icons.ZipArchive />
              <span>Download All Evidence (ZIP Dossier)</span>
            </a>
          </div>

          {/* 4 Cards for 4 Generated PDFs with In-App Preview & Download */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {caseResult.files.map((file) => (
              <div
                key={file.key}
                style={{
                  backgroundColor: file.matchStatus === 'POTENTIAL_MATCH' ? '#fff1f2' : '#ffffff',
                  border: file.matchStatus === 'POTENTIAL_MATCH' ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icons.FilePdf />
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{file.sourceName}</span>
                    </div>
                    {file.matchStatus === 'POTENTIAL_MATCH' ? (
                      <span className="badge-match"><Icons.AlertTriangle /> FLAGGED</span>
                    ) : (
                      <span className="badge-clear"><Icons.CheckCircle /> CLEARED</span>
                    )}
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#1d4ed8',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #dbeafe',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    wordBreak: 'break-all',
                    marginBottom: '8px'
                  }}>
                    {file.filename}
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
                    {file.matchDetails}
                  </p>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setViewingPdf(file)}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="View PDF inside the application"
                  >
                    <Icons.Eye />
                    <span>View</span>
                  </button>

                  <a
                    href={apiUrl(`/api/screenings/${caseResult.id}/download/${encodeURIComponent(file.filename)}`)}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Download PDF directly"
                  >
                    <Icons.Download />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In-App PDF Preview Modal */}
      {viewingPdf && caseResult && (
        <PdfViewerModal
          file={viewingPdf}
          caseId={caseResult.id}
          onClose={() => setViewingPdf(null)}
        />
      )}

    </div>
  );
}
